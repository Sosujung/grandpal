const CopyPlugin = require("copy-webpack-plugin")

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  webpack: (config, {}) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: "./node_modules/onnxruntime-web/dist/ort-wasm.wasm",
            to: process.env.NODE_ENV === "production" ?  "static/chunks" :  "static/chunks/app",
          },
          {
            from: "./node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm",
            to: process.env.NODE_ENV === "production" ?  "static/chunks" :  "static/chunks/app",
          },
        ],
      })
    )

    return config
  },
  async headers() {
    const headers = []
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
      headers.push({
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex",
          },
        ],
        source: "/:path*",
      })
    }
    return headers
  },
}

module.exports = nextConfig
