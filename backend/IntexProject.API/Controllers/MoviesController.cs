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

    }
}
