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
        'nik' => '1234567890123456',
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
        'nik' => '1234567890123456',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $user = User::where('email', 'test@example.com')->first();
    
    expect($user)->not->toBeNull();
    expect($user->hasRole('client'))->toBeTrue();
    expect($user->email_verified_at)->not->toBeNull();
    expect($user->nik)->toBe('1234567890123456');
    
    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('nik is required', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors('nik');
});

test('nik must be exactly 16 digits', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'nik' => '123456789012345', // 15 digits
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors('nik');
});

test('nik must be numeric', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'nik' => '123456789012345a', // contains letter
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors('nik');
});

test('nik must be unique', function () {
    // Create a user with specific NIK
    User::factory()->create(['nik' => '1234567890123456']);

    $response = $this->post('/register', [
        'name' => 'Test User',
        'nik' => '1234567890123456', // same NIK
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors('nik');
});
