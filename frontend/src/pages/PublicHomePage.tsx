import { Link } from 'react-router-dom';
import './PublicHomePage.css';
import MovieSlider from '../components/MovieSlider';
import FAQSection from '../components/FAQSection';

const trendingMovies = [
  { title: 'Dark Knight', imageUrl: '/images/TrendingMoviesImages/First Kiss.jpg' },
  { title: 'Phone Swap', imageUrl: '/images/TrendingMoviesImages/Phone Swap.jpg' },
  { title: '6 Years', imageUrl: '/images/TrendingMoviesImages/6 Years.jpg' },
  { title: 'Transfers', imageUrl: '/images/TrendingMoviesImages/Transfers.jpg' },
  { title: 'The Minions of Midas', imageUrl: '/images/TrendingMoviesImages/The Minions of Midas.jpg' },
  { title: 'Nadiya Bakes', imageUrl: '/images/TrendingMoviesImages/Nadiya Bakes.jpg' },
  { title: 'Last', imageUrl: '/images/TrendingMoviesImages/Last.jpg' },
  { title: 'A Love So Beautiful', imageUrl: '/images/TrendingMoviesImages/A Love So Beautiful.jpg' },
  { title: '21 Thunder', imageUrl: '/images/TrendingMoviesImages/21 Thunder.jpg' },
  { title: 'Love Storm', imageUrl: '/images/TrendingMoviesImages/Love Storm.jpg' },
  { title: 'Bloodline', imageUrl: '/images/TrendingMoviesImages/Bloodline.jpg' },
  { title: 'The Platform', imageUrl: '/images/TrendingMoviesImages/The Platform.jpg' },
  { title: 'Star-Crossed', imageUrl: '/images/TrendingMoviesImages/StarCrossed.jpg' },
  { title: 'House of Cards', imageUrl: '/images/TrendingMoviesImages/House of Cards.jpg' },
  { title: 'Bitten', imageUrl: '/images/TrendingMoviesImages/Bitten.jpg' },
];

const newMovies = [
  { title: 'Bad Genius', imageUrl: '/images/NewMoviesImages/Bad Genius.jpg' },
  { title: 'Black Fish', imageUrl: '/images/NewMoviesImages/Blackfish.jpg' },
  { title: 'Forever Pure', imageUrl: '/images/NewMoviesImages/Forever Pure.jpg' },
  { title: 'Get Smart', imageUrl: '/images/NewMoviesImages/Get Smart.jpg' },
  { title: 'Haven', imageUrl: '/images/NewMoviesImages/Haven.jpg' },
  { title: 'Jailbirds New Orleans', imageUrl: '/images/NewMoviesImages/Jailbirds New Orleans.jpg' },
  { title: 'Kevin James Sweat the Small Stuff', imageUrl: '/images/NewMoviesImages/Kevin James Sweat the Small Stuff.jpg' },
  { title: 'Legal Hash', imageUrl: '/images/NewMoviesImages/Legal Hash.jpg' },
  { title: 'Man of Tai Chi', imageUrl: '/images/NewMoviesImages/Man of Tai Chi.jpg' },
  { title: 'Million Dollar Baby', imageUrl: '/images/NewMoviesImages/Million Dollar Baby.jpg' },
  { title: 'Pizza birra faso', imageUrl: '/images/NewMoviesImages/Pizza birra faso.jpg' },
  { title: 'Point Blank', imageUrl: '/images/NewMoviesImages/Point Blank.jpg' },
  { title: 'Riot', imageUrl: '/images/NewMoviesImages/Riot.jpg' },
  { title: 'Secret in Their Eyes', imageUrl: '/images/NewMoviesImages/Secret in Their Eyes.jpg' },
  { title: 'Stateless', imageUrl: '/images/NewMoviesImages/Stateless.jpg' }, 
]

export default function HomePage() {
  return (
    <div className="body">
      <div className="hero-header">
        <img src="/images/Logo.png" className="login-logo" />
        <h1>Niche Films, Curated Just For You!</h1>
        <br/>
        <Link to="/login"><button className="custom-btn">Sign In / Sign Up</button></Link>
      </div>

      {/* Movie slider section */}
      <MovieSlider title="Trending Now" movies={trendingMovies} />
      <MovieSlider title="Coming Soon" movies={newMovies} />
      <FAQSection />
    </div>
  );
}
