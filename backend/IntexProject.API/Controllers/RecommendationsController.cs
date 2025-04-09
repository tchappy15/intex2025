using IntexProject.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("[controller]")]
public class RecommendationsController : ControllerBase
{
    private readonly RecommendationsDbContext _context;

    public RecommendationsController(RecommendationsDbContext context)
    {
        _context = context;
    }

    // GET: api/recommendations/user/5
    [HttpGet("user/{userId}")]
    public IActionResult GetUserRecs(int userId)
    {
        var recs = _context.UserRecommendations.FirstOrDefault(r => r.UserId == userId);
        return recs != null ? Ok(recs) : NotFound();
    }

    // Get similar movies by title
    // GET: api/recommendations/similar/Inception
    [HttpGet("similar/{title}")]
    public IActionResult GetSimilarRecs(string title)
    {
        var recs = _context.CollaborativeMovieRecommendations
            .FirstOrDefault(r => r.MovieTitle == title);

        return recs != null ? Ok(recs) : NotFound();
    }

    // Get related movies by ID
    // GET: api/recommendations/movie/s1234
    [HttpGet("movie/{movieId}")]
    public IActionResult GetMovieRecs(string movieId)
    {
        var recs = _context.ContentRecommendations
            .Where(r => r.MovieId == movieId)
            .ToList();

        return recs.Any() ? Ok(recs) : NotFound();
    }

    // GET: api/recommendations/test-connection
    [HttpGet("test-connection")]
    public IActionResult TestConnection()
    {
        try
        {
            var userTable = _context.UserRecommendations.FirstOrDefault();
            var contentTable = _context.ContentRecommendations.FirstOrDefault();
            var collabTable = _context.CollaborativeMovieRecommendations.FirstOrDefault();

            return Ok(new
            {
                UserRecommendationsExists = userTable != null,
                ContentRecommendationsExists = contentTable != null,
                CollaborativeMovieRecommendationsExists = collabTable != null
            });
        }
        catch (Exception ex)
        {
            return BadRequest($"Database test failed: {ex.Message}");
        }
    }
}
