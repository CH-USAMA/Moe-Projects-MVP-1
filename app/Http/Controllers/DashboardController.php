<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Customer;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $dateRange = $request->input('date_range', 'all');
        $query = Ticket::query();

        // Apply date filter
        if ($dateRange === 'today') {
            $query->whereDate('created_at', now()->toDateString());
        } elseif ($dateRange === 'yesterday') {
            $query->whereDate('created_at', now()->subDay()->toDateString());
        } elseif ($dateRange === 'week') {
            $query->where('created_at', '>=', now()->subWeek());
        } elseif ($dateRange === 'month') {
            $query->where('created_at', '>=', now()->subMonth());
        }
        // 'all' applies no date filter

        // Stats
        $totalTickets = (clone $query)->count();
        $openTickets = (clone $query)->where('status', 'open')->count();
        $pendingTickets = (clone $query)->where('status', 'pending')->count();
        $waitingTickets = (clone $query)->where('status', 'waiting')->count();
        $resolvedTickets = (clone $query)->where('status', 'resolved')->count();
        $totalCustomers = Customer::count();

        // Source Distribution
        $sourceStats = (clone $query)
            ->selectRaw('source, count(*) as count')
            ->groupBy('source')
            ->get()
            ->map(fn($item) => [
                'name' => strtoupper($item->source),
                'value' => $item->count
            ]);

        // Status/Read Distribution
        $readCount = (clone $query)->where('is_read', true)->count();
        $unreadCount = (clone $query)->where('is_read', false)->count();
        
        // Delayed logic based on SLA
        $slaSettings = app(\App\Services\SettingsService::class)->getGroup('sla');
        $delayedCount = 0;
        if ($slaSettings && ($slaSettings['sla_enabled'] ?? false)) {
            $level1Hours = $slaSettings['sla_level1_hours'] ?? 1;
            $delayedCount = (clone $query)
                ->whereIn('status', ['open', 'pending', 'waiting'])
                ->where('created_at', '<=', now()->subHours($level1Hours))
                ->count();
        }

        $recentTickets = Ticket::with(['customer', 'assignedAgent'])
            ->latest('last_message_at')
            ->take(10)
            ->get();

        // Agent performance
        $agentStats = Ticket::whereNotNull('assigned_to')
            ->selectRaw('assigned_to, COUNT(*) as total, SUM(CASE WHEN status = "resolved" OR status = "closed" THEN 1 ELSE 0 END) as resolved')
            ->groupBy('assigned_to')
            ->with('assignedAgent:id,name')
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalTickets' => $totalTickets,
                'openTickets' => $openTickets,
                'pendingTickets' => $pendingTickets,
                'waitingTickets' => $waitingTickets,
                'resolvedTickets' => $resolvedTickets,
                'totalCustomers' => $totalCustomers,
                'readCount' => $readCount,
                'unreadCount' => $unreadCount,
                'delayedCount' => $delayedCount,
            ],
            'charts' => [
                'sourceDistribution' => $sourceStats,
                'statusDistribution' => [
                    ['name' => 'Read', 'value' => $readCount],
                    ['name' => 'Unread', 'value' => $unreadCount],
                    ['name' => 'Delayed', 'value' => $delayedCount],
                    ['name' => 'Pending', 'value' => $pendingTickets],
                ]
            ],
            'recentTickets' => $recentTickets,
            'agentStats' => $agentStats,
            'slaSettings' => $slaSettings,
            'filters' => ['date_range' => $dateRange]
        ]);
    }
}
