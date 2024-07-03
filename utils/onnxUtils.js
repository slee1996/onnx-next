export function runOnnxInference(input) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./worker.js", import.meta.url));

    worker.onmessage = (event) => {
      if (event.data.error) {
        console.error("Error in worker:", event.data.error);
        reject(new Error(event.data.error));
      } else {
        resolve(event.data.topPrediction);
      }
      worker.terminate();
    };

    worker.onerror = (error) => {
      reject(new Error(`Worker error: ${error.message}`));
      worker.terminate();
    };

    worker.postMessage(input);
  });
}
