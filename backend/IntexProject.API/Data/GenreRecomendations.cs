namespace IntexProject.API.Data
{
    public class GenreRecommendations
    {
        public int UserId { get; set; }

        public string? Action_Rec1 { get; set; }
        public string? Action_Rec2 { get; set; }
        public string? Action_Rec3 { get; set; }

        public string? Comedies_Rec1 { get; set; }
        public string? Comedies_Rec2 { get; set; }
        public string? Comedies_Rec3 { get; set; }

        public string? Children_Rec1 { get; set; }
        public string? Children_Rec2 { get; set; }
        public string? Children_Rec3 { get; set; }

        // Drama
        public string? Drama_Rec1 { get; set; }
        public string? Drama_Rec2 { get; set; }
        public string? Drama_Rec3 { get; set; }

        // Fantasy
        public string? Fantasy_Rec1 { get; set; }
        public string? Fantasy_Rec2 { get; set; }
        public string? Fantasy_Rec3 { get; set; }

        // Thriller
        public string? Thriller_Rec1 { get; set; }
        public string? Thriller_Rec2 { get; set; }
        public string? Thriller_Rec3 { get; set; }


    }

}
