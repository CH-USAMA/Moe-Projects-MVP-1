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
        $isNote = $this->faker->boolean(20);
        $isAgent = $this->faker->boolean(50);
        
        return [
            'ticket_id' => \App\Models\Ticket::factory(),
            'sender_id' => null, // Will be set in seeder
            'sender_type' => $isNote ? \App\Models\User::class : ($isAgent ? \App\Models\User::class : \App\Models\Customer::class),
            'body' => '<p>' . $this->faker->paragraphs($this->faker->numberBetween(1, 3), true) . '</p>',
            'type' => $isNote ? 'note' : 'message',
            'created_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];

    }
}
