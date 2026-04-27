<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Agents/Index', [
            'agents' => User::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,agent',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return redirect()->back()->with('success', 'Agent created successfully.');
    }

    public function update(Request $request, User $agent)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $agent->id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|in:admin,agent',
        ]);

        $agent->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ]);

        if ($request->filled('password')) {
            $agent->update(['password' => Hash::make($request->password)]);
        }

        return redirect()->back()->with('success', 'Agent updated successfully.');
    }

    public function destroy(User $agent)
    {
        if ($agent->id === auth()->id()) {
            return redirect()->back()->with('error', 'You cannot delete yourself.');
        }

        $agent->delete();
        return redirect()->back()->with('success', 'Agent deleted successfully.');
    }
}
