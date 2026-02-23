<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1 admin fixe
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // 4 users classiques
        $users = [
            ['name' => 'Rabe', 'email' => 'rabe@test.com'],
            ['name' => 'Rakoto', 'email' => 'rakoto@test.com'],
            ['name' => 'Rasoa', 'email' => 'rasoa@test.com'],
            ['name' => 'Ny Aina', 'email' => 'nyaina@test.com'],
        ];

        foreach ($users as $user) {
            User::create([
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => Hash::make('password'),
                'role' => 'user',
            ]);
        }
    }
}
