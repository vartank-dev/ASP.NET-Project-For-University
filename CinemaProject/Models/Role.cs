using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CinemaProject.Models;

public class Role
{
    [BsonId]
    public ObjectId Id { get; set; }

    public string Name { get; set; } = null!;
}
