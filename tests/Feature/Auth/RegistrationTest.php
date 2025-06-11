<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('new users are automatically assigned client role', function () {
    // Ensure client role exists
    Role::firstOrCreate(['name' => 'client']);
    
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $user = User::where('email', 'test@example.com')->first();
    
    expect($user)->not->toBeNull();
    expect($user->hasRole('client'))->toBeTrue();
    expect($user->email_verified_at)->not->toBeNull();
    
    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});
