using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using IntexProject.API.Data;
using SameSiteMode = Microsoft.AspNetCore.Http.SameSiteMode;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace IntexProject.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]

    public class MoviesController : ControllerBase
    {
        private MoviesDbContext _moviesDbContext;
        public MoviesController(MoviesDbContext temp)
        {
            _moviesDbContext = temp;
        }

        [HttpGet("GetMovies")]
        public IActionResult GetMovies(
            int pageSize = 10,
            int pageNum = 1,
            [FromQuery] string? genre = null,
            [FromQuery] string? title = null)
        {
            var query = _moviesDbContext.Movies.AsQueryable();

            // Filter by title (if provided)
            if (!string.IsNullOrWhiteSpace(title))
            {
                query = query.Where(m => m.Title.ToLower().Contains(title.ToLower()));
            }

            // Genre logic (already in place)
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
                movies = movies,
                totalNumMovies = totalNumMovies
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


        [HttpDelete("DeleteMovie/{movieId}")]
        public IActionResult DeleteMovie(string movieId)
        {
                       
            var movie = _moviesDbContext.Movies.FirstOrDefault(m => m.MovieId == movieId);
            if (movie == null)
            {
                return NotFound();
            }
            else if (movie.MovieId != movieId)
            {
                return BadRequest("Movie ID mismatch.");
            }
            else if (int.Parse(movie.MovieId) < 0)
            {
                return BadRequest("Invalid Movie ID.");
            }
            else if (string.IsNullOrEmpty(movie.MovieId) || movie.MovieId.StartsWith("s"))
            {
                return BadRequest("Invalid Movie ID format. Must be 's####'.");
            }
            else if (string.IsNullOrEmpty(movie.Title))
            {
                return BadRequest("Title is a required field.");
            }

            _moviesDbContext.Movies.Remove(movie);
            _moviesDbContext.SaveChanges();

            return NoContent();
        }


        [HttpPost("AddMovie")]
        public IActionResult AddMovie([FromBody] Movie newMovie)
        {
            if (newMovie == null)
            {
                return BadRequest("Invalid movie data.");
            }
            else if (newMovie.MovieId != null && int.Parse(newMovie.MovieId) < 0)
            {
                return BadRequest("Invalid Movie ID.");
            }
            else if (string.IsNullOrEmpty(newMovie.MovieId) || newMovie.MovieId.StartsWith("s"))
            {
                return BadRequest("Invalid Movie ID format. Must be 's####'.");
            }
            else if (string.IsNullOrEmpty(newMovie.Title) || string.IsNullOrEmpty(newMovie.Director) || string.IsNullOrEmpty(newMovie.Country))
            {
                return BadRequest("Title is a required field.");
            }

            // Auto-generate the next available movieId in "s####" format
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

            _moviesDbContext.Movies.Add(newMovie);
            _moviesDbContext.SaveChanges();

            return CreatedAtAction(nameof(GetMovies), new { id = newMovie.MovieId }, newMovie);
        }

        [HttpPut("UpdateMovie/{movieId}")]
        public IActionResult UpdateMovie(string movieId, [FromBody] Movie updatedMovie)
        {
            if (updatedMovie == null || movieId != updatedMovie.MovieId)
            {
                return BadRequest("Invalid movie data.");
            }
            else if (string.IsNullOrEmpty(updatedMovie.MovieId) || updatedMovie.MovieId.StartsWith("s"))
            {
                return BadRequest("Invalid Movie ID format. Must be 's####'.");
            }
            else if (string.IsNullOrEmpty(updatedMovie.Title))
            {
                return BadRequest("Title is a required field.");
            }
            else if (int.Parse(updatedMovie.MovieId) < 0)
            {
                return BadRequest("Invalid Movie ID.");
            }

            var existingMovie = _moviesDbContext.Movies.FirstOrDefault(m => m.MovieId == movieId);
            if (existingMovie == null)
            {
                return NotFound();
            }

            // Update only the fields that are editable
            existingMovie.Title = updatedMovie.Title;
            existingMovie.Director = updatedMovie.Director;
            existingMovie.Cast = updatedMovie.Cast;
            existingMovie.Country = updatedMovie.Country;
            existingMovie.release_year = updatedMovie.release_year;
            existingMovie.Rating = updatedMovie.Rating;
            existingMovie.Duration = updatedMovie.Duration;
            existingMovie.Description = updatedMovie.Description;
            // Add genre fields here as needed

            _moviesDbContext.SaveChanges();

            return Ok(existingMovie);
        }



        [HttpGet("{id}")]
        public async Task<IActionResult> GetMovieById(string id)
        {
            var movie = await _moviesDbContext.Movies.FirstOrDefaultAsync(m => m.MovieId == id);
            if (movie == null)
            {
                return NotFound();
            }
            else if (id != movie.MovieId || int.Parse(movie.MovieId) < 0)
            {
                return BadRequest("Invalid Movie ID.");
            }
            else if (string.IsNullOrEmpty(movie.MovieId) || movie.MovieId.StartsWith("s"))
            {
                return BadRequest("Invalid Movie ID format. Must be 's####'.");
            }
            else if (string.IsNullOrEmpty(movie.Title))
            {
                return BadRequest("Title is a required field.");
            }

            return Ok(movie);
        }

        [HttpPost("ratings")]
public async Task<IActionResult> SubmitRating([FromBody] RatingDto dto)
{
    Console.WriteLine("[POST /Movies/ratings]");
    Console.WriteLine($"Email: {dto.UserEmail}");
    Console.WriteLine($"ShowId: {dto.ShowId}");
    Console.WriteLine($"Rating: {dto.Rating}");

    if (string.IsNullOrWhiteSpace(dto.UserEmail))
    {
        Console.WriteLine("❌ Missing email.");
        return BadRequest("Missing email.");
    }

    var normalizedEmail = dto.UserEmail.Trim().ToLower();

    var user = await _moviesDbContext.MoviesUsers
        .FirstOrDefaultAsync(u => u.email.ToLower() == normalizedEmail);

    if (user == null)
    {
        Console.WriteLine("❌ User not found in movies_users.");
        return BadRequest("User not found.");
    }

    Console.WriteLine($"✅ Found user: {user.name} (ID: {user.userId})");

    var rating = new MovieRating
    {
        UserId = user.userId,
        ShowId = dto.ShowId,
        Rating = dto.Rating
    };

    _moviesDbContext.MoviesRatings.Add(rating);
    await _moviesDbContext.SaveChangesAsync();

    Console.WriteLine("✅ Rating saved.");
    return Ok();
}

        public class RatingDto
        {
            public string ShowId { get; set; }
            public int Rating { get; set; }
            public string UserEmail { get; set; }
        }



    }
}