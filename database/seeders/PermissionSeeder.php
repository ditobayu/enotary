<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permissions by category for e-notary system
        $permissions = [
            // Document Management
            'document_management' => [
                'view documents',
                'create documents', 
                'edit documents',
                'delete documents',
                'download documents',
                'share documents',
                'archive documents',
                'restore documents',
            ],
            
            // Notarization Process
            'notarization' => [
                'create notarization',
                'approve notarization',
                'reject notarization',
                'view notarization history',
                'cancel notarization',
                'schedule notarization',
                'complete notarization',
                'assign notary',
            ],
            
            // Service Request Management (Layanan)
            'layanan' => [
                'view layanan',
                'create layanan',
                'edit layanan',
                'delete layanan',
                'approve layanan',
                'reject layanan',
                'assign layanan',
                'complete layanan',
            ],
            
            // User Management (Admin only)
            'user_management' => [
                'view users',
                'create users',
                'edit users',
                'delete users',
                'manage user roles',
                'suspend users',
                'activate users',
            ],
            
            // Admin Management (Superadmin only)
            'admin_management' => [
                'view admin users',
                'create admin users',
                'edit admin users',
                'delete admin users',
                'manage admin roles',
                'suspend admin users',
                'activate admin users',
            ],
            
            // System Administration
            'system_admin' => [
                'view system settings',
                'edit system settings',
                'view audit logs',
                'view activity logs',
                'manage notifications',
                'backup system',
                'restore system',
                'manage integrations',
            ],
            
            // Reports and Analytics
            'reports' => [
                'view reports',
                'export reports',
                'view analytics',
                'create custom reports',
                'schedule reports',
            ],
            
            // Profile and Account
            'profile' => [
                'view profile',
                'edit profile',
                'change password',
                'manage api tokens',
                'view activity log',
            ],
            
            // Payment and Billing (if applicable)
            'billing' => [
                'view billing',
                'manage payment methods',
                'view transaction history',
                'process refunds',
            ],
        ];

        // Create all permissions
        foreach ($permissions as $category => $categoryPermissions) {
            foreach ($categoryPermissions as $permission) {
                Permission::firstOrCreate(['name' => $permission]);
            }
        }
    }
}
