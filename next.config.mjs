/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Hostinger (uploads to public_html) — generates ./out
  output: 'export',
  // Directory-style URLs (/blog/index.html, /blog/<slug>/index.html) — required
  // so nested blog routes resolve cleanly on Hostinger static hosting.
  trailingSlash: true,
};

export default nextConfig;
