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
        public IActionResult GetMovies(int pageSize = 10, int pageNum = 1, [FromQuery] string? genre = null)
        {
            var query = _moviesDbContext.Movies.AsQueryable();

            // Build a map of [DisplayName -> PropertyName]
            var genreMap = typeof(Movie)
                .GetProperties()
                .Where(p => p.PropertyType == typeof(bool))
                .Select(p => new
                {
                    PropertyName = p.Name,
                    DisplayName = p.GetCustomAttributes(typeof(DisplayAttribute), false)
                                .Cast<DisplayAttribute>()
                                .FirstOrDefault()?.Name ?? p.Name
                })
                .ToDictionary(x => x.DisplayName, x => x.PropertyName);

            // Filter by selected genre (if provided and valid)
            if (!string.IsNullOrEmpty(genre) && genreMap.TryGetValue(genre, out var propertyName))
            {
                // Dynamically build the expression: movie => EF.Property<bool>(movie, propertyName) == true
                query = query.Where(movie =>
                    EF.Property<bool>(movie, propertyName) == true);
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
                .Where(p => p.PropertyType == typeof(bool))
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
            existingMovie.Release_Year = updatedMovie.Release_Year;
            existingMovie.Rating = updatedMovie.Rating;
            existingMovie.Duration = updatedMovie.Duration;
            existingMovie.Description = updatedMovie.Description;
            // Add genre fields here as needed

            _moviesDbContext.SaveChanges();

            return Ok(existingMovie);
        }

    }
}
