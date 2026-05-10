using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CinemaProject.Services;

namespace CinemaProject.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RatingsController : ControllerBase
{
    private readonly MongoDbService _db;

    public RatingsController(MongoDbService db)
    {
        _db = db;
    }

    [HttpPost]
    public IActionResult RateMovie()
    {
        return Ok();
    }
}
