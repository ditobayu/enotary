<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Layanan extends Model
{
    protected $table = 'layanan';
    protected $primaryKey = 'id_layanan';
    
    protected $fillable = [
        'id_user',
        'id_kategori',
        'tanggal_pengajuan',
        'id_status',
        'keterangan'
    ];

    protected $casts = [
        'tanggal_pengajuan' => 'date'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(KategoriLayanan::class, 'id_kategori', 'id_kategori');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(StatusLayanan::class, 'id_status', 'id_status');
    }

    public function dokumen(): HasMany
    {
        return $this->hasMany(Dokumen::class, 'id_layanan', 'id_layanan');
    }

    public function jadwal(): HasMany
    {
        return $this->hasMany(Jadwal::class, 'id_layanan', 'id_layanan');
    }
}
