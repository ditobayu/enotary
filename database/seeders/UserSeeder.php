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
            'nik' => '1234567890123400',
            'email' => 'superadmin@enotary.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $superAdmin->assignRole('superadmin');

        // Create Regular Admin
        $admin = User::create([
            'name' => 'Admin User',
            'nik' => '1234567890123401',
            'email' => 'admin@enotary.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');

        // Create Another Admin for testing
        $admin2 = User::create([
            'name' => 'Admin User 2',
            'nik' => '1234567890123402',
            'email' => 'admin2@enotary.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $admin2->assignRole('admin');

        // Create Client Users
        $clients = [
            ['name' => 'John Doe', 'nik' => '3201010101850001', 'email' => 'john.doe@example.com'],
            ['name' => 'Jane Smith', 'nik' => '3201010201900002', 'email' => 'jane.smith@example.com'],
            ['name' => 'Michael Johnson', 'nik' => '3201010301950003', 'email' => 'michael.johnson@example.com'], 
            ['name' => 'Emily Davis', 'nik' => '3201010401920004', 'email' => 'emily.davis@example.com'],
            ['name' => 'David Wilson', 'nik' => '3201010501880005', 'email' => 'david.wilson@example.com'],
            ['name' => 'Lisa Anderson', 'nik' => '3201010601930006', 'email' => 'lisa.anderson@example.com'],
            ['name' => 'Robert Brown', 'nik' => '3201010701940007', 'email' => 'robert.brown@example.com'],
            ['name' => 'Amanda Taylor', 'nik' => '3201010801960008', 'email' => 'amanda.taylor@example.com'],
        ];

        foreach ($clients as $clientData) {
            $client = User::create([
                'name' => $clientData['name'],
                'nik' => $clientData['nik'],
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
