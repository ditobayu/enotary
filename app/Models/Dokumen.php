<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Dokumen extends Model
{
    protected $table = 'dokumen';
    protected $primaryKey = 'id_dokumen';
    
    protected $fillable = [
        'id_layanan',
        'nama_dokumen',
        'file_path',
        'tanggal_upload'
    ];

    protected $casts = [
        'tanggal_upload' => 'datetime'
    ];

    public function layanan(): BelongsTo
    {
        return $this->belongsTo(Layanan::class, 'id_layanan', 'id_layanan');
    }
}
