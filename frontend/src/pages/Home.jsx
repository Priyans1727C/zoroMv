import { useState } from "react";
import { useTrendingMovies } from "../features/movies/hooks/useMovies";

const Data =() => {
    const { data: movies, isLoading, error } = useTrendingMovies();
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading movies</div>;

     return (
        <div>
            <p>this is trending movies</p>
            {movies.map(movie => <h3 key={movie.id}>{movie.id + ": :" + movie.title}</h3>)}

           
        </div>

    );
    
}

const Home = () => {
    const [ show, setShow ] = useState(false);
    
    function handleClick() {
        console.log("show value: ",show )
        setShow(show => !show);
    }
  
    return (
        <div>
            <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5"
                onClick={handleClick}
            >Default</button>

            {show &&<Data/>}
        </div>

    );
}

export default Home;