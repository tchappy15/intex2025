using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace IntexProject.API.Data;


[Table("movies_titles")]
public class Movie
{
    [Key]
    public required string MovieId { get; set; }

    public required string Type { get; set; }
    public required string Title { get; set; }
    public string? Director { get; set; }
    public string? Cast { get; set; }
    public string? Country { get; set; }
    public int Release_Year { get; set; }
    public string? Rating { get; set; }
    public required string Duration { get; set; }
    public required string Description { get; set; }


//genres:

    [Column("Action")]
    [Display(Name = "Action")]
    public bool Action { get; set; }

    [Column("Adventure")]
    [Display(Name = "Adventure")]
    public bool Adventure { get; set; }

    [Column("Anime Series International TV Shows")]
    [Display(Name = "Anime Series / International TV Shows")]
    public bool AnimeSeriesInternationalTVShows { get; set; }

    [Column("British TV Shows Docuseries International TV Shows")]
    [Display(Name = "British TV / Docuseries / International")]
    public bool BritishTVShowsDocuseriesInternationalTVShows { get; set; }

    [Column("Children")]
    [Display(Name = "Children")]
    public bool Children { get; set; }

    [Column("Comedies")]
    [Display(Name = "Comedies")]
    public bool Comedies { get; set; }

    [Column("Comedies Dramas International Movies")]
    [Display(Name = "Comedies / Dramas / International Movies")]
    public bool ComediesDramasInternationalMovies { get; set; }

    [Column("Comedies International Movies")]
    [Display(Name = "Comedies / International Movies")]
    public bool ComediesInternationalMovies { get; set; }

    [Column("Comedies Romantic Movies")]
    [Display(Name = "Comedies / Romantic Movies")]
    public bool ComediesRomanticMovies { get; set; }

    [Column("Crime TV Shows Docuseries")]
    [Display(Name = "Crime TV Shows / Docuseries")]
    public bool CrimeTVShowsDocuseries { get; set; }

    [Column("Documentaries")]
    [Display(Name = "Documentaries")]
    public bool Documentaries { get; set; }

    [Column("Documentaries International Movies")]
    [Display(Name = "Documentaries / International Movies")]
    public bool DocumentariesInternationalMovies { get; set; }

    [Column("Docuseries")]
    [Display(Name = "Docuseries")]
    public bool Docuseries { get; set; }

    [Column("Dramas")]
    [Display(Name = "Dramas")]
    public bool Dramas { get; set; }

    [Column("Dramas International Movies")]
    [Display(Name = "Dramas / International Movies")]
    public bool DramasInternationalMovies { get; set; }

    [Column("Dramas Romantic Movies")]
    [Display(Name = "Dramas / Romantic Movies")]
    public bool DramasRomanticMovies { get; set; }

    [Column("Family Movies")]
    [Display(Name = "Family Movies")]
    public bool FamilyMovies { get; set; }

    [Column("Fantasy")]
    [Display(Name = "Fantasy")]
    public bool Fantasy { get; set; }

    [Column("Horror Movies")]
    [Display(Name = "Horror Movies")]
    public bool HorrorMovies { get; set; }

    [Column("International Movies Thrillers")]
    [Display(Name = "International Movies / Thrillers")]
    public bool InternationalMoviesThrillers { get; set; }

    [Column("International TV Shows Romantic TV Shows TV Dramas")]
    [Display(Name = "International TV / Romantic TV / TV Dramas")]
    public bool InternationalTVShowsRomanticTVShowsTVDramas { get; set; }

    [Column("Kids' TV")]
    [Display(Name = "Kids' TV")]
    public bool KidsTV { get; set; }

    [Column("Language TV Shows")]
    [Display(Name = "Language TV Shows")]
    public bool LanguageTVShows { get; set; }

    [Column("Musicals")]
    [Display(Name = "Musicals")]
    public bool Musicals { get; set; }

    [Column("Nature TV")]
    [Display(Name = "Nature TV")]
    public bool NatureTV { get; set; }

    [Column("Reality TV")]
    [Display(Name = "Reality TV")]
    public bool RealityTV { get; set; }

    [Column("Spirituality")]
    [Display(Name = "Spirituality")]
    public bool Spirituality { get; set; }

    [Column("TV Action")]
    [Display(Name = "TV Action")]
    public bool TVAction { get; set; }

    [Column("TV Comedies")]
    [Display(Name = "TV Comedies")]
    public bool TVComedies { get; set; }

    [Column("TV Dramas")]
    [Display(Name = "TV Dramas")]
    public bool TVDramas { get; set; }

    [Column("Talk Shows TV Comedies")]
    [Display(Name = "Talk Shows / TV Comedies")]
    public bool TalkShowsTVComedies { get; set; }

    [Column("Thrillers")]
    [Display(Name = "Thrillers")]
    public bool Thrillers { get; set; }


}
