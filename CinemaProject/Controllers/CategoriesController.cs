using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using CinemaProject.Services;
using CinemaProject.Models;
using CinemaProject.DTOs;

namespace CinemaProject.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly MongoDbService _db;

    public CategoriesController(MongoDbService db)
    {
        _db = db;
    }

    // ✅ ВСИЧКИ КАТЕГОРИИ
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _db.Categories.Find(_ => true).ToListAsync();
        return Ok(categories);
    }

    // ✅ КАТЕГОРИЯ ПО ID
    [HttpGet("{id:length(24)}")]
    public async Task<IActionResult> GetById(string id)
    {
        var category = await _db.Categories
            .Find(c => c.Id == id)
            .FirstOrDefaultAsync();

        if (category == null)
            return NotFound();

        return Ok(category);
    }

        // ➕ създаване
    [HttpPost]
    public async Task<IActionResult> Create(CategoryCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest("Името е задължително");

        var category = new Category
        {
            Name = dto.Name
        };

        await _db.Categories.InsertOneAsync(category);
        return Ok(category);
    }
}
