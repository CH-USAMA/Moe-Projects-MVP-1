<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketMessage extends Model
{
    /** @use HasFactory<\Database\Factories\TicketMessageFactory> */
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'sender_id',
        'sender_type',
        'body',
        'type',
        'message_id',
        'in_reply_to',
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    public function sender()
    {
        return $this->morphTo();
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class, 'ticket_message_id');
    }
}
