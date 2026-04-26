<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    /** @use HasFactory<\Database\Factories\SettingFactory> */
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'group',
        'is_encrypted',
    ];

    protected $casts = [
        'value' => 'array',
        'is_encrypted' => 'boolean',
    ];

    public static function get($key, $default = null)
    {
        $setting = self::where('key', $key)->first();
        if (!$setting) return $default;

        $value = $setting->value;
        if ($setting->is_encrypted && $value) {
            // Logic for decryption if needed, but array cast handles JSON
        }
        return $value;
    }

    public static function set($key, $value, $group = 'general', $isEncrypted = false)
    {
        return self::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'group' => $group, 'is_encrypted' => $isEncrypted]
        );
    }
}
