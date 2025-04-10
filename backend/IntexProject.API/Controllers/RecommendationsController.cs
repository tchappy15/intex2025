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
            var recommendedMovies = _moviesDbContext.Movies
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
    [HttpGet("similar/{title}")]
    public IActionResult GetSimilarRecs(string title)
    {
        var recRow = _context.CollaborativeMovieRecommendations
            .FirstOrDefault(r => r.MovieTitle.ToLower() == title.ToLower());

        if (recRow == null)
        {
            return NotFound();
        }

        var recs = new List<object?>();

        if (!string.IsNullOrWhiteSpace(recRow.Rec1))
            recs.Add(new { title = recRow.Rec1 });

        if (!string.IsNullOrWhiteSpace(recRow.Rec2))
            recs.Add(new { title = recRow.Rec2 });

        if (!string.IsNullOrWhiteSpace(recRow.Rec3))
            recs.Add(new { title = recRow.Rec3 });

        if (!string.IsNullOrWhiteSpace(recRow.Rec4))
            recs.Add(new { title = recRow.Rec4 });

        if (!string.IsNullOrWhiteSpace(recRow.Rec5))
            recs.Add(new { title = recRow.Rec5 });

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

            return Ok(recEntry);
        }
        catch (Exception ex)
        {
            // Log the error
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
