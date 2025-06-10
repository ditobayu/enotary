<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notifikasi extends Model
{
    protected $table = 'notifikasi';
    protected $primaryKey = 'id_notifikasi';
    
    protected $fillable = [
        'id_user',
        'isi_pesan',
        'tanggal_kirim',
        'status_baca'
    ];

    protected $casts = [
        'tanggal_kirim' => 'datetime',
        'status_baca' => 'boolean'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }
}
