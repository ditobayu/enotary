<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StatusLayanan extends Model
{
    protected $table = 'status_layanan';
    protected $primaryKey = 'id_status';
    
    protected $fillable = [
        'nama_status'
    ];

    public function layanan(): HasMany
    {
        return $this->hasMany(Layanan::class, 'id_status', 'id_status');
    }
}
