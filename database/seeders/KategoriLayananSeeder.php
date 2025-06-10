<?php

namespace Database\Seeders;

use App\Models\KategoriLayanan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KategoriLayananSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kategoris = [
            ['nama_kategori' => 'Akta Jual Beli'],
            ['nama_kategori' => 'Akta Hibah'],
            ['nama_kategori' => 'Akta Perjanjian'],
            ['nama_kategori' => 'Akta Kuasa'],
            ['nama_kategori' => 'Akta Pernyataan'],
            ['nama_kategori' => 'Akta Pendirian PT'],
            ['nama_kategori' => 'Akta Pendirian CV'],
            ['nama_kategori' => 'Akta Koperasi'],
            ['nama_kategori' => 'Akta Wasiat'],
            ['nama_kategori' => 'Akta Fidusia'],
            ['nama_kategori' => 'Sertifikat Tanah'],
            ['nama_kategori' => 'Dokumen Perjanjian Kredit'],
            ['nama_kategori' => 'Lainnya']
        ];

        foreach ($kategoris as $kategori) {
            KategoriLayanan::create($kategori);
        }
    }
}
