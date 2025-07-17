<?php

namespace Database\Seeders;

use App\Models\StatusLayanan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatusLayananSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['nama_status' => 'Pengajuan'],
            ['nama_status' => 'Diproses'],
            ['nama_status' => 'Menunggu Dokumen'],
            ['nama_status' => 'Review'],
            ['nama_status' => 'Jadwal Rapat'],
            ['nama_status' => 'Selesai'],
            ['nama_status' => 'Ditolak'],
            ['nama_status' => 'Dibatalkan']
        ];

        foreach ($statuses as $status) {
            StatusLayanan::create($status);
        }
    }
}
