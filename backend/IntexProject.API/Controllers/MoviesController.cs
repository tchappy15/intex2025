using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using IntexProject.API.Data;
using SameSiteMode = Microsoft.AspNetCore.Http.SameSiteMode;
using System.ComponentModel.DataAnnotations;
using Microsoft.Data.SqlClient;
using Microsoft.Data.Sqlite;

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
        public MoviesController(MoviesDbContext temp, IConfiguration configuration)
        {
            _moviesDbContext = temp;
            _configuration = configuration;
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

        [HttpGet("with-recommendations")]
        public async Task<IActionResult> GetMoviesWithRecommendations()
        {
            var recommendedMovieIds = new HashSet<string>();
            var recommendedTitles = new HashSet<string>();

            // Connect to SQLite recommendations DB
            using (var recConn = new SqliteConnection(_configuration.GetConnectionString("RecommendationsConnection")))
            {
                await recConn.OpenAsync();

                var cmd = recConn.CreateCommand();
                cmd.CommandText = @"
                    SELECT movie_id FROM ContentRecommendations
                    UNION
                    SELECT movie_title FROM CollaborativeMovieRecommendations
                ";

                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    var val = reader.GetString(0);
                    if (val.StartsWith("s")) recommendedMovieIds.Add(val);
                    else recommendedTitles.Add(val);
                }
            }

            // Connect to Azure Movies DB
            using (var sqlConn = new SqlConnection(_configuration.GetConnectionString("MoviesConnection")))
            {
                await sqlConn.OpenAsync();

                var idParams = recommendedMovieIds.Select((id, i) => $"@id{i}").ToArray();
                var titleParams = recommendedTitles.Select((t, i) => $"@title{i}").ToArray();

                var sql = $@"
                    SELECT * FROM Movies
                    WHERE show_id IN ({string.Join(",", idParams)})
                    OR title IN ({string.Join(",", titleParams)})
                ";

                var cmd = new SqlCommand(sql, sqlConn);

                for (int i = 0; i < recommendedMovieIds.Count; i++)
                    cmd.Parameters.AddWithValue(idParams[i], recommendedMovieIds.ElementAt(i));

                for (int i = 0; i < recommendedTitles.Count; i++)
                    cmd.Parameters.AddWithValue(titleParams[i], recommendedTitles.ElementAt(i));

                var result = new List<Movie>();

                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    result.Add(new Movie
                    {
                        MovieId = reader["show_id"]?.ToString() ?? "", // if you're okay with empty fallback
                        Title = reader["title"]?.ToString() ?? "Untitled",
                        Type = reader["type"]?.ToString() ?? "Unknown",
                        Rating = reader["rating"]?.ToString() ?? "Unrated",
                        Duration = reader["duration"]?.ToString() ?? "N/A",
                        Description = reader["description"]?.ToString() ?? "No description available"
                    });
                }
                return Ok(result);
            }
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
            return Ok(movie);
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
            public string movieId { get; set; }
            public int Rating { get; set; }
        }


    }
}