"use client";
import { useEffect } from "react";
import * as ort from "onnxruntime-web";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    ort.env.wasm.wasmPaths = {
      "ort-wasm.wasm": "/ort-wasm.wasm",
      "ort-wasm-simd.wasm": "/ort-wasm-simd.wasm",
      "ort-wasm-threaded.wasm": "/ort-wasm-threaded.wasm",
      "ort-wasm-simd-threaded.wasm": "public/ort-wasm-threaded.wasm",
    };
  }, []);

  return <Component {...pageProps} />;
}
