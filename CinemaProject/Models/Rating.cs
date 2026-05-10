using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CinemaProject.Models;

public class Rating
{
    public string Id { get; set; }
    public string MovieId { get; set; }
    public string UserId { get; set; }
    public int Value { get; set; } // 1–5
}
