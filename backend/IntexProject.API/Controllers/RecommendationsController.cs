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
    var recEntry = _context.UserRecommendations.FirstOrDefault(r => r.UserId == userId);
    if (recEntry == null)
    {
        return NotFound();
    }

    // Extract titles from columns Rec1 through Rec5
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

    // Now query MoviesDbContext by title
    var recommendedMovies = _moviesDbContext.Movies
        .Where(m => recommendedTitles.Contains(m.Title))
        .ToList();

    return Ok(recommendedMovies);
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
