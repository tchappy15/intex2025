using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IntexProject.Models
{
    [Table("movies_users")]
    public class MoviesUser
    {
        [Key]
        [Column("user_id")]
        public string userId { get; set; }

        [Column("name")]
        public string name { get; set; }

        [Column("phone")]
        public string phone { get; set; }

        [Column("phone_extension")]
        public string phoneExtension { get; set; }

        [Column("email")]
        public string email { get; set; }

        [Column("age")]
        public int age { get; set; }

        [Column("gender")]
        public string gender { get; set; }

        [Column("city")]
        public string city { get; set; }

        [Column("state")]
        public string state { get; set; }

        [Column("zip")]
        public int zip { get; set; }

        [Column("Netflix")]
        public int netflix { get; set; }

        [Column("Amazon Prime")]
        public int amazonPrime { get; set; }

        [Column("Disney+")]
        public int disney { get; set; }

        [Column("Paramount+")]
        public int paramount { get; set; }

        [Column("Max")]
        public int max { get; set; }

        [Column("Hulu")]
        public int hulu { get; set; }

        [Column("Apple TV+")]
        public int appleTV { get; set; }

        [Column("Peacock")]
        public int peacock { get; set; }
    }
}
