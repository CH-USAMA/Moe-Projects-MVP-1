<?php

namespace App\Http\Controllers;

use App\Services\SettingsService;
use App\Services\GHLService;
use App\Services\SMSService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    protected SettingsService $settings;

    public function __construct(SettingsService $settings)
    {
        $this->settings = $settings;
    }

    // ─── EMAIL SETTINGS ──────────────────────────────

    public function email()
    {
        return Inertia::render('Settings/Email', [
            'settings' => $this->settings->getGroup('email'),
        ]);
    }

    public function updateEmail(Request $request)
    {
        $this->settings->setMany([
            'email_inbound_address' => $request->email_inbound_address,
            'email_forwarding_to' => $request->email_forwarding_to,
            'email_imap_host' => $request->email_imap_host,
            'email_imap_port' => $request->email_imap_port,
            'email_imap_username' => $request->email_imap_username,
            'email_imap_encryption' => $request->email_imap_encryption,
            'email_smtp_host' => $request->email_smtp_host,
            'email_smtp_port' => $request->email_smtp_port,
            'email_smtp_username' => $request->email_smtp_username,
            'email_smtp_encryption' => $request->email_smtp_encryption,
            'email_sender_name' => $request->email_sender_name,
            'email_sender_address' => $request->email_sender_address,
            'email_signature' => $request->email_signature,
            'email_enabled' => $request->boolean('email_enabled'),
        ], 'email', ['email_imap_password', 'email_smtp_password']);

        // Save encrypted passwords separately
        if ($request->filled('email_imap_password')) {
            $this->settings->set('email_imap_password', $request->email_imap_password, 'email', true);
        }
        if ($request->filled('email_smtp_password')) {
            $this->settings->set('email_smtp_password', $request->email_smtp_password, 'email', true);
        }

        return redirect()->back()->with('success', 'Email settings saved.');
    }

    // ─── GHL SETTINGS ────────────────────────────────

    public function ghl()
    {
        return Inertia::render('Settings/GHL', [
            'settings' => $this->settings->getGroup('ghl'),
        ]);
    }

    public function updateGHL(Request $request)
    {
        if ($request->filled('ghl_api_key')) {
            $this->settings->set('ghl_api_key', $request->ghl_api_key, 'ghl', true);
        }

        $this->settings->setMany([
            'ghl_webhook_url' => $request->ghl_webhook_url,
            'ghl_pipeline_mapping' => $request->ghl_pipeline_mapping,
            'ghl_enabled' => $request->boolean('ghl_enabled'),
        ], 'ghl');

        return redirect()->back()->with('success', 'GHL settings saved.');
    }

    public function testGHL(GHLService $ghlService)
    {
        $result = $ghlService->testConnection();
        return response()->json($result);
    }

    // ─── SMS SETTINGS ────────────────────────────────

    public function sms()
    {
        return Inertia::render('Settings/SMS', [
            'settings' => $this->settings->getGroup('sms'),
        ]);
    }

    public function updateSMS(Request $request)
    {
        if ($request->filled('sms_api_key')) {
            $this->settings->set('sms_api_key', $request->sms_api_key, 'sms', true);
        }

        $this->settings->setMany([
            'sms_sender_name' => $request->sms_sender_name,
            'sms_notification_numbers' => $request->sms_notification_numbers,
            'sms_escalation_recipients' => $request->sms_escalation_recipients,
            'sms_webhook_secret' => $request->sms_webhook_secret,
            'sms_enabled' => $request->boolean('sms_enabled'),
        ], 'sms');

        return redirect()->back()->with('success', 'SMS settings saved.');
    }

    public function testSMS(SMSService $smsService)
    {
        $result = $smsService->sendTest();
        return response()->json($result);
    }

    public function registerSMSWebhook(SMSService $smsService)
    {
        $url = url('/webhooks/sms');
        $result = $smsService->registerWebhook($url);
        return response()->json($result);
    }

    // ─── SLA SETTINGS ────────────────────────────────

    public function sla()
    {
        return Inertia::render('Settings/SLA', [
            'settings' => $this->settings->getGroup('sla'),
        ]);
    }

    public function updateSLA(Request $request)
    {
        $this->settings->setMany([
            'sla_level1_hours' => $request->sla_level1_hours,
            'sla_level1_color' => $request->sla_level1_color,
            'sla_level2_hours' => $request->sla_level2_hours,
            'sla_level2_color' => $request->sla_level2_color,
            'sla_level3_hours' => $request->sla_level3_hours,
            'sla_level3_color' => $request->sla_level3_color,
            'sla_enabled' => $request->boolean('sla_enabled'),
        ], 'sla');

        return redirect()->back()->with('success', 'SLA settings saved.');
    }
}
