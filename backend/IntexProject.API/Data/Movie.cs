using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace IntexProject.API.Data;


[Table("movies_titles")]
public class Movie
{
    [Key]
    public string? MovieId { get; set; } = null!;
    public required string Type { get; set; }
    public required string Title { get; set; }
    public string? Director { get; set; }
    public string? Cast { get; set; }
    public string? Country { get; set; }

    [JsonPropertyName("release_year")]
    public int release_year { get; set; }
    public required string Rating { get; set; }
    public required string Duration { get; set; }
    public required string Description { get; set; }


//genres:

    [Column("Action")]
    [Display(Name = "Action")]
    public int Action { get; set; }

    [Column("Adventure")]
    [Display(Name = "Adventure")]
    public int Adventure { get; set; }

    [Column("Anime Series International TV Shows")]
    [Display(Name = "Anime Series / International TV Shows")]
    public int AnimeSeriesInternationalTVShows { get; set; }

    [Column("British TV Shows Docuseries International TV Shows")]
    [Display(Name = "British TV / Docuseries / International")]
    public int BritishTVShowsDocuseriesInternationalTVShows { get; set; }

    [Column("Children")]
    [Display(Name = "Children")]
    public int Children { get; set; }

    [Column("Comedies")]
    [Display(Name = "Comedies")]
    public int Comedies { get; set; }

    [Column("Comedies Dramas International Movies")]
    [Display(Name = "Comedies / Dramas / International Movies")]
    public int ComediesDramasInternationalMovies { get; set; }

    [Column("Comedies International Movies")]
    [Display(Name = "Comedies / International Movies")]
    public int ComediesInternationalMovies { get; set; }

    [Column("Comedies Romantic Movies")]
    [Display(Name = "Comedies / Romantic Movies")]
    public int ComediesRomanticMovies { get; set; }

    [Column("Crime TV Shows Docuseries")]
    [Display(Name = "Crime TV Shows / Docuseries")]
    public int CrimeTVShowsDocuseries { get; set; }

    [Column("Documentaries")]
    [Display(Name = "Documentaries")]
    public int Documentaries { get; set; }

    [Column("Documentaries International Movies")]
    [Display(Name = "Documentaries / International Movies")]
    public int DocumentariesInternationalMovies { get; set; }

    [Column("Docuseries")]
    [Display(Name = "Docuseries")]
    public int Docuseries { get; set; }

    [Column("Dramas")]
    [Display(Name = "Dramas")]
    public int Dramas { get; set; }

    [Column("Dramas International Movies")]
    [Display(Name = "Dramas / International Movies")]
    public int DramasInternationalMovies { get; set; }

    [Column("Dramas Romantic Movies")]
    [Display(Name = "Dramas / Romantic Movies")]
    public int DramasRomanticMovies { get; set; }

    [Column("Family Movies")]
    [Display(Name = "Family Movies")]
    public int FamilyMovies { get; set; }

    [Column("Fantasy")]
    [Display(Name = "Fantasy")]
    public int Fantasy { get; set; }

    [Column("Horror Movies")]
    [Display(Name = "Horror Movies")]
    public int HorrorMovies { get; set; }

    [Column("International Movies Thrillers")]
    [Display(Name = "International Movies / Thrillers")]
    public int InternationalMoviesThrillers { get; set; }

    [Column("International TV Shows Romantic TV Shows TV Dramas")]
    [Display(Name = "International TV / Romantic TV / TV Dramas")]
    public int InternationalTVShowsRomanticTVShowsTVDramas { get; set; }

    [Column("Kids' TV")]
    [Display(Name = "Kids' TV")]
    public int KidsTV { get; set; }

    [Column("Language TV Shows")]
    [Display(Name = "Language TV Shows")]
    public int LanguageTVShows { get; set; }

    [Column("Musicals")]
    [Display(Name = "Musicals")]
    public int Musicals { get; set; }

    [Column("Nature TV")]
    [Display(Name = "Nature TV")]
    public int NatureTV { get; set; }

    [Column("Reality TV")]
    [Display(Name = "Reality TV")]
    public int RealityTV { get; set; }

    [Column("Spirituality")]
    [Display(Name = "Spirituality")]
    public int Spirituality { get; set; }

    [Column("TV Action")]
    [Display(Name = "TV Action")]
    public int TVAction { get; set; }

    [Column("TV Comedies")]
    [Display(Name = "TV Comedies")]
    public int TVComedies { get; set; }

    [Column("TV Dramas")]
    [Display(Name = "TV Dramas")]
    public int TVDramas { get; set; }

    [Column("Talk Shows TV Comedies")]
    [Display(Name = "Talk Shows / TV Comedies")]
    public int TalkShowsTVComedies { get; set; }

    [Column("Thrillers")]
    [Display(Name = "Thrillers")]
    public int Thrillers { get; set; }


}
