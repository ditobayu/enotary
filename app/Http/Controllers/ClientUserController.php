<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ClientUserController extends Controller
{
    /**
     * Display a listing of client users (admin and superadmin only)
     */
    public function index(Request $request): Response
    {
        // Pastikan hanya admin dan superadmin yang bisa mengakses
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasAnyRole(['admin', 'superadmin'])) {
            abort(403, 'Anda tidak memiliki akses untuk melihat data client.');
        }

        $search = $request->input('search');
        $sortBy = $request->input('sort', 'name');
        $sortOrder = $request->input('order', 'asc');

        // Query untuk mendapatkan user dengan role client
        $query = User::role('client')
            ->with(['roles', 'layanan' => function($q) {
                $q->with(['kategori', 'status'])
                  ->orderBy('tanggal_pengajuan', 'desc');
            }])
            ->withCount(['layanan', 'jadwal']);

        // Search functionality
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        // Sorting
        $allowedSorts = ['name', 'email', 'created_at', 'layanan_count', 'jadwal_count'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $clients = $query->paginate(15)->appends($request->all());

        return Inertia::render('ClientUser/Index', [
            'clients' => $clients,
            'filters' => [
                'search' => $search,
                'sort' => $sortBy,
                'order' => $sortOrder,
            ]
        ]);
    }

    /**
     * Display the specified client user with their layanan and jadwal
     */
    public function show(User $clientUser): Response
    {
        // Pastikan hanya admin dan superadmin yang bisa mengakses
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasAnyRole(['admin', 'superadmin'])) {
            abort(403, 'Anda tidak memiliki akses untuk melihat detail client.');
        }

        // Ensure the user is a client
        if (!$clientUser->hasRole('client')) {
            abort(404, 'Client user tidak ditemukan.');
        }

        // Load relationships
        $clientUser->load([
            'roles',
            'layanan' => function($q) {
                $q->with(['kategori', 'status', 'dokumen', 'jadwal' => function($jadwalQuery) {
                    $jadwalQuery->orderBy('tanggal_janji', 'desc');
                }])
                ->orderBy('tanggal_pengajuan', 'desc');
            },
            'jadwal' => function($q) {
                $q->with(['layanan.kategori', 'layanan.status'])
                  ->orderBy('tanggal_janji', 'desc');
            }
        ]);

        // Get statistics
        $stats = [
            'total_layanan' => $clientUser->layanan->count(),
            'layanan_aktif' => $clientUser->layanan->whereIn('status.nama_status', ['Pengajuan', 'Dalam Proses', 'Butuh Dokumen Tambahan'])->count(),
            'layanan_selesai' => $clientUser->layanan->where('status.nama_status', 'Selesai')->count(),
            'total_jadwal' => $clientUser->jadwal->count(),
            'jadwal_pending' => $clientUser->jadwal->where('status_jadwal', 'Pending')->count(),
            'jadwal_confirmed' => $clientUser->jadwal->where('status_jadwal', 'Dikonfirmasi')->count(),
        ];

        return Inertia::render('ClientUser/Show', [
            'clientUser' => $clientUser,
            'stats' => $stats
        ]);
    }

    /**
     * Display layanan for a specific client
     */
    public function layanan(Request $request, User $clientUser): Response
    {
        // Pastikan hanya admin dan superadmin yang bisa mengakses
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasAnyRole(['admin', 'superadmin'])) {
            abort(403, 'Anda tidak memiliki akses untuk melihat layanan client.');
        }

        // Ensure the user is a client
        if (!$clientUser->hasRole('client')) {
            abort(404, 'Client user tidak ditemukan.');
        }

        $status = $request->input('status');
        $kategori = $request->input('kategori');
        $search = $request->input('search');

        // Query layanan for the client
        $query = $clientUser->layanan()
            ->with(['kategori', 'status', 'dokumen', 'jadwal'])
            ->orderBy('tanggal_pengajuan', 'desc');

        // Filter by status
        if ($status) {
            $query->whereHas('status', function($q) use ($status) {
                $q->where('nama_status', $status);
            });
        }

        // Filter by kategori
        if ($kategori) {
            $query->whereHas('kategori', function($q) use ($kategori) {
                $q->where('nama_kategori', 'like', '%' . $kategori . '%');
            });
        }

        // Search
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('keterangan', 'like', '%' . $search . '%')
                  ->orWhereHas('kategori', function($katQuery) use ($search) {
                      $katQuery->where('nama_kategori', 'like', '%' . $search . '%');
                  });
            });
        }

        $layanan = $query->paginate(10)->appends($request->all());

        // Get available filters
        $availableStatuses = \App\Models\StatusLayanan::orderBy('nama_status')->pluck('nama_status');
        $availableKategori = \App\Models\KategoriLayanan::orderBy('nama_kategori')->pluck('nama_kategori');

        return Inertia::render('ClientUser/Layanan', [
            'clientUser' => $clientUser,
            'layanan' => $layanan,
            'filters' => [
                'status' => $status,
                'kategori' => $kategori,
                'search' => $search,
            ],
            'availableStatuses' => $availableStatuses,
            'availableKategori' => $availableKategori,
        ]);
    }

    /**
     * Display jadwal for a specific client
     */
    public function jadwal(Request $request, User $clientUser): Response
    {
        // Pastikan hanya admin dan superadmin yang bisa mengakses
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasAnyRole(['admin', 'superadmin'])) {
            abort(403, 'Anda tidak memiliki akses untuk melihat jadwal client.');
        }

        // Ensure the user is a client
        if (!$clientUser->hasRole('client')) {
            abort(404, 'Client user tidak ditemukan.');
        }

        $status = $request->input('status');
        $bulan = $request->input('bulan');
        $tahun = $request->input('tahun');

        // Query jadwal for the client
        $query = $clientUser->jadwal()
            ->with(['layanan.kategori', 'layanan.status'])
            ->orderBy('tanggal_janji', 'desc');

        // Filter by status
        if ($status) {
            $query->where('status_jadwal', $status);
        }

        // Filter by bulan
        if ($bulan) {
            $query->whereMonth('tanggal_janji', $bulan);
        }

        // Filter by tahun
        if ($tahun) {
            $query->whereYear('tanggal_janji', $tahun);
        }

        $jadwal = $query->paginate(10)->appends($request->all());

        // Get available filters
        $availableStatuses = ['Pending', 'Dikonfirmasi', 'Selesai', 'Dibatalkan'];
        $availableBulan = range(1, 12);
        $availableTahun = range(date('Y') - 2, date('Y') + 1);

        return Inertia::render('ClientUser/Jadwal', [
            'clientUser' => $clientUser,
            'jadwal' => $jadwal,
            'filters' => [
                'status' => $status,
                'bulan' => $bulan,
                'tahun' => $tahun,
            ],
            'availableStatuses' => $availableStatuses,
            'availableBulan' => $availableBulan,
            'availableTahun' => $availableTahun,
        ]);
    }
}
