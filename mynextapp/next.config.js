/** @type {import('next').NextConfig} */

// const API_KEY = "d-------";
const NEXT_PUBLIC_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const nextConfig = {
  reactStrictMode: true,
  async redirects(){
    return [
      {
        source: "/old-blog/:path*",
        destination: "/new-sexy-blog/:path*",
        permanent: false,
      }
    ]
  },
  async rewrites(){
    return [
      {
        source: "/api/movies",
        destination: `https://api.themoviedb.org/3/movie/popular?api_key=${NEXT_PUBLIC_API_KEY}`
      },
      {
        source: "/api/movies/:id",
        destination: `https://api.themoviedb.org/3/movie/:id?api_key=${NEXT_PUBLIC_API_KEY}`
      },
    ]
  }
};

module.exports = nextConfig
