<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\AutomationRuleController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\PushNotificationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


// ─── Public ──────────────────────────────────────────
Route::get('/', function () {
    return redirect()->route('login');
});

// ─── Webhooks (no auth) ──────────────────────────────
Route::prefix('webhooks')->group(function () {
    Route::post('/inbound-email', [WebhookController::class, 'inboundEmail'])->name('webhooks.email');
    Route::post('/ghl', [WebhookController::class, 'ghl'])->name('webhooks.ghl');
    Route::post('/sms', [WebhookController::class, 'sms'])->name('webhooks.sms');
});

// ─── Authenticated ───────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Tickets
    Route::get('/tickets', [TicketController::class, 'index'])->name('tickets.index');
    Route::post('/tickets', [TicketController::class, 'store'])->name('tickets.store');
    Route::get('/tickets/{ticket}', [TicketController::class, 'show'])->name('tickets.show');
    Route::post('/tickets/{ticket}/reply', [TicketController::class, 'reply'])->name('tickets.reply');
    Route::post('/tickets/{ticket}/toggle-read', [TicketController::class, 'toggleRead'])->name('tickets.toggle-read');
    Route::delete('/tickets/{ticket}', [TicketController::class, 'destroy'])->name('tickets.destroy');
    Route::patch('/tickets/{ticket}/status', [TicketController::class, 'updateStatus'])->name('tickets.status');
    Route::patch('/tickets/{ticket}/assign', [TicketController::class, 'assign'])->name('tickets.assign');
    Route::post('/tickets/bulk', [TicketController::class, 'bulkUpdate'])->name('tickets.bulk');

    // Customers
    Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('/customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');
    Route::patch('/customers/{customer}', [CustomerController::class, 'update'])->name('customers.update');
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])->name('customers.destroy');
    Route::post('/customers/bulk-delete', [CustomerController::class, 'bulkDelete'])->name('customers.bulk-delete');
    Route::post('/customers/{customer}/sync-ghl', [CustomerController::class, 'syncGHL'])->name('customers.sync-ghl');

    // Settings
    Route::prefix('settings')->middleware('can:superadmin')->name('settings.')->group(function () {

        Route::get('/email', [SettingsController::class, 'email'])->name('email');
        Route::post('/email', [SettingsController::class, 'updateEmail'])->name('email.update');

        Route::get('/ghl', [SettingsController::class, 'ghl'])->name('ghl');
        Route::post('/ghl', [SettingsController::class, 'updateGHL'])->name('ghl.update');
        Route::post('/ghl/test', [SettingsController::class, 'testGHL'])->name('ghl.test');

        Route::get('/sms', [SettingsController::class, 'sms'])->name('sms');
        Route::post('/sms', [SettingsController::class, 'updateSMS'])->name('sms.update');
        Route::post('/sms/test', [SettingsController::class, 'testSMS'])->name('sms.test');
        Route::post('/sms/register-webhook', [SettingsController::class, 'registerSMSWebhook'])->name('sms.register-webhook');

        Route::get('/sla', [SettingsController::class, 'sla'])->name('sla');
        Route::post('/sla', [SettingsController::class, 'updateSLA'])->name('sla.update');

        Route::get('/automations', [AutomationRuleController::class, 'index'])->name('automations');
        Route::post('/automations', [AutomationRuleController::class, 'store'])->name('automations.store');
        Route::patch('/automations/{automationRule}', [AutomationRuleController::class, 'update'])->name('automations.update');
        Route::delete('/automations/{automationRule}', [AutomationRuleController::class, 'destroy'])->name('automations.destroy');
    });

    // Agents
    Route::resource('agents', \App\Http\Controllers\UserController::class);

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Push Notifications
    Route::post('/push/subscribe', [PushNotificationController::class, 'subscribe'])->name('push.subscribe');
    Route::post('/push/unsubscribe', [PushNotificationController::class, 'unsubscribe'])->name('push.unsubscribe');
});


require __DIR__.'/auth.php';
