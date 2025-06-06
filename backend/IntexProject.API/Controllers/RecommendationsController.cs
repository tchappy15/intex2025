using IntexProject.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("[controller]")]
public class RecommendationsController : ControllerBase
{
    private readonly RecommendationsDbContext _context;
    private readonly MoviesDbContext _moviesDbContext;

    public RecommendationsController(RecommendationsDbContext context, MoviesDbContext moviesDbContext)
    {
        _context = context;
        _moviesDbContext = moviesDbContext;
    }

    // GET: api/recommendations/user/5
    [HttpGet("user/{userId}/full")]
    public IActionResult GetUserFullRecs(int userId)
    {
        try
        {
            // Fetch the user recommendations from the database
            var recEntry = _context.UserRecommendations.FirstOrDefault(r => r.UserId == userId);
            if (recEntry == null)
            {
                Console.WriteLine($"User {userId} not found.");
                return NotFound(new { message = $"User {userId} not found." });
            }

            // Build the list of recommended movie titles, replacing null with empty string
            var recommendedTitles = new List<string>
            {
                recEntry.DemoRec1 ?? "",
                recEntry.DemoRec2 ?? "",
                recEntry.DemoRec3 ?? "",
                recEntry.DemoRec4 ?? "",
                recEntry.DemoRec5 ?? "",
                recEntry.ContentRec1 ?? "",
                recEntry.ContentRec2 ?? "",
                recEntry.ContentRec3 ?? "",
                recEntry.ContentRec4 ?? "",
                recEntry.ContentRec5 ?? "",
                recEntry.CollabRec1 ?? "",
                recEntry.CollabRec2 ?? "",
                recEntry.CollabRec3 ?? "",
                recEntry.CollabRec4 ?? "",
                recEntry.CollabRec5 ?? ""
            }
            .Where(title => !string.IsNullOrEmpty(title))  // Remove empty titles
            .ToList();

            Console.WriteLine($"🎯 Titles for user {userId}: {string.Join(", ", recommendedTitles)}");

            // Query the Movies DbContext using case-insensitive title comparison
            // Pull all movies first, then filter by recommended titles (case-insensitive)
            var recommendedMovies = _moviesDbContext.Movies
                .AsEnumerable() // forces client-side filtering
                .Where(m => recommendedTitles.Contains(m.Title, StringComparer.OrdinalIgnoreCase))
                .ToList();


            // Log the resulting list of movie titles
            Console.WriteLine($"✅ Found {recommendedMovies.Count} matching movies: {string.Join(", ", recommendedMovies.Select(m => m.Title))}");

            return Ok(recommendedMovies);  // Return the recommended movies
        }
        catch (Exception ex)
        {
            // Log the error and return a 500 status code
            Console.WriteLine($"🔥 ERROR in GetUserFullRecs: {ex}");
            return StatusCode(500, new { message = "Server error", error = ex.Message });
        }
    }



        // GET: api/recommendations/similar/Inception
    // GET: api/recommendations/similar/Inception
    // [HttpGet("similar/{title}")]
    // public IActionResult GetSimilarRecs(string title)
    // {
    //     var recRow = _context.CollaborativeMovieRecommendations
    //         .FirstOrDefault(r => r.MovieTitle.ToLower() == title.ToLower());

    //     if (recRow == null)
    //     {
    //         return NotFound();
    //     }

    //     var recs = new List<object?>();

    //     if (!string.IsNullOrWhiteSpace(recRow.Rec1))
    //         recs.Add(new { title = recRow.Rec1 });

    //     if (!string.IsNullOrWhiteSpace(recRow.Rec2))
    //         recs.Add(new { title = recRow.Rec2 });

    //     if (!string.IsNullOrWhiteSpace(recRow.Rec3))
    //         recs.Add(new { title = recRow.Rec3 });

    //     if (!string.IsNullOrWhiteSpace(recRow.Rec4))
    //         recs.Add(new { title = recRow.Rec4 });

    //     if (!string.IsNullOrWhiteSpace(recRow.Rec5))
    //         recs.Add(new { title = recRow.Rec5 });

    //     return Ok(recs);
    // }

[HttpGet("similar/{title}/{movieId}")]
public IActionResult GetSimilarRecs(string title, string movieId)
{
    var recRow = _context.CollaborativeMovieRecommendations
        .FirstOrDefault(r => r.MovieTitle.ToLower() == title.ToLower());

    if (recRow == null)
    {
        return NotFound();
    }

    // Helper to safely lookup movieId from Movies table by title
    string? GetMovieId(string recTitle)
    {
        return _moviesDbContext.Movies
            .Where(m => m.Title.ToLower() == recTitle.ToLower())
            .Select(m => m.MovieId)
            .FirstOrDefault();
    }

    var recs = new List<object?>();

    if (!string.IsNullOrWhiteSpace(recRow.Rec1))
        recs.Add(new { title = recRow.Rec1, movieId = GetMovieId(recRow.Rec1) });

    if (!string.IsNullOrWhiteSpace(recRow.Rec2))
        recs.Add(new { title = recRow.Rec2, movieId = GetMovieId(recRow.Rec2) });

    if (!string.IsNullOrWhiteSpace(recRow.Rec3))
        recs.Add(new { title = recRow.Rec3, movieId = GetMovieId(recRow.Rec3) });

    if (!string.IsNullOrWhiteSpace(recRow.Rec4))
        recs.Add(new { title = recRow.Rec4, movieId = GetMovieId(recRow.Rec4) });

    if (!string.IsNullOrWhiteSpace(recRow.Rec5))
        recs.Add(new { title = recRow.Rec5, movieId = GetMovieId(recRow.Rec5) });

    return Ok(recs);
}


