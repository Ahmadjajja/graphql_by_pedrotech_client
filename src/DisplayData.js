import React, { useState } from 'react'
import { useQuery,useLazyQuery, gql } from '@apollo/client'

const QUERY_ALL_USERS = gql`
    query GetAllUsers {
        users{
            id
            name
            age
            username
            nationality
        }
    }
`;

const QUERY_ALL_MOVIES = gql`
    query GetAllMovies {
        movies{
            id
            name
            yearOfPublication
        }
    }
`;

const GET_MOVIE_BY_NAME = gql`
    query Movie($name: string!){
        movie(name: $name){
            name
            yearOfPublication
        }
    }
`

function DisplayData() {
    const [movieSearched, setMovieSearched] = useState("");
    

    const { data, loading, error } = useQuery(QUERY_ALL_USERS);
    const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
    const [ 
        fetchMovie,
        { data: movieSearchedData, error: movieError }
    ] = useLazyQuery(GET_MOVIE_BY_NAME)
    // console.log(movieSearched);
    if (loading) {
        return <h1>DATA IS LOADING...</h1>
    }
    if (data) {
        console.log("data", data.users);
    }
    if(error) {
        console.error(error);
    }
  return (
    <div>
      {
        data && data.users.map((user) => {
            return (
                <div>
                    <h1>Name: {user.name}</h1>
                    <h1>UserName: {user.username}</h1>
                    <h1>Age: {user.age}</h1>
                    <h1>Nationality: {user.nationality}</h1>
                    <hr/>
                </div>
            )
        })
      } 
        <h1>=================================</h1>
      {
        movieData && movieData.movies.map((movie) => {
            return (
                <div>
                    <h1>Name: {movie.name}</h1>
                    <h1>Year Of Publication: {movie.yearOfPublication}</h1>
                    <hr/>
                </div>
            )
        })
      }

      <div>
        <input type="text" placeholder='Interstellar' onChange={(event) => setMovieSearched(event.target)}/>
        <button onClick={() => {
            fetchMovie({
                variables: {
                    name: movieSearched,
                }
            })
        }}>Fetch Data</button>
        <div>
        {
            movieSearchedData && (
                <div>
                    {" "}
                    <h1>MovieName: {movieSearchedData.movie.name}</h1>
                    {" "}
                    <h1>Year Of Publication: {movieSearchedData.movie.yearOfPublication}</h1>
                </div>
            )
        }    
        </div>
      </div>
    </div>
  )
}

export default DisplayData
