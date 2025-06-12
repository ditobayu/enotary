<?php

namespace App\Exports;

use App\Models\Layanan;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Font;

class RekapDataExport implements WithMultipleSheets
{
    protected $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    public function sheets(): array
    {
        return [
            new LayananSheet($this->filters),
            new JadwalSheet($this->filters),
            new StatistikSheet($this->filters),
        ];
    }
}

class LayananSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle, ShouldAutoSize
{
    protected $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = Layanan::with([
            'user:id,name,email',
            'kategori:id_kategori,nama_kategori',
            'status:id_status,nama_status',
            'dokumen:id_dokumen,id_layanan,nama_dokumen,file_path,tanggal_upload',
            'jadwal:id_jadwal,id_layanan,tanggal_janji,jam_janji,status_jadwal'
        ]);

        // Apply same filters as controller
        if ($this->filters['kategori']) {
            $query->where('id_kategori', $this->filters['kategori']);
        }

        if ($this->filters['status']) {
            $query->where('id_status', $this->filters['status']);
        }

        if ($this->filters['tanggal_mulai']) {
            $query->whereDate('tanggal_pengajuan', '>=', $this->filters['tanggal_mulai']);
        }

        if ($this->filters['tanggal_selesai']) {
            $query->whereDate('tanggal_pengajuan', '<=', $this->filters['tanggal_selesai']);
        }

        if ($this->filters['search']) {
            $search = $this->filters['search'];
            $query->where(function($q) use ($search) {
                $q->whereHas('user', function($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%")
                             ->orWhere('email', 'like', "%{$search}%");
                })
                ->orWhereHas('kategori', function($kategoriQuery) use ($search) {
                    $kategoriQuery->where('nama_kategori', 'like', "%{$search}%");
                })
                ->orWhere('keterangan', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('tanggal_pengajuan', 'desc')->get();
    }

    public function headings(): array
    {
        return [
            'ID Layanan',
            'Nama Client',
            'Email Client',
            'Kategori Layanan',
            'Status',
            'Tanggal Pengajuan',
            'Keterangan',
            'Jumlah Dokumen',
            'Jumlah Jadwal',
            'Jadwal Terakhir',
            'Status Jadwal Terakhir',
        ];
    }

    public function map($layanan): array
    {
        $jadwalTerakhir = $layanan->jadwal->sortByDesc('tanggal_janji')->first();
        
        return [
            $layanan->id_layanan,
            $layanan->user->name,
            $layanan->user->email,
            $layanan->kategori->nama_kategori,
            $layanan->status->nama_status,
            $layanan->tanggal_pengajuan->format('d/m/Y'),
            $layanan->keterangan,
            $layanan->dokumen->count(),
            $layanan->jadwal->count(),
            $jadwalTerakhir ? $jadwalTerakhir->tanggal_janji->format('d/m/Y') . ' ' . $jadwalTerakhir->jam_janji : '-',
            $jadwalTerakhir ? $jadwalTerakhir->status_jadwal : '-',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'size' => 12],
                'fill' => ['fillType' => 'solid', 'color' => ['rgb' => 'E3F2FD']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ],
        ];
    }

    public function title(): string
    {
        return 'Data Layanan';
    }
}

class JadwalSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle, ShouldAutoSize
{
    protected $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = \App\Models\Jadwal::with([
            'user:id,name,email',
            'layanan.kategori:id_kategori,nama_kategori',
            'layanan.status:id_status,nama_status'
        ]);

        // Apply filters based on layanan
        if ($this->filters['kategori'] || $this->filters['status'] || $this->filters['tanggal_mulai'] || $this->filters['tanggal_selesai'] || $this->filters['search']) {
            $query->whereHas('layanan', function($layananQuery) {
                if ($this->filters['kategori']) {
                    $layananQuery->where('id_kategori', $this->filters['kategori']);
                }

                if ($this->filters['status']) {
                    $layananQuery->where('id_status', $this->filters['status']);
                }

                if ($this->filters['tanggal_mulai']) {
                    $layananQuery->whereDate('tanggal_pengajuan', '>=', $this->filters['tanggal_mulai']);
                }

                if ($this->filters['tanggal_selesai']) {
                    $layananQuery->whereDate('tanggal_pengajuan', '<=', $this->filters['tanggal_selesai']);
                }

                if ($this->filters['search']) {
                    $search = $this->filters['search'];
                    $layananQuery->where(function($q) use ($search) {
                        $q->whereHas('user', function($userQuery) use ($search) {
                            $userQuery->where('name', 'like', "%{$search}%")
                                     ->orWhere('email', 'like', "%{$search}%");
                        })
                        ->orWhereHas('kategori', function($kategoriQuery) use ($search) {
                            $kategoriQuery->where('nama_kategori', 'like', "%{$search}%");
                        })
                        ->orWhere('keterangan', 'like', "%{$search}%");
                    });
                }
            });
        }

        return $query->orderBy('tanggal_janji', 'desc')->get();
    }

    public function headings(): array
    {
        return [
            'ID Jadwal',
            'ID Layanan',
            'Nama Client',
            'Email Client',
            'Kategori Layanan',
            'Status Layanan',
            'Tanggal Janji',
            'Jam Janji',
            'Status Jadwal',
        ];
    }

    public function map($jadwal): array
    {
        return [
            $jadwal->id_jadwal,
            $jadwal->id_layanan,
            $jadwal->user->name,
            $jadwal->user->email,
            $jadwal->layanan->kategori->nama_kategori,
            $jadwal->layanan->status->nama_status,
            $jadwal->tanggal_janji->format('d/m/Y'),
            $jadwal->jam_janji,
            $jadwal->status_jadwal,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'size' => 12],
                'fill' => ['fillType' => 'solid', 'color' => ['rgb' => 'E8F5E8']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ],
        ];
    }

