<?php

namespace App\Services;

use App\Models\PushSubscription;
use App\Models\User;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

class PushNotificationService
{
    protected $webPush;

    public function __construct()
    {
        $auth = [
            'VAPID' => [
                'subject' => env('VAPID_SUBJECT', 'mailto:admin@moelimo.com'),
                'publicKey' => env('VAPID_PUBLIC_KEY'),
                'privateKey' => env('VAPID_PRIVATE_KEY'),
            ],
        ];

        $this->webPush = new WebPush($auth);
    }

    /**
     * Send a notification to a specific user.
     */
    public function sendToUser(User $user, string $title, string $body, string $url = '/')
    {
        $subscriptions = PushSubscription::where('user_id', $user->id)->get();

        foreach ($subscriptions as $sub) {
            $subscription = Subscription::create([
                'endpoint' => $sub->endpoint,
                'publicKey' => $sub->p256dh,
                'authToken' => $sub->auth,
            ]);

            $this->webPush->queueNotification(
                $subscription,
                json_encode([
                    'title' => $title,
                    'body' => $body,
                    'url' => $url,
                ])
            );
        }

        $results = [];
        foreach ($this->webPush->flush() as $report) {
            $results[] = $report;
        }
        return $results;

    }

    /**
     * Send a notification to all users.
     */
    public function sendToAll(string $title, string $body, string $url = '/')
    {
        $subscriptions = PushSubscription::all();

        foreach ($subscriptions as $sub) {
            $subscription = Subscription::create([
                'endpoint' => $sub->endpoint,
                'publicKey' => $sub->p256dh,
                'authToken' => $sub->auth,
            ]);

            $this->webPush->queueNotification(
                $subscription,
                json_encode([
                    'title' => $title,
                    'body' => $body,
                    'url' => $url,
                ])
            );
        }

        $results = [];
        foreach ($this->webPush->flush() as $report) {
            $results[] = $report;
        }
        return $results;

    }
}
