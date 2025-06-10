<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class AdminUserController extends Controller
{
    /**
     * Display a listing of admin users.
     */
    public function index(): Response
    {
        $adminUsers = User::role(['admin', 'superadmin'])
            ->with('roles')
            ->orderBy('name')
            ->get();

        return Inertia::render('AdminUser/Index', [
            'adminUsers' => $adminUsers
        ]);
    }

    /**
     * Show the form for creating a new admin user.
     */
    public function create(): Response
    {
        $roles = Role::whereIn('name', ['admin', 'superadmin'])->get();
        
        return Inertia::render('AdminUser/Create', [
            'roles' => $roles
        ]);
    }

    /**
     * Store a newly created admin user.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:admin,superadmin',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'email_verified_at' => now(),
        ]);

        $user->assignRole($request->role);

        return redirect()->route('admin-users.index')
            ->with('success', 'Admin user berhasil dibuat.');
    }

    /**
     * Display the specified admin user.
     */
    public function show(User $adminUser): Response
    {
        // Ensure the user is an admin or superadmin
        if (!$adminUser->hasAnyRole(['admin', 'superadmin'])) {
            abort(404, 'Admin user tidak ditemukan.');
        }

        $adminUser->load('roles');

        return Inertia::render('AdminUser/Show', [
            'adminUser' => $adminUser
        ]);
    }

    /**
     * Show the form for editing the specified admin user.
     */
    public function edit(User $adminUser): Response
    {
        // Ensure the user is an admin or superadmin
        if (!$adminUser->hasAnyRole(['admin', 'superadmin'])) {
            abort(404, 'Admin user tidak ditemukan.');
        }

        // Prevent superadmin from editing themselves
        if ($adminUser->id === Auth::id()) {
            return redirect()->route('admin-users.index')
                ->with('error', 'Anda tidak dapat mengedit akun Anda sendiri.');
        }

        $adminUser->load('roles');
        $roles = Role::whereIn('name', ['admin', 'superadmin'])->get();

        return Inertia::render('AdminUser/Edit', [
            'adminUser' => $adminUser,
            'roles' => $roles
        ]);
    }

    /**
     * Update the specified admin user.
     */
    public function update(Request $request, User $adminUser): RedirectResponse
    {
        // Ensure the user is an admin or superadmin
        if (!$adminUser->hasAnyRole(['admin', 'superadmin'])) {
            abort(404, 'Admin user tidak ditemukan.');
        }

        // Prevent superadmin from editing themselves
        if ($adminUser->id === Auth::id()) {
            return redirect()->route('admin-users.index')
                ->with('error', 'Anda tidak dapat mengedit akun Anda sendiri.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,' . $adminUser->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:admin,superadmin',
        ]);

        $adminUser->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        // Update password if provided
        if ($request->password) {
            $adminUser->update([
                'password' => Hash::make($request->password),
            ]);
        }

        // Update role
        $adminUser->syncRoles($request->role);

        return redirect()->route('admin-users.index')
            ->with('success', 'Admin user berhasil diperbarui.');
    }

    /**
     * Remove the specified admin user.
     */
    public function destroy(User $adminUser): RedirectResponse
    {
        // Ensure the user is an admin or superadmin
        if (!$adminUser->hasAnyRole(['admin', 'superadmin'])) {
            abort(404, 'Admin user tidak ditemukan.');
        }

        // Prevent superadmin from deleting themselves
        if ($adminUser->id === Auth::id()) {
            return redirect()->route('admin-users.index')
                ->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        // Prevent deletion if this is the last superadmin
        if ($adminUser->hasRole('superadmin')) {
            $superadminCount = User::role('superadmin')->count();
            if ($superadminCount <= 1) {
                return redirect()->route('admin-users.index')
                    ->with('error', 'Tidak dapat menghapus superadmin terakhir.');
            }
        }

        $adminUser->delete();

        return redirect()->route('admin-users.index')
            ->with('success', 'Admin user berhasil dihapus.');
    }

    /**
     * Toggle user active status (suspend/activate)
     */
    public function toggleStatus(User $adminUser): RedirectResponse
    {
        // Ensure the user is an admin or superadmin
        if (!$adminUser->hasAnyRole(['admin', 'superadmin'])) {
            abort(404, 'Admin user tidak ditemukan.');
        }

        // Prevent superadmin from suspending themselves
        if ($adminUser->id === Auth::id()) {
            return redirect()->route('admin-users.index')
                ->with('error', 'Anda tidak dapat mengubah status akun Anda sendiri.');
        }

        // This is a simple implementation - you might want to add a 'status' column to users table
        // For now, we'll use email_verified_at as a simple active/inactive indicator
        if ($adminUser->email_verified_at) {
            $adminUser->update(['email_verified_at' => null]);
            $message = 'Admin user berhasil dinonaktifkan.';
        } else {
            $adminUser->update(['email_verified_at' => now()]);
            $message = 'Admin user berhasil diaktifkan.';
        }

        return redirect()->route('admin-users.index')
            ->with('success', $message);
    }
}