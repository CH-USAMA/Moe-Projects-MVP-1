<?php

namespace App\Http\Controllers;

use App\Models\AutomationRule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AutomationRuleController extends Controller
{
    public function index()
    {
        $rules = AutomationRule::latest()->get();

        return Inertia::render('Settings/Automations', [
            'rules' => $rules,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'conditions' => 'required|array|min:1',
            'conditions.*.field' => 'required|string',
            'conditions.*.operator' => 'required|string',
            'conditions.*.value' => 'required|string',
            'actions' => 'required|array|min:1',
            'actions.*.type' => 'required|string',
            'actions.*.value' => 'required|string',
        ]);

        AutomationRule::create($request->only(['name', 'conditions', 'actions']));

        return redirect()->back()->with('success', 'Automation rule created.');
    }

    public function update(Request $request, AutomationRule $automationRule)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'conditions' => 'required|array|min:1',
            'actions' => 'required|array|min:1',
            'is_active' => 'boolean',
        ]);

        $automationRule->update($request->only(['name', 'conditions', 'actions', 'is_active']));

        return redirect()->back()->with('success', 'Rule updated.');
    }

    public function destroy(AutomationRule $automationRule)
    {
        $automationRule->delete();
        return redirect()->back()->with('success', 'Rule deleted.');
    }
}
