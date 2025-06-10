<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class CheckRolesPermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:roles-permissions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Display roles, permissions, and user assignments for the e-notary system';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== E-Notary System Roles & Permissions Overview ===');
        $this->newLine();

        // Display roles
        $this->info('🎭 ROLES CREATED:');
        $roles = Role::all();
        foreach ($roles as $role) {
            $this->line("  - {$role->name}");
        }
        $this->newLine();

        // Display total counts
        $this->info('📊 STATISTICS:');
        $this->line("  - Total Permissions: " . Permission::count());
        $this->line("  - Total Roles: " . Role::count());
        $this->line("  - Total Users: " . User::count());
        $this->newLine();

        // Display users by role
        $this->info('👥 USERS BY ROLE:');
        $rolesWithUsers = Role::with('users')->get();
        
        foreach ($rolesWithUsers as $role) {
            $userCount = $role->users->count();
            $this->line("  📋 {$role->name}: {$userCount} users");
            
            foreach ($role->users as $user) {
                $this->line("    • {$user->name} ({$user->email})");
            }
            $this->newLine();
        }

        // Display users without roles
        $usersWithoutRoles = User::doesntHave('roles')->get();
        if ($usersWithoutRoles->count() > 0) {
            $this->info('👤 USERS WITHOUT ROLES:');
            foreach ($usersWithoutRoles as $user) {
                $this->line("  • {$user->name} ({$user->email})");
            }
            $this->newLine();
        }

        // Display permissions by role
        $this->info('🔐 PERMISSIONS BY ROLE:');
        foreach ($roles as $role) {
            $permissions = $role->permissions;
            $this->line("  📋 {$role->name}: {$permissions->count()} permissions");
            
            if ($this->option('verbose')) {
                foreach ($permissions as $permission) {
                    $this->line("    • {$permission->name}");
                }
            }
            $this->newLine();
        }

        if (!$this->option('verbose')) {
            $this->comment('💡 Use --verbose flag to see detailed permissions for each role');
        }

        $this->info('✅ Overview completed successfully!');
    }
}
