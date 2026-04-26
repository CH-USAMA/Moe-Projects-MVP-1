<?php

namespace Database\Factories;

use App\Models\Ticket;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => \App\Models\Customer::factory(),
            'assigned_to' => null, // Will be set in seeder
            'subject' => fake()->sentence(fake()->numberBetween(3, 8)),
            'status' => fake()->randomElement(['open', 'open', 'pending', 'waiting', 'resolved', 'closed']),
            'priority' => fake()->randomElement(['low', 'medium', 'medium', 'high', 'urgent']),
            'source' => fake()->randomElement(['email', 'ghl', 'sms', 'manual']),
            'last_message_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'created_at' => fake()->dateTimeBetween('-2 months', '-1 month'),
        ];
    }
}
