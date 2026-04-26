<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SMSService
{
    protected SettingsService $settings;

    public function __construct(SettingsService $settings)
    {
        $this->settings = $settings;
    }

    /**
     * Send an SMS alert via Mobile Text Alerts API.
     */
    public function sendAlert(string $message, ?array $recipients = null): array
    {
        $apiKey = $this->settings->get('sms_api_key');
        $isEnabled = $this->settings->get('sms_enabled', false);

        if (!$isEnabled || !$apiKey) {
            return ['success' => false, 'message' => 'SMS not enabled or API key missing'];
        }

        $numbers = $recipients ?? $this->settings->get('sms_notification_numbers', []);

        if (empty($numbers)) {
            return ['success' => false, 'message' => 'No notification numbers configured'];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.mobile-text-alerts.com/v3/messages', [
                'message' => $message,
                'numbers' => is_array($numbers) ? $numbers : [$numbers],
            ]);

            if ($response->successful()) {
                Log::info('SMS sent successfully', ['message' => substr($message, 0, 50)]);
                return ['success' => true, 'message' => 'SMS sent'];
            }

            Log::warning('SMS send failed', ['status' => $response->status(), 'body' => $response->body()]);
            return ['success' => false, 'message' => 'API error: ' . $response->status()];
        } catch (\Exception $e) {
            Log::error('SMS send exception: ' . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Send test SMS.
     */
    public function sendTest(): array
    {
        return $this->sendAlert('🚗 Moe Limo test alert — SMS integration is working!');
    }

    /**
     * Handle inbound SMS webhook from Mobile Text Alerts (V3 API).
     */
    public function handleInbound(array $payload): void
    {
        Log::info('Processing inbound SMS webhook', $payload);

        $event = $payload['event'] ?? '';

        if ($event !== 'message-reply') {
            Log::info("SMS webhook ignored: event is '{$event}'");
            return;
        }

        $phone = $payload['fromNumber'] ?? null;
        $message = $payload['message'] ?? '';

        if (!$phone || !$message) {
            Log::warning('SMS webhook missing fromNumber or message');
            return;
        }

        // Find customer by phone
        $customer = \App\Models\Customer::where('phone', 'like', "%{$phone}%")->first();
        $email = $customer ? $customer->email : "{$phone}@sms.local";
        $name = $customer ? $customer->name : "SMS Contact ({$phone})";

        $ticketService = app(TicketService::class);

        // Find latest open ticket for this customer from SMS
        $ticket = $customer ? $customer->tickets()
            ->where('source', 'sms')
            ->whereNotIn('status', ['closed'])
            ->latest()
            ->first() : null;

        if ($ticket) {
            $ticketService->addMessage($ticket, [
                'body' => $message,
                'type' => 'message',
                'sender_type' => 'customer',
            ]);
        } else {
            $ticketService->createTicket([
                'customer_email' => $email,
                'customer_name' => $name,
                'subject' => "[SMS] New message from {$phone}",
                'body' => $message,
                'source' => 'sms',
                'priority' => 'medium',
            ]);
        }
    }

    /**
     * Automatically register the inbound webhook with Mobile Text Alerts.
     */
    public function registerWebhook(string $url): array
    {
        $apiKey = $this->settings->get('sms_api_key');
        if (!$apiKey) return ['success' => false, 'message' => 'API key not found'];

        // Optional secret for security
        $secret = $this->settings->get('sms_webhook_secret') ?: bin2hex(random_bytes(16));
        $this->settings->set('sms_webhook_secret', $secret, 'sms');

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.mobile-text-alerts.com/v3/webhooks', [
                'event' => 'message-reply',
                'url' => $url,
                'secret' => $secret,
                'retryOnError' => true,
            ]);

            if ($response->successful()) {
                return ['success' => true, 'message' => 'Webhook registered successfully', 'data' => $response->json()];
            }

            return ['success' => false, 'message' => $response->body()];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
