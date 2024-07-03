import CopyWebpackPlugin from "copy-webpack-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Adjust the destination path as necessary
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            { from: "public/ort-wasm.wasm", to: "static/chunks/ort-wasm.wasm" },
            {
              from: "public/ort-wasm-simd.wasm",
              to: "static/chunks/ort-wasm-simd.wasm",
            },
            {
              from: "public/ort-wasm-threaded.wasm",
              to: "static/chunks/ort-wasm-threaded.wasm",
            },
            {
              from: "public/ort-wasm-simd-threaded.wasm",
              to: "static/chunks/ort-wasm-simd-threaded.wasm",
            },
            {
              from: "public/model.onnx",
              to: "static/chunks/model.onnx",
            },
            {
              from: "public/model_quantized.onnx",
              to: "static/chunks/model_quantized.onnx",
            },
          ],
        })
      );
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      "onnxruntime-node$": false,
    };
    return config;
  },
};

export default nextConfig;
