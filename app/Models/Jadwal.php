<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Jadwal extends Model
{
    protected $table = 'jadwal';
    protected $primaryKey = 'id_jadwal';
    
    protected $fillable = [
        'id_user',
        'id_layanan',
        'tanggal_janji',
        'jam_janji',
        'status_jadwal'
    ];

    protected $casts = [
        'tanggal_janji' => 'date',
        'jam_janji' => 'datetime:H:i'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }

    public function layanan(): BelongsTo
    {
        return $this->belongsTo(Layanan::class, 'id_layanan', 'id_layanan');
    }
}
