using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("UserRecommendations")]
public class UserRecommendation
{
    [Key]
    [Column("user_id")]
    public int UserId { get; set; }

    public string Rec1 { get; set; }
    public string Rec2 { get; set; }
    public string Rec3 { get; set; }
    public string Rec4 { get; set; }
    public string Rec5 { get; set; }
}