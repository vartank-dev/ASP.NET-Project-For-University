using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Security.Claims;
using CinemaProject.Services;
using CinemaProject.Models;
using CinemaProject.DTOs;

namespace CinemaProject.Controllers;

[ApiController]
[Route("api/comments")]
public class CommentsController : ControllerBase
{
    private readonly MongoDbService _db;

    public CommentsController(MongoDbService db)
    {
        _db = db;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CommentCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var username = User.FindFirstValue(ClaimTypes.Name);

        var comment = new Comment
        {
            MovieId = dto.MovieId,
            UserId = userId,
            Username = username,
            Text = dto.Text
        };

        await _db.Comments.InsertOneAsync(comment);
        return Ok(comment);
    }

    [HttpGet("{movieId}")]
    public async Task<IActionResult> GetByMovie(string movieId)
    {
        var comments = await _db.Comments
            .Find(c => c.MovieId == movieId)
            .SortByDescending(c => c.CreatedAt)
            .ToListAsync();

        return Ok(comments);
    }
}
