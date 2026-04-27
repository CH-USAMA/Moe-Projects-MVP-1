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

        $customerMessages = [
            'Hi, I need help with my upcoming reservation. Can someone get back to me as soon as possible?',
            'I tried calling your office but no one answered. Please follow up on my booking request.',
            'Thank you for the quick response! The details look correct. Please confirm the reservation.',
            'The driver arrived 20 minutes late to my pickup location. This is not acceptable for the price I paid.',
            'Can you please send me an updated invoice? The one I received has the wrong date on it.',
            'I would like to book the same vehicle and driver we had last time. He was excellent.',
            'We need to add 3 more passengers to our existing reservation. Is a larger vehicle available?',
            'Please cancel my booking. Something came up and we will not be needing the service anymore.',
            'Is there a discount for booking multiple rides per month? We travel frequently for business.',
            'The ride was fantastic. The vehicle was spotless and the driver was very professional. Thank you!',
        ];

        $agentMessages = [
            'Thank you for contacting Moe Limo. I have reviewed your request and will get back to you shortly with availability.',
            'I have confirmed your reservation. Your booking reference number is #MOE-' . $this->faker->numerify('####') . '. Please save this for your records.',
            'I apologize for the inconvenience. I have escalated this matter to our operations manager for immediate review.',
            'Your updated invoice has been sent to your email on file. Please let us know if you need anything else.',
            'We have a Lincoln Town Car and a Cadillac Escalade available for your requested date. Which would you prefer?',
            'I have applied a 15% discount to your account as a courtesy for the inconvenience. Your new total is reflected in the updated invoice.',
            'Your driver for this trip will be Michael. He has over 10 years of experience and is one of our top-rated chauffeurs.',
            'I have processed your cancellation. A full refund will be issued to your card within 3-5 business days.',
            'Absolutely! We offer a corporate monthly plan with volume discounts. I will send you the details by email.',
            'Thank you for your kind words! We have passed your feedback along to the driver. We look forward to serving you again.',
        ];

        $noteMessages = [
            'Customer is a VIP corporate client - always prioritize their requests and assign senior drivers.',
            'Reached out to dispatch about the driver delay. Root cause was traffic on I-95. Logged for follow-up.',
            'Customer has an outstanding balance of $450. Do not confirm new bookings until payment is received.',
            'This customer was referred by our partner agency. Ensure white-glove service on all their bookings.',
            'Spoke with the customer on the phone. They are satisfied with the resolution. Closing this ticket.',
            'Flagged for manager review - customer is requesting a refund outside our standard policy window.',
        ];

        if ($isNote) {
            $body = $this->faker->randomElement($noteMessages);
        } elseif ($isAgent) {
            $body = $this->faker->randomElement($agentMessages);
        } else {
            $body = $this->faker->randomElement($customerMessages);
        }

        return [
            'ticket_id' => \App\Models\Ticket::factory(),
            'sender_id' => null, // Will be set in seeder
            'sender_type' => $isNote ? \App\Models\User::class : ($isAgent ? \App\Models\User::class : \App\Models\Customer::class),
            'body' => '<p>' . $body . '</p>',
            'type' => $isNote ? 'note' : 'message',
            'created_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];

    }
}
