using System.ComponentModel.DataAnnotations.Schema;

[Table("ContentRecommendations")]
public class ContentRecommendation
{
    [Column("movie_id")]
    public string? MovieId { get; set; }

    [Column("title")]
    public string? Title { get; set; }

    [Column("recommended_id")]
    public string? RecommendedId { get; set; }

    [Column("recommended_title")]
    public string? RecommendedTitle { get; set; }

    public double Score { get; set; }
}
