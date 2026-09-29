import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The browser may resolve the local dev server as either localhost or 127.0.0.1.
  // Allow both origins so Next.js HMR resources are not blocked in development.
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  async redirects() {
    return [
      {
        source: "/projects/:projectId/config",
        destination: "/projects/:projectId/configuration",
        permanent: false,
      },
      {
        source: "/projects/:projectId/requirements",
        destination: "/projects/:projectId/raw-requirements",
        permanent: false,
      },
      {
        source: "/projects/:projectId/business-stories",
        destination: "/projects/:projectId/business-requirements",
        permanent: false,
      },
      {
        source: "/projects/:projectId/frontend-pages",
        destination: "/projects/:projectId/frontend-implementation",
        permanent: false,
      },
      {
        source: "/projects/:projectId/frontend-tools",
        destination: "/projects/:projectId/frontend-implementation",
        permanent: false,
      },
      {
        source: "/projects/:projectId/backend-services",
        destination: "/projects/:projectId/backend-implementation",
        permanent: false,
      },
      {
        source: "/projects/:projectId/backend-tools",
        destination: "/projects/:projectId/backend-implementation",
        permanent: false,
      },
      {
        source: "/projects/:projectId/db-model",
        destination: "/projects/:projectId/database-model",
        permanent: false,
      },
      {
        source: "/projects/:projectId/prompts",
        destination: "/projects/:projectId/delivery",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
