<?php

namespace App\Http\Controllers;

use App\Exports\RekapDataExport;
use App\Models\Layanan;
use App\Models\Jadwal;
use App\Models\KategoriLayanan;
use App\Models\StatusLayanan;
use App\Models\User;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class RekapDataController extends Controller
{
    /**
     * Display the recap data page (admin and superadmin only)
     */
    public function index(Request $request): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        // Check authorization - only admin and superadmin can access
        if (!$user->hasAnyRole(['admin', 'superadmin'])) {
            abort(403, 'Anda tidak memiliki akses untuk melihat rekap data.');
        }

        // Get filter parameters
        $kategoriFilter = $request->input('kategori');
        $statusFilter = $request->input('status');
        $tanggalMulai = $request->input('tanggal_mulai');
        $tanggalSelesai = $request->input('tanggal_selesai');
        $search = $request->input('search');

        // Build query for layanan with all related data
        $query = Layanan::with([
            'user:id,name,email',
            'kategori:id_kategori,nama_kategori',
            'status:id_status,nama_status',
            'dokumen:id_dokumen,id_layanan,nama_dokumen,file_path,tanggal_upload',
            'jadwal:id_jadwal,id_layanan,tanggal_janji,jam_janji,status_jadwal'
        ]);

        // Apply filters
        if ($kategoriFilter) {
            $query->where('id_kategori', $kategoriFilter);
        }

        if ($statusFilter) {
            $query->where('id_status', $statusFilter);
        }

        if ($tanggalMulai) {
            $query->whereDate('tanggal_pengajuan', '>=', $tanggalMulai);
        }

        if ($tanggalSelesai) {
            $query->whereDate('tanggal_pengajuan', '<=', $tanggalSelesai);
        }

        if ($search) {
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

        // Get paginated results
        $layanan = $query->orderBy('tanggal_pengajuan', 'desc')->paginate(10);

        // Get filter options
        $kategoriOptions = KategoriLayanan::orderBy('nama_kategori')->get();
        $statusOptions = StatusLayanan::orderBy('nama_status')->get();

        // Get summary statistics
        $totalLayanan = Layanan::count();
        $totalJadwal = Jadwal::count();
        $totalClient = User::role('client')->count();
        
        $stats = [
            'total_layanan' => $totalLayanan,
            'total_jadwal' => $totalJadwal,
            'total_client' => $totalClient,
            'layanan_by_status' => Layanan::join('status_layanan', 'layanan.id_status', '=', 'status_layanan.id_status')
                ->selectRaw('status_layanan.nama_status, COUNT(*) as total')
                ->groupBy('status_layanan.id_status', 'status_layanan.nama_status')
                ->get(),
            'layanan_by_kategori' => Layanan::join('kategori_layanan', 'layanan.id_kategori', '=', 'kategori_layanan.id_kategori')
                ->selectRaw('kategori_layanan.nama_kategori, COUNT(*) as total')
                ->groupBy('kategori_layanan.id_kategori', 'kategori_layanan.nama_kategori')
                ->get(),
        ];

        return Inertia::render('RekapData/Index', [
            'layanan' => $layanan,
            'kategoriOptions' => $kategoriOptions,
            'statusOptions' => $statusOptions,
            'stats' => $stats,
            'filters' => [
                'kategori' => $kategoriFilter,
                'status' => $statusFilter,
                'tanggal_mulai' => $tanggalMulai,
                'tanggal_selesai' => $tanggalSelesai,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Export recap data to Excel
     */
    public function export(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        // Check authorization - only admin and superadmin can export
        if (!$user->hasAnyRole(['admin', 'superadmin'])) {
            abort(403, 'Anda tidak memiliki akses untuk mengekspor data.');
        }

        // Get same filters as index method
        $filters = [
            'kategori' => $request->input('kategori'),
            'status' => $request->input('status'),
            'tanggal_mulai' => $request->input('tanggal_mulai'),
            'tanggal_selesai' => $request->input('tanggal_selesai'),
            'search' => $request->input('search'),
        ];

        $fileName = 'rekap-data-layanan-' . now()->format('Y-m-d-H-i-s') . '.xlsx';

        // Log the export activity
        LogAktivitas::create([
            'id_user' => Auth::id(),
            'aktivitas' => 'Mengekspor rekap data layanan dan jadwal ke Excel',
            'tanggal_waktu' => now()
        ]);

        return Excel::download(new RekapDataExport($filters), $fileName);
    }
}
