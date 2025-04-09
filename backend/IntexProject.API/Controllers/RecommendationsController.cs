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
            var recEntry = _context.UserRecommendations.FirstOrDefault(r => r.UserId == userId);
            if (recEntry == null)
            {
                Console.WriteLine($"User {userId} not found.");
                return NotFound();
            }

            var recommendedTitles = new List<string>
            {
                recEntry.Rec1,
                recEntry.Rec2,
                recEntry.Rec3,
                recEntry.Rec4,
                recEntry.Rec5
            }
            .Where(title => !string.IsNullOrWhiteSpace(title))
            .ToList();

            Console.WriteLine($"🎯 Titles for user {userId}: {string.Join(", ", recommendedTitles)}");

            var recommendedMovies = _moviesDbContext.Movies
                .Where(m => recommendedTitles.Any(t => t.ToLower() == m.Title.ToLower()))
                .ToList();

            Console.WriteLine($"✅ Found {recommendedMovies.Count} matching movies.");
            return Ok(recommendedMovies);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"🔥 ERROR in GetUserFullRecs: {ex}");
            return StatusCode(500, new { message = "Server error", error = ex.Message });
        }
    }




    // GET: api/recommendations/similar/Inception
    [HttpGet("similar/{title}")]
    public IActionResult GetSimilarRecs(string title)
    {
        var recs = _context.CollaborativeMovieRecommendations
            .FirstOrDefault(r => r.MovieTitle == title);

        return recs != null ? Ok(recs) : NotFound();
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
        var recEntry = _context.GenreRecommendations.FirstOrDefault(r => r.UserId == userId);
        if (recEntry == null)
        {
            return NotFound();
        }

        return Ok(recEntry);
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
