<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LogAktivitas extends Model
{
    protected $table = 'log_aktivitas';
    protected $primaryKey = 'id_log';
    
    protected $fillable = [
        'id_user',
        'aktivitas',
        'tanggal_waktu'
    ];

    protected $casts = [
        'tanggal_waktu' => 'datetime'
    ];

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'id_log';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }
}