    public function title(): string
    {
        return 'Data Jadwal';
    }
}

class StatistikSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle, ShouldAutoSize
{
    protected $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        // Get statistics data
        $stats = collect([
            ['jenis' => 'Total Layanan', 'jumlah' => Layanan::count()],
            ['jenis' => 'Total Jadwal', 'jumlah' => \App\Models\Jadwal::count()],
            ['jenis' => 'Total Client', 'jumlah' => \App\Models\User::role('client')->count()],
        ]);

        // Add layanan by status
        $layananByStatus = Layanan::join('status_layanan', 'layanan.id_status', '=', 'status_layanan.id_status')
            ->selectRaw('status_layanan.nama_status as jenis, COUNT(*) as jumlah')
            ->groupBy('status_layanan.id_status', 'status_layanan.nama_status')
            ->get()
            ->map(function($item) {
                return ['jenis' => 'Layanan ' . $item->jenis, 'jumlah' => $item->jumlah];
            });

        // Add layanan by kategori
        $layananByKategori = Layanan::join('kategori_layanan', 'layanan.id_kategori', '=', 'kategori_layanan.id_kategori')
            ->selectRaw('kategori_layanan.nama_kategori as jenis, COUNT(*) as jumlah')
            ->groupBy('kategori_layanan.id_kategori', 'kategori_layanan.nama_kategori')
            ->get()
            ->map(function($item) {
                return ['jenis' => 'Kategori ' . $item->jenis, 'jumlah' => $item->jumlah];
            });

        return $stats->concat($layananByStatus)->concat($layananByKategori);
    }

    public function headings(): array
    {
        return [
            'Jenis Data',
            'Jumlah',
        ];
    }

    public function map($stat): array
    {
        return [
            $stat['jenis'],
            $stat['jumlah'],
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'size' => 12],
                'fill' => ['fillType' => 'solid', 'color' => ['rgb' => 'FFF3E0']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ],
        ];
    }

    public function title(): string
    {
        return 'Statistik';
    }
}
