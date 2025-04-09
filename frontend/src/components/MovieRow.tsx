import './MovieRow.css';

function MovieRow({ title}: { title: string}) {
  // Replace this with real filtering logic or props
  const placeholderMovies = Array.from({ length: 10 });

  return (
    <div className="movie-row">
      <h2 className="row-title">{title}</h2>
      <div className="movie-scroll">
        {placeholderMovies.map((_, index) => (
          <div className="movie-poster-card" key={index}>
            <img src="/images/After.jpg" alt="Placeholder" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieRow;
