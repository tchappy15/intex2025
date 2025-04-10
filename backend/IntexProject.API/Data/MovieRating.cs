using System.ComponentModel.DataAnnotations.Schema;
namespace IntexProject.API.Data;


[Table("movies_ratings")]
public class MovieRating
{
    [Column("user_id")]
    public int UserId { get; set; }

    [Column("movieId")]
    public string MovieId { get; set; }

    [Column("rating")]
    public int Rating { get; set; }
}
