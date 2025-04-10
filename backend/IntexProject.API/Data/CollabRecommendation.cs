using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("CollaborativeMovieRecommendations")]
public class CollaborativeMovieRecommendation
{
    [Key]
    [Column("movie_title")]
    public string? MovieTitle { get; set; }

    [Column("rec1")]
    public string? Rec1 { get; set; }

    [Column("rec2")]
    public string? Rec2 { get; set; }

    [Column("rec3")]
    public string? Rec3 { get; set; }

    [Column("rec4")]
    public string? Rec4 { get; set; }

    [Column("rec5")]
    public string? Rec5 { get; set; }
}