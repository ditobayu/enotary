<?php

namespace App\Http\Controllers;

use App\Models\LogAktivitas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LogAktivitasController extends Controller
{
    /**
     * Display a listing of activity logs (superadmin only)
     */
    public function index(Request $request): Response
    {
        // Pastikan hanya superadmin yang bisa mengakses
        if (!Auth::user()->hasRole('superadmin')) {
            abort(403, 'Anda tidak memiliki akses untuk melihat log aktivitas.');
        }

        $userFilter = $request->input('user');
        $roleFilter = $request->input('role');
        $dateFilter = $request->input('date');
        $search = $request->input('search');

        // Query untuk mendapatkan log aktivitas dari user dengan role client dan admin
        $query = LogAktivitas::with(['user' => function($q) {
            $q->with('roles');
        }])
        ->whereHas('user', function($q) {
            $q->whereHas('roles', function($roleQuery) {
                $roleQuery->whereIn('name', ['client', 'admin']);
            });
        });

        // Filter berdasarkan user tertentu
        if ($userFilter) {
            $query->where('id_user', $userFilter);
        }

        // Filter berdasarkan role
        if ($roleFilter && in_array($roleFilter, ['client', 'admin'])) {
            $query->whereHas('user.roles', function($roleQuery) use ($roleFilter) {
                $roleQuery->where('name', $roleFilter);
            });
        }

        // Filter berdasarkan tanggal
        if ($dateFilter) {
            $query->whereDate('tanggal_waktu', $dateFilter);
        }

        // Search di aktivitas atau nama user
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('aktivitas', 'like', '%' . $search . '%')
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('name', 'like', '%' . $search . '%')
                               ->orWhere('email', 'like', '%' . $search . '%');
                  });
            });
        }

        $logAktivitas = $query->orderBy('tanggal_waktu', 'desc')
                             ->paginate(20)
                             ->withQueryString();

        // Dapatkan daftar user dengan role client dan admin untuk filter
        $users = User::whereHas('roles', function($q) {
            $q->whereIn('name', ['client', 'admin']);
        })->with('roles')->orderBy('name')->get();

        return Inertia::render('LogAktivitas/Index', [
            'logAktivitas' => $logAktivitas,
            'users' => $users,
            'filters' => [
                'user' => $userFilter,
                'role' => $roleFilter,
                'date' => $dateFilter,
                'search' => $search,
            ]
        ]);
    }

    /**
     * Display the specified activity log
     */
    public function show(LogAktivitas $logAktivitas): Response
    {
        // Pastikan hanya superadmin yang bisa mengakses
        if (!Auth::user()->hasRole('superadmin')) {
            abort(403, 'Anda tidak memiliki akses untuk melihat log aktivitas.');
        }

        // Pastikan log ini dari user dengan role client atau admin
        $logAktivitas->load(['user.roles']);
        $userRoles = $logAktivitas->user->roles->pluck('name')->toArray();
        
        if (!array_intersect($userRoles, ['client', 'admin'])) {
            abort(404, 'Log aktivitas tidak ditemukan.');
        }

        return Inertia::render('LogAktivitas/Show', [
            'logAktivitas' => $logAktivitas
        ]);
    }
}
