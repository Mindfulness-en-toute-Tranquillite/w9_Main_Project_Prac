import React, { useState, useEffect } from 'react'
import Head from "next/head";
import Seo from '@components/Seo';

const API_KEY = "d6a4bc48f364c0414fdafb71f660b184";

export default function Home() {
  const [movies, setMovies] = useState();
  useEffect(() => {
    (async () => {
      const { results } = await (
        await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
        )
      ).json();
      setMovies(results);
    })();
  }, [])
  return (
    <div>
      <Seo title="Home"/>
      {!movies && <h4>Loading...</h4>}
      {movies?.map((movie) => (
        <div key= {movie.id}>
          <h4>{movie.original_title}</h4>
        </div>
      ))}
    </div>
  )
}