using System.ComponentModel.DataAnnotations.Schema;
namespace IntexProject.API.Data;


[Table("movies_ratings")]
public class MovieRating
{
    [Column("user_id")]
    public string UserId { get; set; }

    [Column("show_id")]
    public string ShowId { get; set; }

    [Column("rating")]
    public int Rating { get; set; }
}
