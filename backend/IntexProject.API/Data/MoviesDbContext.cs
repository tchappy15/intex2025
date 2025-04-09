using IntexProject.Models;
using Microsoft.EntityFrameworkCore;

namespace IntexProject.API.Data;

public class MoviesDbContext: DbContext
{
    public MoviesDbContext(DbContextOptions<MoviesDbContext> options) : base(options)
    {
        
    }
    public DbSet<MoviesUser> MoviesUsers { get; set; }
    public DbSet<Movie> Movies { get; set; }
}