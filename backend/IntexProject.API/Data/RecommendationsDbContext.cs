using Microsoft.EntityFrameworkCore;

namespace IntexProject.API.Data
{
    public class RecommendationsDbContext : DbContext
    {
        public RecommendationsDbContext(DbContextOptions<RecommendationsDbContext> options)
            : base(options)
        {
        }

        public DbSet<UserRecommendations> UserRecommendations { get; set; }
        public DbSet<ContentRecommendation> ContentRecommendations { get; set; }
        public DbSet<CollaborativeMovieRecommendation> CollaborativeMovieRecommendations { get; set; }
        public DbSet<GenreRecommendations> GenreRecommendations { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Define composite key for ContentRecommendation
            modelBuilder.Entity<ContentRecommendation>()
                .HasKey(cr => new { cr.MovieId, cr.RecommendedId });


            base.OnModelCreating(modelBuilder);
        }
    }
}
