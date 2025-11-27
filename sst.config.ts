/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "baby-trading-cards",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    // S3 bucket for storing uploaded images and generated cards
    const imagesBucket = new sst.aws.Bucket("ImagesBucket", {
      public: true,
    });

    // DynamoDB table for storing sessions and orders
    const sessionsTable = new sst.aws.Dynamo("SessionsTable", {
      fields: {
        id: "string",
        email: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        emailIndex: { hashKey: "email" },
      },
    });

    const ordersTable = new sst.aws.Dynamo("OrdersTable", {
      fields: {
        id: "string",
        sessionId: "string",
        createdAt: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        sessionIndex: { hashKey: "sessionId" },
      },
    });

    // API for handling backend logic
    const api = new sst.aws.Function("Api", {
      handler: "packages/functions/src/api.handler",
      link: [imagesBucket, sessionsTable, ordersTable],
      environment: {
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
        GOOGLE_CLOUD_API_KEY: process.env.GOOGLE_CLOUD_API_KEY || "",
        FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
      },
      timeout: "900 seconds",
      memory: "2 GB",
    });

    // Next.js frontend
    const web = new sst.aws.Nextjs("Web", {
      link: [imagesBucket, sessionsTable, ordersTable, api],
      environment: {
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
        NEXT_PUBLIC_API_URL: api.url,
      },
    });

    return {
      web: web.url,
      api: api.url,
    };
  },
});
