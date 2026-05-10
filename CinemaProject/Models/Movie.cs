using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CinemaProject.Models;

public class Movie
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    public string Title { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }
    public string CategoryId { get; set; }

    public string OwnerId { get; set; }   // 👈 важно
}
