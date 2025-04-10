using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IntexProject.API.Data
{
    [Table("UserRecommendations")]
    public class UserRecommendations
    {
        [Key]
        [Column("user_id")]
        public int UserId { get; set; }

        public string? DemoRec1 { get; set; }
        public string? DemoRec2 { get; set; }
        public string? DemoRec3 { get; set; }
        public string? DemoRec4 { get; set; }
        public string? DemoRec5 { get; set; }

        public string? ContentRec1 { get; set; }
        public string? ContentRec2 { get; set; }
        public string? ContentRec3 { get; set; }
        public string? ContentRec4 { get; set; }
        public string? ContentRec5 { get; set; }

        public string? CollabRec1 { get; set; }
        public string? CollabRec2 { get; set; }
        public string? CollabRec3 { get; set; }
        public string? CollabRec4 { get; set; }
        public string? CollabRec5 { get; set; }
    }
}
