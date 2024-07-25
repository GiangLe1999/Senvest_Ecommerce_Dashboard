/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/en/dashboard",
        permanent: false,
        locale: false,
      },
      {
        source: "/:lang(en|fr|ar)",
        destination: "/:lang/dashboard",
        permanent: false,
        locale: false,
      },
      {
        source: "/((?!(?:en|fr|ar|front-pages|favicon.ico)\\b)):path",
        destination: "/en/:path",
        permanent: false,
        locale: false,
      },
    ];
  },
};

export default nextConfig;
