using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CinemaProject.Models;

public class Watchlist
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    public string MovieId { get; set; }
    public int Views { get; set; } = 0; // ✅ ТОВА
}
