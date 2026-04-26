<?php

namespace Database\Factories;

use App\Models\TicketMessage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TicketMessage>
 */
class TicketMessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $isNote = fake()->boolean(20);
        $isAgent = fake()->boolean(50);
        
        return [
            'ticket_id' => \App\Models\Ticket::factory(),
            'sender_id' => null, // Will be set in seeder
            'sender_type' => $isNote ? \App\Models\User::class : ($isAgent ? \App\Models\User::class : \App\Models\Customer::class),
            'body' => '<p>' . fake()->paragraphs(fake()->numberBetween(1, 3), true) . '</p>',
            'type' => $isNote ? 'note' : 'message',
            'created_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
