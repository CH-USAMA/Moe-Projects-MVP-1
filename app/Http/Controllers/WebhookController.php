<?php

namespace App\Http\Controllers;

use App\Services\EmailParserService;
use App\Services\GHLService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    /**
     * Handle inbound email webhook (from SendGrid, Postmark, Mailgun, etc.)
     */
    public function inboundEmail(Request $request, EmailParserService $parser)
    {
        Log::info('Inbound email webhook received', $request->all());

        try {
            $parser->parseInbound($request->all());
            return response()->json(['status' => 'ok']);
        } catch (\Exception $e) {
            Log::error('Inbound email webhook error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle GoHighLevel webhook.
     */
    public function ghl(Request $request, GHLService $ghlService)
    {
        Log::info('GHL webhook received', $request->all());

        try {
            $ghlService->handleWebhook($request->all());
            return response()->json(['status' => 'ok']);
        } catch (\Exception $e) {
            Log::error('GHL webhook error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle SMS webhook (Mobile Text Alerts)
     */
    public function sms(Request $request, \App\Services\SMSService $smsService, \App\Services\SettingsService $settings)
    {
        Log::info('SMS webhook received', $request->all());

        // Validate Signature if secret is set
        $secret = $settings->get('sms_webhook_secret');
        if ($secret) {
            $signature = $request->header('X-Signature');
            $payload = $request->getContent();
            $computed = hash_hmac('sha256', $payload, $secret);

            if (!hash_equals($computed, (string)$signature)) {
                Log::warning('SMS webhook signature mismatch', ['received' => $signature, 'computed' => $computed]);
                return response()->json(['status' => 'error', 'message' => 'Invalid signature'], 403);
            }
        }

        try {
            $smsService->handleInbound($request->all());
            return response()->json(['status' => 'ok']);
        } catch (\Exception $e) {
            Log::error('SMS webhook error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
