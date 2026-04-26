<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Minishlink\WebPush\VAPID;

class GenerateVapidKeys extends Command
{
    protected $signature = 'vapid:generate';
    protected $description = 'Generate VAPID keys for Web Push notifications';

    public function handle(): void
    {
        $keys = VAPID::createVapidKeys();
        $this->info('VAPID_PUBLIC_KEY=' . $keys['publicKey']);
        $this->info('VAPID_PRIVATE_KEY=' . $keys['privateKey']);
        $this->newLine();
        $this->info('Add these to your .env file.');
    }
}
