<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Ticket;
$n = now();
Ticket::create(['customer_id' => 1, 'subject' => '[SLA] Green Alert (1.5h)', 'status' => 'open', 'priority' => 'low', 'source' => 'email', 'created_at' => $n->copy()->subHours(1.5), 'last_message_at' => $n->copy()->subHours(1.5)]);
Ticket::create(['customer_id' => 2, 'subject' => '[SLA] Orange Alert (2.5h)', 'status' => 'open', 'priority' => 'medium', 'source' => 'ghl', 'created_at' => $n->copy()->subHours(2.5), 'last_message_at' => $n->copy()->subHours(2.5)]);
Ticket::create(['customer_id' => 3, 'subject' => '[SLA] Red Alert (4h)', 'status' => 'open', 'priority' => 'high', 'source' => 'sms', 'created_at' => $n->copy()->subHours(4), 'last_message_at' => $n->copy()->subHours(4)]);
echo "Done\n";
