<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KategoriLayanan extends Model
{
    protected $table = 'kategori_layanan';
    protected $primaryKey = 'id_kategori';
    
    protected $fillable = [
        'nama_kategori'
    ];

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'id_kategori';
    }

    public function layanan(): HasMany
    {
        return $this->hasMany(Layanan::class, 'id_kategori', 'id_kategori');
    }
}
