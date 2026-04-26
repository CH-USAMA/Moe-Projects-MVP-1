<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Ticket;
use App\Models\TicketMessage;

class TicketService
{
    protected AutomationEngine $automationEngine;

    public function __construct(AutomationEngine $automationEngine)
    {
        $this->automationEngine = $automationEngine;
    }

    /**
     * Create a ticket from any source.
     */
    public function createTicket(array $data): Ticket
    {
        $customer = $this->findOrCreateCustomer($data['customer_email'], $data['customer_name'] ?? null);

        $ticket = Ticket::create([
            'customer_id' => $customer->id,
            'subject' => $data['subject'] ?? 'No Subject',
            'status' => 'open',
            'priority' => $data['priority'] ?? 'medium',
            'source' => $data['source'] ?? 'manual',
            'last_message_at' => now(),
        ]);

        if (!empty($data['body'])) {
            $this->addMessage($ticket, [
                'body' => $data['body'],
                'sender_id' => $customer->id,
                'sender_type' => Customer::class,
                'message_id' => $data['message_id'] ?? null,
                'in_reply_to' => $data['in_reply_to'] ?? null,
            ]);
        }

        // Run automation rules
        $this->automationEngine->evaluate($ticket);

        return $ticket->load(['customer', 'messages', 'assignedAgent']);
    }

    /**
     * Add a message to an existing ticket.
     */
    public function addMessage(Ticket $ticket, array $data): TicketMessage
    {
        $message = $ticket->messages()->create([
            'sender_id' => $data['sender_id'] ?? null,
            'sender_type' => $data['sender_type'] ?? null,
            'body' => $data['body'],
            'type' => $data['type'] ?? 'message',
            'message_id' => $data['message_id'] ?? null,
            'in_reply_to' => $data['in_reply_to'] ?? null,
        ]);

        $ticket->update(['last_message_at' => now()]);

        return $message;
    }

    /**
     * Find an existing ticket by email threading headers.
     */
    public function findTicketByThread(string $inReplyTo = null, string $references = null): ?Ticket
    {
        if ($inReplyTo) {
            $message = TicketMessage::where('message_id', $inReplyTo)->first();
            if ($message) return $message->ticket;
        }

        if ($references) {
            $refIds = preg_split('/\s+/', trim($references));
            foreach ($refIds as $refId) {
                $message = TicketMessage::where('message_id', $refId)->first();
                if ($message) return $message->ticket;
            }
        }

        return null;
    }

    /**
     * Find or create a customer by email.
     */
    protected function findOrCreateCustomer(string $email, ?string $name = null): Customer
    {
        return Customer::firstOrCreate(
            ['email' => strtolower(trim($email))],
            ['name' => $name ?? explode('@', $email)[0]]
        );
    }

    /**
     * Update ticket status.
     */
    public function updateStatus(Ticket $ticket, string $status): Ticket
    {
        $ticket->update(['status' => $status]);
        return $ticket->fresh();
    }

    /**
     * Assign ticket to agent.
     */
    public function assignAgent(Ticket $ticket, int $agentId): Ticket
    {
        $ticket->update(['assigned_to' => $agentId]);
        return $ticket->fresh();
    }
}
