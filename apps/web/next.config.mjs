/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
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
