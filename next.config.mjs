/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',            // static HTML for GitHub Pages
  images: { unoptimized: true }, // no image optimizer on Pages
  trailingSlash: true,
}

export default nextConfig
