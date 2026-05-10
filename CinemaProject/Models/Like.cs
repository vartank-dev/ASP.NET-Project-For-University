using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CinemaProject.Models;

public class Like
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    public string MovieId { get; set; }
    public string UserId { get; set; }
}
