using System.ComponentModel.DataAnnotations;

namespace IntexProject.DTOs
{
    public class RegisterRequest
    {
        public string email { get; set; }
        public string password { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }

        [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone must be exactly 10 digits.")]
        public string phone { get; set; }

        public string phoneExtension { get; set; }
        public int age { get; set; }
        public string gender { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public int zip { get; set; }
        public bool netflix { get; set; }
        public bool amazonPrime { get; set; }
        public bool disney { get; set; }
        public bool paramount { get; set; }
        public bool max { get; set; }
        public bool hulu { get; set; }
        public bool appleTV { get; set; }
        public bool peacock { get; set; }
    }
}
