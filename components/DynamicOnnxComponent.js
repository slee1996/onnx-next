"use client";
import { useState } from "react";
import { runOnnxInference } from "../utils/onnxUtils";

export default function OnnxComponent() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const output = await runOnnxInference(input);
      setResult(output);
    } catch (error) {
      console.error("Inference error:", error);
      setResult("Error occurred during inference");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Run Inference</button>
      </form>
      {result && (
        <div className="max-w-80">Result: {JSON.stringify(result)}</div>
      )}
    </div>
  );
}
