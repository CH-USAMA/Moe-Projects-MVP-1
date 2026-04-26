<?php

namespace App\Services;

use App\Models\AutomationRule;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AutomationEngine
{
    /**
     * Evaluate all active rules against a ticket.
     */
    public function evaluate(Ticket $ticket): void
    {
        $rules = AutomationRule::where('is_active', true)->get();

        foreach ($rules as $rule) {
            if ($this->matchesConditions($ticket, $rule->conditions)) {
                $this->executeActions($ticket, $rule->actions);
                Log::info("Automation rule '{$rule->name}' triggered for ticket #{$ticket->id}");
            }
        }
    }

    /**
     * Check if ticket matches all conditions.
     */
    protected function matchesConditions(Ticket $ticket, array $conditions): bool
    {
        foreach ($conditions as $condition) {
            if (!$this->evaluateCondition($ticket, $condition)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Evaluate a single condition.
     */
    protected function evaluateCondition(Ticket $ticket, array $condition): bool
    {
        $field = $condition['field'] ?? '';
        $operator = $condition['operator'] ?? 'equals';
        $value = $condition['value'] ?? '';

        $ticketValue = match ($field) {
            'subject' => $ticket->subject,
            'source' => $ticket->source,
            'priority' => $ticket->priority,
            'status' => $ticket->status,
            'customer_email' => $ticket->customer?->email ?? '',
            'customer_tags' => $ticket->customer?->tags ?? [],
            default => null,
        };

        if ($ticketValue === null) return false;

        return match ($operator) {
            'equals' => strtolower((string)$ticketValue) === strtolower($value),
            'contains' => str_contains(strtolower((string)$ticketValue), strtolower($value)),
            'starts_with' => str_starts_with(strtolower((string)$ticketValue), strtolower($value)),
            'in' => is_array($ticketValue) && in_array($value, $ticketValue),
            default => false,
        };
    }

    /**
     * Execute actions on a ticket.
     */
    protected function executeActions(Ticket $ticket, array $actions): void
    {
        foreach ($actions as $action) {
            $this->executeAction($ticket, $action);
        }
    }

    /**
     * Execute a single action.
     */
    protected function executeAction(Ticket $ticket, array $action): void
    {
        $type = $action['type'] ?? '';
        $value = $action['value'] ?? '';

        match ($type) {
            'assign_agent' => $ticket->update(['assigned_to' => $value]),
            'change_priority' => $ticket->update(['priority' => $value]),
            'change_status' => $ticket->update(['status' => $value]),
            'add_tag' => $this->addTagToCustomer($ticket, $value),
            'send_sms' => $this->triggerSms($ticket, $value),
            'sync_to_ghl' => $this->triggerGhl($ticket),
            default => Log::warning("Unknown automation action: {$type}"),
        };
    }

    protected function triggerGhl(Ticket $ticket): void
    {
        try {
            app(GHLService::class)->pushTicketToGHL($ticket);
        } catch (\Exception $e) {
            Log::error("Automation GHL sync failed: " . $e->getMessage());
        }
    }

    protected function addTagToCustomer(Ticket $ticket, string $tag): void
    {
        $customer = $ticket->customer;
        if ($customer) {
            $tags = $customer->tags ?? [];
            if (!in_array($tag, $tags)) {
                $tags[] = $tag;
                $customer->update(['tags' => $tags]);
            }
        }
    }

    protected function triggerSms(Ticket $ticket, string $message): void
    {
        try {
            app(SMSService::class)->sendAlert(
                str_replace(['{ticket_id}', '{subject}'], [$ticket->id, $ticket->subject], $message)
            );
        } catch (\Exception $e) {
            Log::error("Automation SMS failed: " . $e->getMessage());
        }
    }
}
