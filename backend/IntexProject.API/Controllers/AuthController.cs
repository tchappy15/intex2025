using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using IntexProject.API.Data;
using IntexProject.DTOs;

namespace IntexProject.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly MoviesDbContext _moviesDb;

        public AuthController(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            MoviesDbContext moviesDb)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _moviesDb = moviesDb;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var user = new IdentityUser
            {
                UserName = request.email,
                Email = request.email
            };

            var result = await _userManager.CreateAsync(user, request.password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Save to movies_users table
            var movieUser = new MoviesUser
            {
                userId = user.Id,
                name = $"{request.firstName} {request.lastName}",
                phone = request.phone,
                phoneExtension = request.phoneExtension,
                email = request.email,
                age = request.age,
                gender = request.gender,
                city = request.city,
                state = request.state,
                zip = request.zip,
                netflix = request.netflix ? 1 : 0,
                amazonPrime = request.amazonPrime ? 1 : 0,
                disney = request.disney ? 1 : 0,
                paramount = request.paramount ? 1 : 0,
                max = request.max ? 1 : 0,
                hulu = request.hulu ? 1 : 0,
                appleTV = request.appleTV ? 1 : 0,
                peacock = request.peacock ? 1 : 0
            };

            _moviesDb.MoviesUsers.Add(movieUser);
            await _moviesDb.SaveChangesAsync();

//log success
        Console.WriteLine($"✅ Registered new user: {request.email} and created movies_users row for {user.Id}");

// Sign the user in
            await _signInManager.SignInAsync(user, isPersistent: false);

            return Ok();
        }
    }
}
