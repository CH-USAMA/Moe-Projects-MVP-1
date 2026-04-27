<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'tags' => $this->faker->randomElements(['VIP', 'Corporate', 'Lead', 'Loyal', 'New'], $this->faker->numberBetween(0, 3)),
            'external_ids' => ['ghl_opportunity_id' => $this->faker->optional()->uuid()],
        ];

    }
}
