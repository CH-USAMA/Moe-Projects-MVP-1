<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Customer;
use App\Models\Ticket;
use App\Models\TicketMessage;
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
        // Create a superadmin user
        $superadmin = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@moelimo.com',
            'password' => bcrypt('moelimo2026'),
            'role' => 'superadmin',
        ]);

        // Create an admin user
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@moelimo.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Create some agents
        $agents = User::factory(3)->create(['role' => 'agent']);
        $allUsers = $agents->push($admin)->push($superadmin);


        // Create Customers
        $customers = Customer::factory(15)->create();

        // ──────────────────────────────────────────────
        // 1. Standard Tickets (email / manual source)
        // ──────────────────────────────────────────────
        foreach ($customers as $customer) {
            $numTickets = rand(1, 3);
            
            for ($i = 0; $i < $numTickets; $i++) {
                $isAssigned = rand(0, 1);
                $agent = $isAssigned ? $allUsers->random() : null;

                $ticket = Ticket::factory()->create([
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
                            $senderType = Customer::class;
                        }
                    }

                    TicketMessage::factory()->create([
                        'ticket_id' => $ticket->id,
                        'sender_id' => $sender->id,
                        'sender_type' => $senderType,
                        'type' => $isNote ? 'note' : 'message',
                    ]);
                }
            }
        }

        // ──────────────────────────────────────────────
        // 2. GHL (GoHighLevel) Tickets
        // ──────────────────────────────────────────────
        $ghlTickets = [
            [
                'subject' => 'GHL Opportunity: Airport transfer for Johnson wedding party',
                'status' => 'open',
                'priority' => 'high',
                'messages' => [
                    ['body' => 'New opportunity created in GoHighLevel. Client needs 3 stretch limos for a wedding party airport transfer on June 15th. Pickup from JFK Terminal 4, drop-off at The Plaza Hotel.', 'type' => 'message', 'from' => 'customer'],
                    ['body' => 'GHL pipeline stage: Qualified Lead. Estimated deal value: $2,800. Follow up within 24 hours.', 'type' => 'note', 'from' => 'agent'],
                    ['body' => 'I have reached out to the client via phone. They confirmed 3 vehicles needed for 18 guests total. Sending quote now.', 'type' => 'message', 'from' => 'agent'],
                ],
            ],
            [
                'subject' => 'GHL Opportunity: Corporate monthly contract - Apex Financial',
                'status' => 'pending',
                'priority' => 'urgent',
                'messages' => [
                    ['body' => 'GoHighLevel opportunity updated. Apex Financial is interested in a monthly retainer for executive transportation. 20+ rides per month estimated.', 'type' => 'message', 'from' => 'customer'],
                    ['body' => 'This is a high-value corporate lead from GHL. Pipeline moved to "Proposal Sent". Assigned to senior account manager.', 'type' => 'note', 'from' => 'agent'],
                    ['body' => 'We have sent the corporate rate sheet. The client is comparing us with two other providers. Need to follow up by Friday.', 'type' => 'message', 'from' => 'agent'],
                    ['body' => 'Thank you for the proposal. We would like to set up a trial run next week with 5 rides to evaluate your service quality.', 'type' => 'message', 'from' => 'customer'],
                ],
            ],
            [
                'subject' => 'GHL Opportunity: VIP concert transportation - Madison Square Garden',
                'status' => 'open',
                'priority' => 'high',
                'messages' => [
                    ['body' => 'New GHL opportunity synced. Client needs luxury SUV transportation for a VIP group attending a concert at MSG on July 3rd. Round trip service requested.', 'type' => 'message', 'from' => 'customer'],
                    ['body' => 'Synced from GHL pipeline "New Leads". Contact info verified. Client prefers Escalade or Suburban.', 'type' => 'note', 'from' => 'agent'],
                ],
            ],
            [
                'subject' => 'GHL Opportunity: Recurring airport shuttle - TechCorp executives',
                'status' => 'waiting',
                'priority' => 'medium',
                'messages' => [
                    ['body' => 'GoHighLevel contact synced. TechCorp needs weekly airport transfers for their C-suite executives flying in from Chicago every Monday morning.', 'type' => 'message', 'from' => 'customer'],
                    ['body' => 'Contacted the client. They want a dedicated driver who knows the route and their preferences. Quoted $450/week for the recurring service.', 'type' => 'message', 'from' => 'agent'],
                    ['body' => 'GHL deal stage updated to "Negotiation". Client wants to negotiate the rate down to $380/week. Manager approval needed.', 'type' => 'note', 'from' => 'agent'],
                ],
            ],
            [
                'subject' => 'GHL Opportunity: Holiday party fleet booking - December 20th',
                'status' => 'resolved',
                'priority' => 'medium',
                'messages' => [
                    ['body' => 'GHL opportunity created. Company holiday party needs 5 vehicles (2 sedans, 2 SUVs, 1 party bus) for employee transportation across Manhattan.', 'type' => 'message', 'from' => 'customer'],
                    ['body' => 'All 5 vehicles confirmed and reserved. Drivers briefed on the route schedule. Total invoice: $4,200. Payment received via corporate card.', 'type' => 'message', 'from' => 'agent'],
                    ['body' => 'GHL deal marked as WON. Revenue logged. Moving to closed pipeline.', 'type' => 'note', 'from' => 'agent'],
                ],
            ],
        ];

        // ──────────────────────────────────────────────
        // 3. SMS / Text Alert Tickets
        // ──────────────────────────────────────────────
        $smsTickets = [
            [
                'subject' => 'SMS Alert: Driver running 15 min late - Booking #MOE-7821',
                'status' => 'open',
                'priority' => 'urgent',
                'messages' => [
                    ['body' => 'ALERT: Driver Mike R. is running 15 minutes behind schedule for pickup at 345 Park Ave. Client has been notified via text. ETA updated to 3:45 PM.', 'type' => 'message', 'from' => 'customer'],
                    ['body' => 'Called the driver. He is stuck in traffic on FDR Drive. Dispatching backup vehicle from midtown garage as a precaution.', 'type' => 'message', 'from' => 'agent'],
                    ['body' => 'Client replied via SMS: "Please hurry, I have a flight at 5:30 PM." - Escalating to urgent priority.', 'type' => 'note', 'from' => 'agent'],
                ],
            ],
            [
                'subject' => 'SMS Alert: Client requesting immediate pickup - no reservation',
                'status' => 'open',
                'priority' => 'high',
                'messages' => [
                    ['body' => 'Inbound SMS from +1 (212) 555-0198: "Hi, I need a black car to LaGuardia ASAP. Can you send one to 100 Broadway? - Sarah Chen"', 'type' => 'message', 'from' => 'customer'],
                    ['body' => 'Checking vehicle availability in lower Manhattan. Lincoln MKT available 10 minutes away. Responding to client now.', 'type' => 'message', 'from' => 'agent'],
                    ['body' => 'Replied via SMS: "Hi Sarah, we have a vehicle 10 minutes away. Estimated fare to LGA is $85. Shall I confirm?" Waiting for response.', 'type' => 'message', 'from' => 'agent'],
                ],
            ],
            [
                'subject' => 'SMS Alert: Vehicle maintenance warning - Unit #14',
                'status' => 'pending',
                'priority' => 'medium',
                'messages' => [
                    ['body' => 'Automated text alert from fleet management: Vehicle #14 (2024 Cadillac Escalade) is due for scheduled maintenance. Oil change and tire rotation required. Mileage: 32,450.', 'type' => 'message', 'from' => 'customer'],
                    ['body' => 'Scheduled maintenance for Unit #14 at Prestige Auto on Thursday at 9 AM. Vehicle will be out of service for approximately 4 hours. Adjusting dispatch roster.', 'type' => 'message', 'from' => 'agent'],
                ],
            ],
            [
                'subject' => 'SMS Alert: Customer complaint received via text',
                'status' => 'open',
                'priority' => 'high',
                'messages' => [
                    ['body' => 'Inbound SMS from +1 (917) 555-0342: "Your driver just dropped me off at the wrong terminal! I specifically said Terminal B, United Airlines. Now I might miss my flight. Very disappointed."', 'type' => 'message', 'from' => 'customer'],
                    ['body' => 'This is a serious service failure. The booking notes clearly stated Terminal B. Driver error confirmed. Sending immediate apology SMS and offering a complimentary ride credit.', 'type' => 'note', 'from' => 'agent'],
                    ['body' => 'Sent SMS: "We sincerely apologize for the error. We are issuing a full refund and a $50 credit for your next ride. Your satisfaction is our top priority."', 'type' => 'message', 'from' => 'agent'],
                    ['body' => 'Inbound SMS reply: "Thank you for the quick response. I made it to my gate just in time. I appreciate the credit."', 'type' => 'message', 'from' => 'customer'],
                ],
            ],
            [
                'subject' => 'SMS Alert: Booking confirmation reply - Client accepted quote',
                'status' => 'resolved',
                'priority' => 'low',
                'messages' => [
                    ['body' => 'Inbound SMS from +1 (646) 555-0287: "Yes, I confirm the booking for Saturday at 6 PM. 4 passengers, pickup at The Ritz-Carlton. Thanks!"', 'type' => 'message', 'from' => 'customer'],
                    ['body' => 'Booking confirmed and entered into the system. Assigned driver: Carlos M. Vehicle: Black Suburban. Confirmation SMS sent to client.', 'type' => 'message', 'from' => 'agent'],
                ],
            ],
            [
                'subject' => 'SMS Alert: Driver check-in failed - no response from Unit #7',
                'status' => 'open',
                'priority' => 'urgent',
                'messages' => [
                    ['body' => 'Automated alert: Driver assigned to Unit #7 (James P.) did not respond to the scheduled check-in text at 2:00 PM. Next pickup is at 2:30 PM at 200 West St.', 'type' => 'message', 'from' => 'customer'],
                    ['body' => 'Tried calling James on his cell - went to voicemail. Dispatching backup driver Tony from the garage. ETA to pickup location: 20 minutes.', 'type' => 'message', 'from' => 'agent'],
                    ['body' => 'James called back - his phone died. He is en route and will make the 2:30 PM pickup. Cancelling backup dispatch.', 'type' => 'note', 'from' => 'agent'],
                ],
            ],
        ];

        // Seed GHL tickets
        foreach ($ghlTickets as $ticketData) {
            $customer = $customers->random();
            $agent = $allUsers->random();

            $ticket = Ticket::create([
                'customer_id' => $customer->id,
                'assigned_to' => $agent->id,
                'subject' => $ticketData['subject'],
                'status' => $ticketData['status'],
                'priority' => $ticketData['priority'],
                'source' => 'ghl',
                'last_message_at' => now()->subHours(rand(1, 72)),
                'created_at' => now()->subDays(rand(1, 30)),
                'updated_at' => now()->subHours(rand(1, 72)),
            ]);

            foreach ($ticketData['messages'] as $index => $msg) {
                TicketMessage::create([
                    'ticket_id' => $ticket->id,
                    'sender_id' => $msg['from'] === 'agent' ? $agent->id : $customer->id,
                    'sender_type' => $msg['from'] === 'agent' ? User::class : Customer::class,
                    'body' => '<p>' . $msg['body'] . '</p>',
                    'type' => $msg['type'],
                    'created_at' => $ticket->created_at->copy()->addMinutes($index * rand(15, 120)),
                ]);
            }
        }

        // Seed SMS / Text Alert tickets
        foreach ($smsTickets as $ticketData) {
            $customer = $customers->random();
            $agent = $allUsers->random();

            $ticket = Ticket::create([
                'customer_id' => $customer->id,
                'assigned_to' => $agent->id,
                'subject' => $ticketData['subject'],
                'status' => $ticketData['status'],
                'priority' => $ticketData['priority'],
                'source' => 'sms',
                'last_message_at' => now()->subHours(rand(1, 48)),
                'created_at' => now()->subDays(rand(1, 14)),
                'updated_at' => now()->subHours(rand(1, 48)),
            ]);

            foreach ($ticketData['messages'] as $index => $msg) {
                TicketMessage::create([
                    'ticket_id' => $ticket->id,
                    'sender_id' => $msg['from'] === 'agent' ? $agent->id : $customer->id,
                    'sender_type' => $msg['from'] === 'agent' ? User::class : Customer::class,
                    'body' => '<p>' . $msg['body'] . '</p>',
                    'type' => $msg['type'],
                    'created_at' => $ticket->created_at->copy()->addMinutes($index * rand(5, 30)),
                ]);
            }
        }
    }
}
