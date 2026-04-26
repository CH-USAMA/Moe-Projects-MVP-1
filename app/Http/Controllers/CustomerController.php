<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::withCount('tickets');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $customers = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only('search'),
        ]);
    }

    public function show(Customer $customer)
    {
        $customer->load(['tickets' => function ($q) {
            $q->latest()->with('assignedAgent');
        }]);

        return Inertia::render('Customers/Show', [
            'customer' => $customer,
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'tags' => 'nullable|array',
            'category' => 'nullable|in:important,normal,casual',
            'notifications_enabled' => 'boolean',
            'logging_enabled' => 'boolean',
        ]);

        $customer->update($request->only([
            'name', 
            'phone', 
            'tags', 
            'category', 
            'notifications_enabled', 
            'logging_enabled'
        ]));

        \App\Services\AuditService::log('Customer Updated', Customer::class, $customer->id, $request->all());

        return redirect()->back()->with('success', 'Customer updated.');
    }

    public function syncGHL(Customer $customer, \App\Services\GHLService $ghlService)
    {
        $ticket = $customer->tickets()->latest()->first();
        if (!$ticket) {
            return redirect()->back()->with('error', 'Customer must have at least one ticket to sync.');
        }

        $result = $ghlService->pushTicketToGHL($ticket);

        if ($result['success']) {
            return redirect()->back()->with('success', 'Customer synced to GHL.');
        }

        return redirect()->back()->with('error', 'GHL Sync failed: ' . ($result['message'] ?? 'Unknown error'));
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return redirect()->route('customers.index')->with('success', 'Customer deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:customers,id',
        ]);

        Customer::whereIn('id', $request->ids)->delete();

        return redirect()->back()->with('success', 'Selected customers deleted.');
    }
}
