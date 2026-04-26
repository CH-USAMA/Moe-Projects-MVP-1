<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Crypt;

class SettingsService
{
    /**
     * Get a setting value by key.
     */
    public function get(string $key, mixed $default = null): mixed
    {
        $setting = Setting::where('key', $key)->first();
        if (!$setting) return $default;

        $value = $setting->value;

        if ($setting->is_encrypted && is_string($value)) {
            try {
                $value = Crypt::decryptString($value);
                return json_decode($value, true) ?? $value;
            } catch (\Exception $e) {
                return $default;
            }
        }

        return $value;
    }

    /**
     * Set a setting value.
     */
    public function set(string $key, mixed $value, string $group = 'general', bool $isEncrypted = false): Setting
    {
        $storeValue = $value;

        if ($isEncrypted && $value) {
            $storeValue = Crypt::encryptString(is_array($value) ? json_encode($value) : $value);
        }

        return Setting::updateOrCreate(
            ['key' => $key],
            [
                'value' => $isEncrypted ? $storeValue : $value,
                'group' => $group,
                'is_encrypted' => $isEncrypted,
            ]
        );
    }

    /**
     * Get all settings for a group.
     */
    public function getGroup(string $group): array
    {
        return Setting::where('group', $group)
            ->get()
            ->mapWithKeys(fn($s) => [$s->key => $this->get($s->key)])
            ->toArray();
    }

    /**
     * Save multiple settings at once.
     */
    public function setMany(array $settings, string $group = 'general', array $encryptedKeys = []): void
    {
        foreach ($settings as $key => $value) {
            $this->set($key, $value, $group, in_array($key, $encryptedKeys));
        }
    }
}
