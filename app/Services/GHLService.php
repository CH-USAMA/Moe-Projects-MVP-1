<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GHLService
{
    protected SettingsService $settings;
    protected TicketService $ticketService;

    public function __construct(SettingsService $settings, TicketService $ticketService)
    {
        $this->settings = $settings;
        $this->ticketService = $ticketService;
    }

    /**
     * Handle incoming GHL webhook.
     */
    public function handleWebhook(array $payload): void
    {
        $type = $payload['type'] ?? '';

        match ($type) {
            'OpportunityCreate', 'opportunity.create' => $this->handleOpportunityCreated($payload),
            'OpportunityStageUpdate', 'opportunity.stage.update' => $this->handleStageUpdate($payload),
            default => Log::info("GHL webhook: unhandled type '{$type}'"),
        };
    }

    /**
     * Handle new opportunity → create ticket.
     */
    protected function handleOpportunityCreated(array $payload): void
    {
        $contact = $payload['contact'] ?? $payload['data']['contact'] ?? [];
        $opportunity = $payload['opportunity'] ?? $payload['data'] ?? [];

        $email = $contact['email'] ?? 'unknown@ghl.local';
        $name = trim(($contact['firstName'] ?? '') . ' ' . ($contact['lastName'] ?? ''));
        $subject = $opportunity['name'] ?? 'GHL Opportunity';
        $pipeline = $opportunity['pipelineName'] ?? $opportunity['pipeline_name'] ?? '';
        $stage = $opportunity['stageName'] ?? $opportunity['stage_name'] ?? '';

        $ticket = $this->ticketService->createTicket([
            'customer_email' => $email,
            'customer_name' => $name ?: null,
            'subject' => "[GHL] {$subject}",
            'body' => "New opportunity from GoHighLevel.\nPipeline: {$pipeline}\nStage: {$stage}\nValue: " . ($opportunity['monetaryValue'] ?? 'N/A'),
            'source' => 'ghl',
            'priority' => 'medium',
        ]);

        // Store GHL opportunity ID on customer
        $customer = $ticket->customer;
        $externalIds = $customer->external_ids ?? [];
        $externalIds['ghl_opportunity_id'] = $opportunity['id'] ?? null;
        $customer->update(['external_ids' => $externalIds]);

        Log::info("GHL opportunity created → ticket #{$ticket->id}");
    }

    /**
     * Handle opportunity stage change → update ticket.
     */
    protected function handleStageUpdate(array $payload): void
    {
        $opportunityId = $payload['opportunity']['id'] ?? $payload['data']['id'] ?? null;
        $newStage = $payload['opportunity']['stageName'] ?? $payload['data']['stage_name'] ?? 'Unknown';

        if (!$opportunityId) return;

        // Find customer with this GHL opportunity ID
        $customer = \App\Models\Customer::where('external_ids->ghl_opportunity_id', $opportunityId)->first();
        if (!$customer) {
            Log::info("GHL stage update: no customer found for opportunity {$opportunityId}");
            return;
        }

        // Find latest open ticket for this customer from GHL
        $ticket = $customer->tickets()
            ->where('source', 'ghl')
            ->whereNotIn('status', ['closed'])
            ->latest()
            ->first();

        if ($ticket) {
            $this->ticketService->addMessage($ticket, [
                'body' => "GHL opportunity stage changed to: <strong>{$newStage}</strong>",
                'type' => 'note',
            ]);
            Log::info("GHL stage update → note on ticket #{$ticket->id}");
        }
    }

    /**
     * Push a ticket back to GHL as an opportunity.
     */
    public function pushTicketToGHL(Ticket $ticket): array
    {
        $apiKey = $this->settings->get('ghl_api_key');
        if (!$apiKey) return ['success' => false, 'message' => 'GHL not configured'];

        try {
            $customer = $ticket->customer;
            $opportunityId = $customer->external_ids['ghl_opportunity_id'] ?? null;

            $payload = [
                'title' => $ticket->subject,
                'status' => 'open',
                'contactId' => $customer->external_ids['ghl_contact_id'] ?? null,
                // Default to a pipeline/stage if configured
            ];

            $url = 'https://rest.gohighlevel.com/v1/opportunities/';
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post($url, $payload);

            if ($response->successful()) {
                $data = $response->json();
                $externalIds = $customer->external_ids ?? [];
                $externalIds['ghl_opportunity_id'] = $data['id'] ?? $opportunityId;
                $customer->update(['external_ids' => $externalIds]);
                return ['success' => true, 'id' => $data['id'] ?? null];
            }

            return ['success' => false, 'message' => $response->body()];
        } catch (\Exception $e) {
            Log::error("GHL push failed: " . $e->getMessage());
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Test API connection.
     */
    public function testConnection(): array
    {
        $apiKey = $this->settings->get('ghl_api_key');

        if (!$apiKey) {
            return ['success' => false, 'message' => 'API key not configured'];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
            ])->get('https://rest.gohighlevel.com/v1/pipelines/');

            if ($response->successful()) {
                return ['success' => true, 'message' => 'Connected successfully', 'data' => $response->json()];
            }

            return ['success' => false, 'message' => 'API returned ' . $response->status()];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
