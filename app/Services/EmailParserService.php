<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EmailParserService
{
    protected TicketService $ticketService;

    public function __construct(TicketService $ticketService)
    {
        $this->ticketService = $ticketService;
    }

    /**
     * Parse inbound email webhook payload (generic format).
     * Works with SendGrid, Postmark, Mailgun-style payloads.
     */
    public function parseInbound(array $payload): void
    {
        $from = $this->extractEmail($payload['from'] ?? $payload['From'] ?? '');
        $fromName = $this->extractName($payload['from'] ?? $payload['From'] ?? '');
        $subject = $payload['subject'] ?? $payload['Subject'] ?? 'No Subject';
        $body = $payload['html'] ?? $payload['TextBody'] ?? $payload['text'] ?? $payload['body-plain'] ?? '';
        $messageId = $payload['Message-ID'] ?? $payload['MessageID'] ?? $payload['message-id'] ?? null;
        $inReplyTo = $payload['In-Reply-To'] ?? $payload['in-reply-to'] ?? null;
        $references = $payload['References'] ?? $payload['references'] ?? null;

        if (empty($from)) {
            Log::warning('Email parser: no from address found', $payload);
            return;
        }

        // Check for duplicate message
        if ($messageId && \App\Models\TicketMessage::where('message_id', $messageId)->exists()) {
            Log::info("Email parser: duplicate message_id {$messageId}, skipping");
            return;
        }

        // Try to find existing ticket by thread
        $existingTicket = $this->ticketService->findTicketByThread($inReplyTo, $references);

        if ($existingTicket) {
            // Append to existing ticket
            $customer = \App\Models\Customer::where('email', strtolower(trim($from)))->first();
            $this->ticketService->addMessage($existingTicket, [
                'body' => $this->sanitizeHtml($body),
                'sender_id' => $customer?->id,
                'sender_type' => $customer ? \App\Models\Customer::class : null,
                'message_id' => $messageId,
                'in_reply_to' => $inReplyTo,
            ]);

            // Reopen if resolved/closed
            if (in_array($existingTicket->status, ['resolved', 'closed'])) {
                $this->ticketService->updateStatus($existingTicket, 'open');
            }

            Log::info("Email appended to ticket #{$existingTicket->id}");
        } else {
            // Create new ticket
            $ticket = $this->ticketService->createTicket([
                'customer_email' => $from,
                'customer_name' => $fromName,
                'subject' => $subject,
                'body' => $this->sanitizeHtml($body),
                'source' => 'email',
                'message_id' => $messageId,
                'in_reply_to' => $inReplyTo,
            ]);

            Log::info("New ticket #{$ticket->id} created from email");
        }
    }

    /**
     * Extract email from "Name <email@example.com>" format.
     */
    protected function extractEmail(string $from): string
    {
        if (preg_match('/<(.+?)>/', $from, $matches)) {
            return strtolower(trim($matches[1]));
        }
        return strtolower(trim($from));
    }

    /**
     * Extract name from "Name <email@example.com>" format.
     */
    protected function extractName(string $from): ?string
    {
        if (preg_match('/^(.+?)\s*</', $from, $matches)) {
            return trim($matches[1], ' "\'');
        }
        return null;
    }

    /**
     * Basic HTML sanitization.
     */
    protected function sanitizeHtml(string $html): string
    {
        return strip_tags($html, '<p><br><strong><em><ul><ol><li><a><blockquote><h1><h2><h3><h4><h5><h6><pre><code><img><div><span><table><tbody><tr><td><thead><tfoot>');
    }

    /**
     * Parse a native Webklex IMAP message object.
     */
    public function parseImapMessage(\Webklex\PHPIMAP\Message $message): void
    {
        $fromEmail = $message->getFrom()[0]->mail ?? '';
        $fromName = $message->getFrom()[0]->personal ?? '';
        $subject = (string) $message->getSubject() ?: 'No Subject';
        
        $bodyHtml = $message->hasHTMLBody() ? $message->getHTMLBody() : '';
        $bodyText = $message->hasTextBody() ? $message->getTextBody() : '';
        $body = !empty($bodyHtml) ? $bodyHtml : nl2br($bodyText);

        $messageId = (string) $message->getMessageId();
        $inReplyTo = (string) $message->getInReplyTo();
        $references = (string) $message->getReferences();

        // Map this to the generic parse array
        $this->parseInbound([
            'from' => $fromName ? "{$fromName} <{$fromEmail}>" : $fromEmail,
            'subject' => $subject,
            'html' => $body,
            'Message-ID' => $messageId,
            'In-Reply-To' => $inReplyTo,
            'References' => $references,
        ]);
    }
}
