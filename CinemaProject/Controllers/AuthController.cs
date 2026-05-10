using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using CinemaProject.Services;
using CinemaProject.Models;
using CinemaProject.DTOs;
using MongoDB.Driver;

namespace CinemaProject.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly MongoDbService _db;
    private readonly JwtService _jwt;

    public AuthController(MongoDbService db, JwtService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var exists = await _db.Users.Find(u => u.Email == dto.Email).AnyAsync();
        if (exists)
            return BadRequest("Email already exists");

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        await _db.Users.InsertOneAsync(user);

        var token = _jwt.Generate(user);
        return Ok(new { token });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _db.Users
            .Find(u => u.Email == dto.Email)
            .FirstOrDefaultAsync();

        if (user == null)
            return Unauthorized("Invalid credentials");

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized("Invalid credentials");

        var token = _jwt.Generate(user);

        return Ok(new
        {
            token,
            user = new
            {
                id = user.Id,
                username = user.Username,
                email = user.Email
            }
        });
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var username = User.FindFirstValue(ClaimTypes.Name);
        return Ok(new { id,username });
    }
}
