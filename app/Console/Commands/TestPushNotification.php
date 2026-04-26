<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('push:test {user_id}')]
#[Description('Send a test push notification to a user')]
class TestPushNotification extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(\App\Services\PushNotificationService $pushService)
    {
        $userId = $this->argument('user_id');
        $user = \App\Models\User::find($userId);

        if (!$user) {
            $this->error('User not found');
            return;
        }

        $this->info("Sending test notification to user: {$user->name}");

        $pushService->sendToUser(
            $user,
            'Test Notification',
            'This is a test notification from Moe Limo Hub!',
            '/dashboard'
        );

        $this->info('Done!');
    }
}

