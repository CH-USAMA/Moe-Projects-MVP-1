<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create an admin user for the user to log in with
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@moelimo.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Create some agents
        $agents = User::factory(3)->create(['role' => 'agent']);
        $allUsers = $agents->push($admin);

        // Create Customers
        $customers = \App\Models\Customer::factory(15)->create();

        // Create Tickets for Customers
        foreach ($customers as $customer) {
            $numTickets = rand(1, 3);
            
            for ($i = 0; $i < $numTickets; $i++) {
                $isAssigned = rand(0, 1);
                $agent = $isAssigned ? $allUsers->random() : null;

                $ticket = \App\Models\Ticket::factory()->create([
                    'customer_id' => $customer->id,
                    'assigned_to' => $agent ? $agent->id : null,
                ]);

                // Create Messages for the Ticket
                $numMessages = rand(1, 5);
                for ($j = 0; $j < $numMessages; $j++) {
                    $isNote = rand(1, 100) <= 20; // 20% chance of note
                    
                    if ($isNote) {
                        $sender = $agent ?: $allUsers->random();
                        $senderType = User::class;
                    } else {
                        // Regular message: alternate between customer and agent
                        $isAgentMsg = $j % 2 !== 0; // Even=Customer, Odd=Agent
                        if ($isAgentMsg && $agent) {
                            $sender = $agent;
                            $senderType = User::class;
                        } else {
                            $sender = $customer;
                            $senderType = \App\Models\Customer::class;
                        }
                    }

                    \App\Models\TicketMessage::factory()->create([
                        'ticket_id' => $ticket->id,
                        'sender_id' => $sender->id,
                        'sender_type' => $senderType,
                        'type' => $isNote ? 'note' : 'message',
                    ]);
                }
            }
        }
    }
}
