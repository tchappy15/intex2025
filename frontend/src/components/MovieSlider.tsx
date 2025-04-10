import { useRef } from 'react';
import './MovieSlider.css';

interface MovieSliderProps {
  title: string;
  movies: { title: string; imageUrl: string }[];
}

export default function MovieSlider({ title, movies }: MovieSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startScrolling = (dir: 'left' | 'right') => {
    const scrollAmount = dir === 'left' ? -5 : 5;

    scrollIntervalRef.current = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: scrollAmount });
      }
    }, 10);
  };

  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  const clickScroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="slider-container">
      <h2 className="slider-title">{title}</h2>

      <div className="slider-outer">
        <div className="slider-fade-wrapper">
          
        <button
          className="slider-btn left"
          onClick={() => clickScroll('left')}
          onMouseDown={() => startScrolling('left')}
          onMouseUp={stopScrolling}
          onMouseLeave={stopScrolling}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

          <div className="slider" ref={scrollRef}>
            {movies.map((movie, index) => (
              <div className="poster-wrapper" key={index}>
                <img
                  src={movie.imageUrl}
                  alt={movie.title}
                  className="slider-poster"
                />
                <span className="poster-title">{movie.title}</span>
              </div>
            ))}
          </div>

          <button
            className="slider-btn right"
            onClick={() => clickScroll('right')}
            onMouseDown={() => startScrolling('right')}
            onMouseUp={stopScrolling}
            onMouseLeave={stopScrolling}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>



          <div className="fade-left"></div>
          <div className="fade-right"></div>
        </div>
      </div>
    </div>
  );
}