    // GET: api/recommendations/movie/s1234
    [HttpGet("movie/{movieId}")]
    public IActionResult GetMovieRecs(string movieId)
    {
        var recs = _context.ContentRecommendations
            .Where(r => r.MovieId == movieId)
            .ToList();

        return recs.Any() ? Ok(recs) : NotFound();
    }

    // GET: api/recommendations/genre/5
    [HttpGet("genre/{userId}")]
    public IActionResult GetGenreRecs(int userId)
    {
        try
        {
            var recEntry = _context.GenreRecommendations.FirstOrDefault(r => r.UserId == userId);
            if (recEntry == null)
            {
                return NotFound();
            }

            // Local helper to look up movieId by title from the MoviesDbContext
            string? GetMovieIdByTitle(string? title) =>
                _moviesDbContext.Movies
                    .Where(m => m.Title == title)
                    .Select(m => m.MovieId.ToString())
                    .FirstOrDefault();

            var result = new
            {
                action_Rec1 = new { title = recEntry.Action_Rec1, movieId = GetMovieIdByTitle(recEntry.Action_Rec1) },
                action_Rec2 = new { title = recEntry.Action_Rec2, movieId = GetMovieIdByTitle(recEntry.Action_Rec2) },
                action_Rec3 = new { title = recEntry.Action_Rec3, movieId = GetMovieIdByTitle(recEntry.Action_Rec3) },

                comedies_Rec1 = new { title = recEntry.Comedies_Rec1, movieId = GetMovieIdByTitle(recEntry.Comedies_Rec1) },
                comedies_Rec2 = new { title = recEntry.Comedies_Rec2, movieId = GetMovieIdByTitle(recEntry.Comedies_Rec2) },
                comedies_Rec3 = new { title = recEntry.Comedies_Rec3, movieId = GetMovieIdByTitle(recEntry.Comedies_Rec3) },

                children_Rec1 = new { title = recEntry.Children_Rec1, movieId = GetMovieIdByTitle(recEntry.Children_Rec1) },
                children_Rec2 = new { title = recEntry.Children_Rec2, movieId = GetMovieIdByTitle(recEntry.Children_Rec2) },
                children_Rec3 = new { title = recEntry.Children_Rec3, movieId = GetMovieIdByTitle(recEntry.Children_Rec3) },

                drama_Rec1 = new { title = recEntry.Drama_Rec1, movieId = GetMovieIdByTitle(recEntry.Drama_Rec1) },
                drama_Rec2 = new { title = recEntry.Drama_Rec2, movieId = GetMovieIdByTitle(recEntry.Drama_Rec2) },
                drama_Rec3 = new { title = recEntry.Drama_Rec3, movieId = GetMovieIdByTitle(recEntry.Drama_Rec3) },

                fantasy_Rec1 = new { title = recEntry.Fantasy_Rec1, movieId = GetMovieIdByTitle(recEntry.Fantasy_Rec1) },
                fantasy_Rec2 = new { title = recEntry.Fantasy_Rec2, movieId = GetMovieIdByTitle(recEntry.Fantasy_Rec2) },
                fantasy_Rec3 = new { title = recEntry.Fantasy_Rec3, movieId = GetMovieIdByTitle(recEntry.Fantasy_Rec3) },

                thriller_Rec1 = new { title = recEntry.Thriller_Rec1, movieId = GetMovieIdByTitle(recEntry.Thriller_Rec1) },
                thriller_Rec2 = new { title = recEntry.Thriller_Rec2, movieId = GetMovieIdByTitle(recEntry.Thriller_Rec2) },
                thriller_Rec3 = new { title = recEntry.Thriller_Rec3, movieId = GetMovieIdByTitle(recEntry.Thriller_Rec3) }
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error retrieving genre recommendations for user {userId}: {ex.Message}");
            return StatusCode(500, new { message = "Server error", error = ex.Message });
        }
    }





    // GET: recommendations/test-connection
    [HttpGet("test-connection")]
    public IActionResult TestConnection()
    {
        try
        {
            var userTable = _context.UserRecommendations.FirstOrDefault();
            var contentTable = _context.ContentRecommendations.FirstOrDefault();
            var collabTable = _context.CollaborativeMovieRecommendations.FirstOrDefault();
            var genreTable = _context.GenreRecommendations.FirstOrDefault();

            return Ok(new
            {
                UserRecommendationsExists = userTable != null,
                ContentRecommendationsExists = contentTable != null,
                CollaborativeMovieRecommendationsExists = collabTable != null,
                GenreRecommendationsExists = genreTable != null
            });
        }
        catch (Exception ex)
        {
            return BadRequest($"Database test failed: {ex.Message}");
        }
    }
}
