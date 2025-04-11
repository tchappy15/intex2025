using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using IntexProject.API.Data;
using SameSiteMode = Microsoft.AspNetCore.Http.SameSiteMode;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;

namespace IntexProject.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]

    public class MoviesController : ControllerBase
    {
        private MoviesDbContext _moviesDbContext;
        private readonly IConfiguration _configuration;
        private readonly ILogger<MoviesController> _logger;
        private static readonly string[] GENRES = new[]
            {
                "Action",
                "Adventure",
                "AnimeSeriesInternationalTVShows",
                "BritishTVShowsDocuseriesInternationalTVShows",
                "Children",
                "Comedies",
                "ComediesDramasInternationalMovies",
                "ComediesInternationalMovies",
                "ComediesRomanticMovies",
                "CrimeTVShowsDocuseries",
                "Documentaries",
                "DocumentariesInternationalMovies",
                "Docuseries",
                "Dramas",
                "DramasInternationalMovies",
                "DramasRomanticMovies",
                "FamilyMovies",
                "Fantasy",
                "HorrorMovies",
                "InternationalMoviesThrillers",
                "InternationalTVShowsRomanticTVShowsTVDramas",
                "KidsTV",
                "LanguageTVShows",
                "Musicals",
                "NatureTV",
                "RealityTV",
                "Spirituality",
                "TVAction",
                "TVComedies",
                "TVDramas",
                "TalkShowsTVComedies",
                "Thrillers"
            };


        public MoviesController(MoviesDbContext temp, IConfiguration configuration, ILogger<MoviesController> logger)
        {
            _moviesDbContext = temp;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpGet("GetMovies")]
        public IActionResult GetMovies(
            int pageSize = 10,
            int pageNum = 1,
            [FromQuery] string? genre = null,
            [FromQuery] string? title = null,
            [FromQuery] string? type = null)
        {
            var query = _moviesDbContext.Movies.AsQueryable();

            //  Filter by type (case-insensitive)
            if (!string.IsNullOrWhiteSpace(type))
            {
                query = query.Where(m => m.Type.ToLower() == type.ToLower());
            }


            // Filter by title (if provided)
            if (!string.IsNullOrWhiteSpace(title))
            {
                query = query.Where(m => m.Title.ToLower().Contains(title.ToLower()));
            }

            // Genre filter logic 
            var genreMap = typeof(Movie)
                .GetProperties()
                .Where(p => p.PropertyType == typeof(int))
                .Select(p => new
                {
                    PropertyName = p.Name,
                    DisplayName = p.GetCustomAttributes(typeof(DisplayAttribute), false)
                                    .Cast<DisplayAttribute>()
                                    .FirstOrDefault()?.Name ?? p.Name
                })
                .ToDictionary(x => x.DisplayName, x => x.PropertyName);

            if (!string.IsNullOrEmpty(genre) && genreMap.TryGetValue(genre, out var propertyName))
            {
                query = query.Where(movie =>
                    EF.Property<int>(movie, propertyName) == 1);
            }

            var totalNumMovies = query.Count();

            var movies = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var returnMovies = new
            {
               movies,
               totalNumMovies
            };

            return Ok(returnMovies);
        }

        [HttpGet("GetGenreTypes")]
        public IActionResult GetGenreTypes()
        {
            var genreTypes = typeof(Movie)
                .GetProperties()
                .Where(p => p.PropertyType == typeof(int)
                        && p.Name != "release_year") //add more if have other type int columns to ignore
                .Select(p =>
                {
                    var display = p.GetCustomAttributes(typeof(DisplayAttribute), false)
                                .FirstOrDefault() as DisplayAttribute;
                    return display?.Name ?? p.Name;
                })
                .ToList();

            return Ok(genreTypes);
        }

        [Authorize(Roles = "Administrator")]
        [HttpDelete("DeleteMovie/{movieId}")]
        public IActionResult DeleteMovie(string movieId)
        {
            // Validate MovieId format: must be like "s123"
            if (string.IsNullOrWhiteSpace(movieId) || !Regex.IsMatch(movieId, @"^s\d{3,}$"))
            {
                return BadRequest("Invalid Movie ID format. Must be 's###'.");
            }

            // Look up the movie safely (parameterized query behind the scenes)
            var movie = _moviesDbContext.Movies.FirstOrDefault(m => m.MovieId == movieId);
            if (movie == null)
            {
                return NotFound("Movie not found.");
            }

            // Proceed to delete
            _moviesDbContext.Movies.Remove(movie);
            _moviesDbContext.SaveChanges();

            return NoContent(); // 204
        }



        [Authorize(Roles = "Administrator")]
        [HttpPost("AddMovie")]
        public IActionResult AddMovie([FromBody] Movie newMovie)
        {
            if (newMovie == null)
            {
                return BadRequest("Invalid movie data.");
            }

            // If MovieId is provided, validate it
            if (!string.IsNullOrEmpty(newMovie.MovieId) && !Regex.IsMatch(newMovie.MovieId, @"^s\d{3,}$"))
            {
                return BadRequest("Invalid Movie ID format. Must be 's###'.");
            }

            if (string.IsNullOrEmpty(newMovie.Title) || string.IsNullOrEmpty(newMovie.Director) || string.IsNullOrEmpty(newMovie.Country))
            {
                return BadRequest("Title, Director, and Country are required fields.");
            }

            // Auto-generate the next available movieId in "s####" format if not provided
            if (string.IsNullOrEmpty(newMovie.MovieId))
            {
                var lastId = _moviesDbContext.Movies
                    .OrderByDescending(m => m.MovieId)
                    .Select(m => m.MovieId)
                    .FirstOrDefault(); // e.g., "s8019"

                int nextIdNumber = 1;

                if (!string.IsNullOrEmpty(lastId) && lastId.StartsWith("s") && int.TryParse(lastId.Substring(1), out int lastNum))
                {
                    nextIdNumber = lastNum + 1;
                }

                newMovie.MovieId = $"s{nextIdNumber}";
            }

            _moviesDbContext.Movies.Add(newMovie);
            _moviesDbContext.SaveChanges();

            return CreatedAtAction(nameof(GetMovies), new { id = newMovie.MovieId }, newMovie);
        }


   [Authorize(Roles = "Administrator")]
        [HttpPut("UpdateMovie/{movieId}")]
        public IActionResult UpdateMovie(string movieId, [FromBody] Movie updatedMovie)
        {
            if (updatedMovie == null || movieId != updatedMovie.MovieId)
            {
                return BadRequest("Invalid movie data.");
            }

            if (!string.IsNullOrEmpty(updatedMovie.MovieId) && !Regex.IsMatch(updatedMovie.MovieId, @"^s\d{3,}$"))
            {
                return BadRequest("Invalid Movie ID format. Must be 's###'.");
            }

            if (string.IsNullOrEmpty(updatedMovie.Title))
            {
                return BadRequest("Title is a required field.");
            }

            var existingMovie = _moviesDbContext.Movies.FirstOrDefault(m => m.MovieId == movieId);
            if (existingMovie == null)
            {
                return NotFound();
            }

            // Update editable fields
            existingMovie.Title = updatedMovie.Title;
            existingMovie.Director = updatedMovie.Director;
            existingMovie.Cast = updatedMovie.Cast;
            existingMovie.Country = updatedMovie.Country;
            existingMovie.release_year = updatedMovie.release_year;
            existingMovie.Rating = updatedMovie.Rating;
            existingMovie.Duration = updatedMovie.Duration;
            existingMovie.Description = updatedMovie.Description;

            // Update genre fields
            foreach (var genre in GENRES)
                {
                    var prop = typeof(Movie).GetProperty(genre);
                    if (prop != null)
                    {
                        var value = prop.GetValue(updatedMovie);
                        prop.SetValue(existingMovie, value);
                    }
                }

            _moviesDbContext.SaveChanges();

            return Ok(existingMovie);
        }




        [HttpGet("{id}")]
        public async Task<IActionResult> GetMovieById(string id)
        {
            try
            {
                var movie = await _moviesDbContext.Movies.FirstOrDefaultAsync(m => m.MovieId == id);

                if (movie == null)
                {
                    return NotFound();
                }

                if (string.IsNullOrEmpty(movie.MovieId))
                {
                    return BadRequest("Movie ID is missing.");
                }

                if (!Regex.IsMatch(movie.MovieId, @"^s\d+$"))
                {
                    return BadRequest("Invalid Movie ID format. Must be 's' followed by digits.");
                }

                if (id != movie.MovieId)
                {
                    return BadRequest("Mismatched movie ID.");
                }

                if (string.IsNullOrEmpty(movie.Title))
                {
                    return BadRequest("Title is a required field.");
                }

                return Ok(movie);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching movie with ID {id}", id);
                return StatusCode(500, "Internal server error");
            }
        }



        [HttpPost("AddRating/{useremail}")]
        public IActionResult AddRating(string useremail, [FromBody] RatingInputDto input)
        {
            if (input == null)
            {
                return BadRequest("Missing rating data");
            }

            var userId = _moviesDbContext.MoviesUsers
                .Where(u => u.email.ToLower() == useremail.Trim().ToLower())
                .Select(u => u.userId)
                .FirstOrDefault();

            if (userId == null)
            {
                Console.WriteLine($"❌ Could not find user_id for email: {useremail}");
                return BadRequest("User not found.");
            }

            Console.WriteLine($"✅ Found user_id: {userId} for email: {useremail}");

            var newRating = new MovieRating
            {
                UserId = userId,
                MovieId = input.movieId,
                Rating = input.Rating
            };

            _moviesDbContext.MoviesRatings.Add(newRating);
            _moviesDbContext.SaveChanges();

            return Ok("Rating submitted.");
        }


        public class RatingInputDto
        {
            public required string movieId { get; set; }
            public int Rating { get; set; }
        }


    }
}