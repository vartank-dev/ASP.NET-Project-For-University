using MongoDB.Driver;
using CinemaProject.Models;

namespace CinemaProject.Services;

public class MongoDbService
{
    private readonly IMongoDatabase _db;

    public MongoDbService(IConfiguration config)
    {
        var client = new MongoClient(config["MongoDb:ConnectionString"]);
        _db = client.GetDatabase(config["MongoDb:Database"]);
    }

    public IMongoCollection<User> Users => _db.GetCollection<User>("Users");
    public IMongoCollection<Movie> Movies => _db.GetCollection<Movie>("Movies");
    public IMongoCollection<Like> Likes => _db.GetCollection<Like>("Likes");
    public IMongoCollection<Rating> Ratings => _db.GetCollection<Rating>("Ratings");
    public IMongoCollection<Comment> Comments => _db.GetCollection<Comment>("Comments");
    public IMongoCollection<Watchlist> Watchlists => _db.GetCollection<Watchlist>("Watchlists");
    public IMongoCollection<Category> Categories => _db.GetCollection<Category>("Categories");

}
