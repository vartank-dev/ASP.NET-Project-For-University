using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Security.Claims;
using CinemaProject.Services;
using CinemaProject.Models;

namespace CinemaProject.Controllers;

[ApiController]
[Route("api/likes")]
public class LikesController : ControllerBase
{
    private readonly MongoDbService _db;

    public LikesController(MongoDbService db)
    {
        _db = db;
    }

    [Authorize]
    [HttpPost("{movieId}")]
    public async Task<IActionResult> ToggleLike(string movieId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var existing = await _db.Likes
            .Find(l => l.MovieId == movieId && l.UserId == userId)
            .FirstOrDefaultAsync();

        if (existing != null)
        {
            await _db.Likes.DeleteOneAsync(l => l.Id == existing.Id);
            return Ok(new { liked = false });
        }

        var like = new Like
        {
            MovieId = movieId,
            UserId = userId
        };

        await _db.Likes.InsertOneAsync(like);
        return Ok(new { liked = true });
    }

    [HttpGet("{movieId}/count")]
    public async Task<IActionResult> Count(string movieId)
    {
        var count = await _db.Likes.CountDocumentsAsync(l => l.MovieId == movieId);
        return Ok(count);
    }
}
