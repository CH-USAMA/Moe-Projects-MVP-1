<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    /** @use HasFactory<\Database\Factories\CustomerFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'tags',
        'external_ids',
        'category',
        'notifications_enabled',
        'logging_enabled',
    ];

    protected $casts = [
        'tags' => 'array',
        'external_ids' => 'array',
        'notifications_enabled' => 'boolean',
        'logging_enabled' => 'boolean',
    ];

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}
