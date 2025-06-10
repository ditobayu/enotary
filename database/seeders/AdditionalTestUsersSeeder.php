<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdditionalTestUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * This seeder can be run independently to add more test users
     * Usage: php artisan db:seed --class=AdditionalTestUsersSeeder
     */
    public function run(): void
    {
        $this->command->info('Creating additional test users...');

        // Create more clients
        $additionalClients = [
            ['name' => 'Alice Cooper', 'email' => 'alice.cooper@example.com'],
            ['name' => 'Bob Miller', 'email' => 'bob.miller@example.com'],
            ['name' => 'Carol White', 'email' => 'carol.white@example.com'],
            ['name' => 'Daniel Green', 'email' => 'daniel.green@example.com'],
            ['name' => 'Eva Martinez', 'email' => 'eva.martinez@example.com'],
        ];

        foreach ($additionalClients as $clientData) {
            $client = User::create([
                'name' => $clientData['name'],
                'email' => $clientData['email'], 
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]);
            $client->assignRole('client');
            $this->command->line("  ✓ Created client: {$client->name}");
        }

        // Create additional admin
        $admin = User::create([
            'name' => 'Additional Admin',
            'email' => 'admin2@enotary.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');
        $this->command->line("  ✓ Created admin: {$admin->name}");

        $this->command->info('Additional test users created successfully!');
        $this->command->newLine();
        $this->command->comment('All users created with password: password123');
    }
}
