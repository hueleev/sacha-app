/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    domains: ["k.kakaocdn.net", "image.tmdb.org", "shopping-phinf.pstatic.net"],
  },
  async redirects() {
    return [
      {
        source: "/storybook",
        destination: "/storybook/index.html",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
