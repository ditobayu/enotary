<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@enotary.test'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Assign admin role
        $adminUser->assignRole('admin');

        $this->command->info('Admin user created successfully!');
        $this->command->info('Email: admin@enotary.test');
        $this->command->info('Password: password');
    }
}
