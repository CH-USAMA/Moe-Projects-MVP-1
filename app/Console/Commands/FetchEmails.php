<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Webklex\IMAP\Facades\Client;
use App\Services\SettingsService;
use App\Services\EmailParserService;
use Illuminate\Support\Facades\Log;
use Webklex\PHPIMAP\ClientManager;

class FetchEmails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:fetch';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch unread emails via IMAP and process them into tickets';

    protected SettingsService $settings;
    protected EmailParserService $emailParser;

    public function __construct(SettingsService $settings, EmailParserService $emailParser)
    {
        parent::__construct();
        $this->settings = $settings;
        $this->emailParser = $emailParser;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!$this->settings->get('email_enabled', false)) {
            $this->info('Email integration is disabled in settings.');
            return;
        }

        $host = $this->settings->get('email_imap_host');
        $port = $this->settings->get('email_imap_port');
        $username = $this->settings->get('email_imap_username');
        $password = $this->settings->get('email_imap_password');
        $encryption = $this->settings->get('email_imap_encryption', 'ssl');

        if (!$host || !$username || !$password) {
            $this->error('IMAP credentials are not fully configured in settings.');
            return;
        }

        $this->info("Connecting to IMAP server {$host}:{$port} as {$username}...");

        try {
            $cm = new ClientManager();
            $client = $cm->make([
                'host'          => $host,
                'port'          => $port,
                'encryption'    => $encryption === 'none' ? false : $encryption,
                'validate_cert' => false,
                'username'      => $username,
                'password'      => $password,
                'protocol'      => 'imap'
            ]);

            $client->connect();

            // Get INBOX folder
            $folder = $client->getFolder('INBOX');
            
            // Get all unseen messages
            $messages = $folder->query()->unseen()->get();
            $count = $messages->count();
            
            $this->info("Found {$count} unread message(s).");

            foreach ($messages as $message) {
                try {
                    $this->info("Processing message: " . $message->getSubject());
                    
                    // Pass native IMAP message to parser
                    $this->emailParser->parseImapMessage($message);
                    
                    // Mark as read after successful processing
                    $message->setFlag('Seen');
                    
                } catch (\Exception $e) {
                    $this->error("Failed to process message: " . $e->getMessage());
                    Log::error("IMAP Fetch Error on individual message", ['error' => $e->getMessage()]);
                }
            }

            $client->disconnect();
            $this->info("Done fetching emails.");

        } catch (\Exception $e) {
            $this->error("Failed to connect or fetch emails: " . $e->getMessage());
            Log::error("IMAP Fetch Error", ['error' => $e->getMessage()]);
        }
    }
}
