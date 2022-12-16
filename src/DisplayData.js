import React, { useState } from "react";
import { useQuery, useLazyQuery, gql, useMutation } from "@apollo/client";

const QUERY_ALL_USERS = gql`
  query GetAllUsers {
    users {
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
    movies {
      id
      name
      yearOfPublication
    }
  }
`;

const GET_MOVIE_BY_NAME = gql`
  query Movie($name: String!) {
    movie(name: $name) {
      name
      yearOfPublication
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUse( $input: CreateUserInput! ){
     createUser(input: $input) {
        name
        id
     }
  }
`

function DisplayData() {
  const [movieSearched, setMovieSearched] = useState("");

  //Create User states

  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [age, setAge] = useState(0);
  const [nationality, setNationality] = useState("");

  const { data, loading, error, refetch } = useQuery(QUERY_ALL_USERS);
  const { data: movieData } = useQuery(QUERY_ALL_MOVIES);

  const [fetchMovie, { data: movieSearchedData, error: movieError }] =
    useLazyQuery(GET_MOVIE_BY_NAME);

  const [createUser] = useMutation(CREATE_USER_MUTATION)

  console.log("movieSearched", movieSearched);
  console.log("movieData", movieData);
  console.log("movieSearchedData", movieSearchedData);
  console.log("movieError", movieError);

  if (loading) {
    return <h1>DATA IS LOADING...</h1>;
  }
  if (data) {
    console.log("data", data.users);
  }
  if (error) {
    console.error(error);
  }
  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Name..."
          onChange={(event) => setName(event.target.value)}
        />
        <input type="text" placeholder="Username..." onChange={(event) => setUserName(event.target.value)} />
        <input type="number" placeholder="Age..." onChange={(event) => setAge(event.target.value)} />
        <input type="text" placeholder="Nationality..." onChange={(event) => setNationality(event.target.value.toUpperCase())} />
        <button onClick={() => {
            createUser({
                variables: { input : {
                    name: name, username: userName, age: Number(age), nationality: nationality
                }},
            })
            refetch();
            setAge(0)
            setName("")
            setUserName("")
            setNationality("")

        }}> Create User </button>
      </div>
      {data &&
        data.users.map((user) => {
          return (
            <div>
              <h1>Name: {user.name}</h1>
              <h1>UserName: {user.username}</h1>
              <h1>Age: {user.age}</h1>
              <h1>Nationality: {user.nationality}</h1>
              <hr />
            </div>
          );
        })}
      <h1>=================================</h1>
      {movieData &&
        movieData.movies.map((movie) => {
          return (
            <div>
              <h1>Name: {movie.name}</h1>
              <h1>Year Of Publication: {movie.yearOfPublication}</h1>
              <hr />
            </div>
          );
        })}

      <div>
        <input
          type="text"
          placeholder="Interstellar"
          onChange={(event) => setMovieSearched(event.target.value)}
        />
        <button
          onClick={() => {
            fetchMovie({
              variables: {
                name: movieSearched,
              },
            });
          }}
        >
          Fetch Data
        </button>
        <div>
          {movieSearchedData && (
            <div>
              {" "}
              <h1>MovieName: {movieSearchedData.movie.name}</h1>{" "}
              <h1>
                Year Of Publication: {movieSearchedData.movie.yearOfPublication}
              </h1>
            </div>
          )}
          {movieError && <h1> There was an error fetching the data </h1>}
        </div>
      </div>
    </div>
  );
}

export default DisplayData;
