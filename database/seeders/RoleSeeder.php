<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles and assign permissions
        
        // 1. Superadmin Role - Full system access including admin management
        $superadminRole = Role::firstOrCreate(['name' => 'superadmin']);
        $superadminRole->givePermissionTo(Permission::all());
        
        // 2. Admin Role - Full system access except admin management
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminPermissions = Permission::whereNotIn('name', [
            'view admin users',
            'create admin users', 
            'edit admin users',
            'delete admin users',
            'manage admin roles',
            'suspend admin users',
            'activate admin users',
            'view activity logs',
        ])->get();
        $adminRole->givePermissionTo($adminPermissions);

        // 3. Client Role - End users requesting notarization
        $clientRole = Role::firstOrCreate(['name' => 'client']);
        $clientRole->givePermissionTo([
            // Document management (limited)
            'view documents',
            'create documents',
            'download documents',
            
            // Service request management
            'view layanan',
            'create layanan',
            'edit layanan',
            'delete layanan',
            
            // Profile management
            'view activity log',
            
            // Billing (if applicable)
            'view transaction history',
        ]);
    }
}
