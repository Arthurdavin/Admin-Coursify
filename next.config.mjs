// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//   },
// }

// export default nextConfig


// next.config.mjs
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API || 'https://api-coursify.onrender.com'}/api/:path*`,
      },
    ]
  },
}

export default nextConfig // ✅ not module.exports