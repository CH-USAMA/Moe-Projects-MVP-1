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
        $subjects = [
            'Airport pickup scheduled for wrong terminal',
            'Need to change reservation date for wedding event',
            'Driver was late to corporate event pickup',
            'Request for hourly rate quote - 6 hour booking',
            'Complaint about vehicle cleanliness on last ride',
            'Cancel my reservation for next Friday',
            'Need a stretch limo for prom night - 8 passengers',
            'Billing discrepancy on invoice #4521',
            'Request wheelchair accessible vehicle for hospital trip',
            'Add extra stop to existing airport transfer booking',
            'Corporate account setup request - monthly billing',
            'Driver feedback - excellent service last Saturday',
            'Vehicle broke down during our anniversary ride',
            'Need child car seat for upcoming reservation',
            'Quote request for wine tour - Napa Valley',
            'Flight delayed - need to push pickup time back 2 hours',
            'Lost item in vehicle - left briefcase in back seat',
            'Group transportation for conference - 45 attendees',
            'Requesting refund for no-show driver',
            'VIP client needs security-cleared chauffeur',
        ];

        return [
            'customer_id' => \App\Models\Customer::factory(),
            'assigned_to' => null, // Will be set in seeder
            'subject' => $this->faker->randomElement($subjects),
            'status' => $this->faker->randomElement(['open', 'open', 'pending', 'waiting', 'resolved', 'closed']),
            'priority' => $this->faker->randomElement(['low', 'medium', 'medium', 'high', 'urgent']),
            'source' => $this->faker->randomElement(['email', 'email', 'manual', 'manual']),
            'last_message_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'created_at' => $this->faker->dateTimeBetween('-2 months', '-1 month'),
        ];

    }
}
