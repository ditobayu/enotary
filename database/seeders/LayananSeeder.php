<?php

namespace Database\Seeders;

use App\Models\Layanan;
use App\Models\Dokumen;
use App\Models\Jadwal;
use App\Models\Notifikasi;
use App\Models\LogAktivitas;
use App\Models\User;
use App\Models\KategoriLayanan;
use App\Models\StatusLayanan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LayananSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some users (clients)
        $clients = User::role('client')->take(5)->get();
        $kategoris = KategoriLayanan::all();
        $statuses = StatusLayanan::all();

        if ($clients->isEmpty() || $kategoris->isEmpty() || $statuses->isEmpty()) {
            $this->command->info('Tidak ada data user, kategori, atau status yang tersedia untuk membuat layanan.');
            return;
        }

        // Create sample layanan
        foreach ($clients as $client) {
            // Create 1-3 layanan per client
            $layananCount = rand(1, 3);
            
            for ($i = 0; $i < $layananCount; $i++) {
                $layanan = Layanan::create([
                    'id_user' => $client->id,
                    'id_kategori' => $kategoris->random()->id_kategori,
                    'tanggal_pengajuan' => now()->subDays(rand(1, 30)),
                    'id_status' => $statuses->random()->id_status,
                    'keterangan' => 'Layanan notaris untuk ' . $kategoris->random()->nama_kategori
                ]);

                // Create sample dokumen for this layanan
                $dokumenCount = rand(1, 4);
                for ($d = 0; $d < $dokumenCount; $d++) {
                    Dokumen::create([
                        'id_layanan' => $layanan->id_layanan,
                        'nama_dokumen' => 'Dokumen_' . $layanan->id_layanan . '_' . ($d + 1) . '.pdf',
                        'file_path' => 'documents/layanan_' . $layanan->id_layanan . '/dokumen_' . ($d + 1) . '.pdf',
                        'tanggal_upload' => now()->subDays(rand(1, 20))
                    ]);
                }

                // Create sample jadwal if status is not 'Selesai' or 'Ditolak'
                $statusName = StatusLayanan::find($layanan->id_status)->nama_status;
                if (!in_array($statusName, ['Selesai', 'Ditolak'])) {
                    Jadwal::create([
                        'id_user' => $client->id,
                        'id_layanan' => $layanan->id_layanan,
                        'tanggal_janji' => now()->addDays(rand(1, 14)),
                        'jam_janji' => sprintf('%02d:%02d:00', rand(9, 16), rand(0, 59)),
                        'status_jadwal' => collect(['Aktif', 'Cancel', 'Selesai'])->random()
                    ]);
                }

                // Create sample notifikasi
                Notifikasi::create([
                    'id_user' => $client->id,
                    'isi_pesan' => 'Layanan Anda dengan ID ' . $layanan->id_layanan . ' telah ' . strtolower($statusName),
                    'tanggal_kirim' => now()->subDays(rand(1, 10)),
                    'status_baca' => rand(0, 1)
                ]);

                // Create sample log aktivitas
                LogAktivitas::create([
                    'id_user' => $client->id,
                    'aktivitas' => 'Mengajukan layanan: ' . $kategoris->find($layanan->id_kategori)->nama_kategori,
                    'tanggal_waktu' => $layanan->tanggal_pengajuan
                ]);

                LogAktivitas::create([
                    'id_user' => $client->id,
                    'aktivitas' => 'Status layanan berubah menjadi: ' . $statusName,
                    'tanggal_waktu' => now()->subDays(rand(1, 15))
                ]);
            }
        }

        $this->command->info('Sample layanan data berhasil dibuat!');
    }
}
