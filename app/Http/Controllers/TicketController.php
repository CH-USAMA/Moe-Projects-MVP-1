<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use App\Services\TicketService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    protected TicketService $ticketService;

    public function __construct(TicketService $ticketService)
    {
        $this->ticketService = $ticketService;
    }

    public function index(Request $request)
    {
        $query = Ticket::with(['customer', 'assignedAgent']);

        // Filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }
        if ($request->filled('source')) {
            $query->where('source', $request->source);
        }
        if ($request->filled('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        // New Category Filtering (Gmail-style tabs)
        if ($request->filled('category')) {
            $query->whereHas('customer', function($q) use ($request) {
                $q->where('category', $request->category);
            });
        }

        // Date Range Filtering
        if ($request->filled('date_range')) {
            $now = now();
            switch ($request->date_range) {
                case 'today':
                    $query->whereDate('created_at', $now->toDateString());
                    break;
                case 'yesterday':
                    $query->whereDate('created_at', $now->subDay()->toDateString());
                    break;
                case 'last_week':
                    $query->whereBetween('created_at', [$now->subWeek()->startOfWeek(), $now->endOfWeek()]);
                    break;
                case 'previous_month':
                    $query->whereBetween('created_at', [$now->subMonth()->startOfMonth(), $now->endOfMonth()]);
                    break;
                case 'custom':
                    if ($request->filled('start_date')) {
                        $query->whereDate('created_at', '>=', $request->start_date);
                    }
                    if ($request->filled('end_date')) {
                        $query->whereDate('created_at', '<=', $request->end_date);
                    }
                    break;
            }
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($cq) use ($search) {
                      $cq->where('email', 'like', "%{$search}%")
                         ->orWhere('name', 'like', "%{$search}%");
                  });
            });
        }

        $tickets = $query->latest('last_message_at')->paginate(20)->withQueryString();
        $agents = User::select('id', 'name')->get();
        $customers = \App\Models\Customer::select('id', 'name', 'email')->get();

        return Inertia::render('Tickets/Index', [
            'tickets' => $tickets,
            'agents' => $agents,
            'customers' => $customers,
            'slaSettings' => app(\App\Services\SettingsService::class)->getGroup('sla'),
            'filters' => $request->only(['status', 'priority', 'source', 'assigned_to', 'search', 'date_range', 'start_date', 'end_date', 'customer_id', 'category']),
        ]);
    }

    public function show(Ticket $ticket)
    {
        // Mark as read when viewing
        if (!$ticket->is_read) {
            $ticket->update(['is_read' => true]);
        }

        $ticket->load(['customer', 'assignedAgent', 'messages.attachments']);
        $agents = User::select('id', 'name')->get();

        return Inertia::render('Tickets/Show', [
            'ticket' => $ticket,
            'agents' => $agents,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_email' => 'required|email',
            'customer_name' => 'nullable|string|max:255',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'priority' => 'in:low,medium,high,urgent',
        ]);

        $ticket = $this->ticketService->createTicket([
            'customer_email' => $request->customer_email,
            'customer_name' => $request->customer_name,
            'subject' => $request->subject,
            'body' => $request->body,
            'priority' => $request->priority ?? 'medium',
            'source' => 'manual',
        ]);

        \App\Services\AuditService::log('Ticket Created', Ticket::class, $ticket->id);

        return redirect()->route('tickets.show', $ticket)->with('success', 'Ticket created.');
    }

    public function reply(Request $request, Ticket $ticket)
    {
        $request->validate([
            'body' => 'required|string',
            'type' => 'in:message,note',
        ]);

        $this->ticketService->addMessage($ticket, [
            'body' => $request->body,
            'type' => $request->type ?? 'message',
            'sender_id' => $request->user()->id,
            'sender_type' => User::class,
        ]);

        \App\Services\AuditService::log('Ticket Replied', Ticket::class, $ticket->id);

        return redirect()->back()->with('success', 'Reply added.');
    }

    public function updateStatus(Request $request, Ticket $ticket)
    {
        $request->validate(['status' => 'required|in:open,pending,waiting,resolved,closed']);
        $this->ticketService->updateStatus($ticket, $request->status);
        
        \App\Services\AuditService::log('Ticket Status Updated to '.$request->status, Ticket::class, $ticket->id);
        
        return redirect()->back()->with('success', 'Status updated.');
    }

    public function toggleRead(Ticket $ticket)
    {
        $ticket->update(['is_read' => !$ticket->is_read]);
        return redirect()->back()->with('success', 'Ticket marked as ' . ($ticket->is_read ? 'read' : 'unread'));
    }

    public function destroy(Ticket $ticket)
    {
        \App\Services\AuditService::log('Ticket Deleted', Ticket::class, $ticket->id, $ticket->toArray());
        $ticket->delete();
        return redirect()->route('tickets.index')->with('success', 'Ticket deleted.');
    }

    public function assign(Request $request, Ticket $ticket)
    {
        $request->validate(['assigned_to' => 'nullable|exists:users,id']);
        $this->ticketService->assignAgent($ticket, $request->assigned_to);
        
        \App\Services\AuditService::log('Ticket Assigned to user ID: '.$request->assigned_to, Ticket::class, $ticket->id);

        return redirect()->back()->with('success', 'Agent assigned.');
    }

    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:tickets,id',
            'action' => 'required|in:mark_read,mark_unread,delete',
        ]);

        if ($request->action === 'mark_read') {
            Ticket::whereIn('id', $request->ids)->update(['is_read' => true]);
            $msg = 'Tickets marked as read.';
        } elseif ($request->action === 'mark_unread') {
            Ticket::whereIn('id', $request->ids)->update(['is_read' => false]);
            $msg = 'Tickets marked as unread.';
        } elseif ($request->action === 'delete') {
            Ticket::whereIn('id', $request->ids)->delete();
            $msg = 'Tickets deleted.';
        }

        \App\Services\AuditService::log('Bulk Action: '.$request->action, Ticket::class, null, ['ids' => $request->ids]);

        return redirect()->back()->with('success', $msg);
    }
}
