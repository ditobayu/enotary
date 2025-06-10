<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed permissions, roles, and users in the correct order
        $this->call([
            PermissionSeeder::class,     // Create permissions first
            RoleSeeder::class,           // Create roles and assign permissions
            UserSeeder::class,           // Create users and assign roles
            KategoriLayananSeeder::class, // Create kategori layanan
            StatusLayananSeeder::class,   // Create status layanan
        ]);

        // Keep the original test users for development (these won't have roles)
        User::factory(5)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
