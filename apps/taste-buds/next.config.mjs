/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  eslint: {
    // 빌드 시 ESLint를 비활성화합니다.
    ignoreDuringBuilds: true,
    ignoreBuildErrors: true,
  },
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
