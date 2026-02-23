<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    //REGISTER
    
    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/register', [
            'name'                  => 'Test User',
            'email'                 => 'test@test.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['user', 'token']);

        $this->assertDatabaseHas('users', [
            'email' => 'test@test.com',
            'role'  => 'user',
        ]);
    }

    public function test_register_requires_valid_data(): void
    {
        // Missing name, bad email, no password confirmation
        $response = $this->postJson('/api/register', [
            'email'    => 'not-an-email',
            'password' => 'short',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_register_rejects_duplicate_email(): void
    {
        User::factory()->create(['email' => 'taken@test.com']);

        $response = $this->postJson('/api/register', [
            'name'                  => 'Duplicate',
            'email'                 => 'taken@test.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    //LOGIN

    public function test_user_can_login(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => $user->email,
            'password' => 'password123',
        ]);

        $response->assertOk()
                 ->assertJsonStructure(['user', 'token']);
    }

    public function test_login_fails_with_bad_credentials(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    public function test_login_fails_with_nonexistent_email(): void
    {
        $response = $this->postJson('/api/login', [
            'email'    => 'ghost@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    //LOGOUT

    public function test_user_can_logout(): void
    {
        $user  = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
                         ->postJson('/api/logout');

        $response->assertOk()
                 ->assertJson(['message' => 'Disconnected successfully.']);

        $this->assertCount(0, $user->tokens);
    }

    public function test_logout_requires_authentication(): void
    {
        $response = $this->postJson('/api/logout');

        $response->assertStatus(401);
    }
}
