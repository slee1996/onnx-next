"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const DynamicOnnxComponent = dynamic(() => import("./DynamicOnnxComponent"), {
  ssr: false,
});

export default function DistilBertComponent() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <DynamicOnnxComponent />;
}
