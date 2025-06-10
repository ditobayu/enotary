<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Super Admin
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@enotary.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $superAdmin->assignRole('superadmin');

        // Create Regular Admin
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@enotary.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');

        // Create Another Admin for testing
        $admin2 = User::create([
            'name' => 'Admin User 2',
            'email' => 'admin2@enotary.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $admin2->assignRole('admin');

        // Create Client Users
        $clients = [
            ['name' => 'John Doe', 'email' => 'john.doe@example.com'],
            ['name' => 'Jane Smith', 'email' => 'jane.smith@example.com'],
            ['name' => 'Michael Johnson', 'email' => 'michael.johnson@example.com'], 
            ['name' => 'Emily Davis', 'email' => 'emily.davis@example.com'],
            ['name' => 'David Wilson', 'email' => 'david.wilson@example.com'],
            ['name' => 'Lisa Anderson', 'email' => 'lisa.anderson@example.com'],
            ['name' => 'Robert Brown', 'email' => 'robert.brown@example.com'],
            ['name' => 'Amanda Taylor', 'email' => 'amanda.taylor@example.com'],
        ];

        foreach ($clients as $clientData) {
            $client = User::create([
                'name' => $clientData['name'],
                'email' => $clientData['email'],
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]);
            $client->assignRole('client');
        }

        // Create some additional test users without roles for testing purposes
        // for ($i = 1; $i <= 3; $i++) {
        //     User::create([
        //         'name' => "Test User $i",
        //         'email' => "testuser$i@example.com",
        //         'password' => Hash::make('password123'),
        //         'email_verified_at' => now(),
        //     ]);
        // }
    }
}
