using Microsoft.EntityFrameworkCore;

namespace IntexProject.API.Data;

public class MoviesDbContext: DbContext
{
    public MoviesDbContext(DbContextOptions<MoviesDbContext> options) : base(options)
    {
        
    }
    public DbSet<MoviesUser> MoviesUsers { get; set; }
    public DbSet<Movie> Movies { get; set; }
    public DbSet<MovieRating> MoviesRatings { get; set; }

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<MovieRating>()
        .HasKey(r => new { r.UserId, r.MovieId }); //  composite key
}

}