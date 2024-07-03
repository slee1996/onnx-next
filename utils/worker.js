import * as ort from "onnxruntime-web";
import { BertTokenizer } from "@xenova/transformers";

function max(arr) {
  if (arr.length === 0) throw Error("Array must not be empty");
  let max = arr[0];
  let indexOfMax = 0;
  for (let i = 1; i < arr.length; ++i) {
    if (arr[i] > max) {
      max = arr[i];
      indexOfMax = i;
    }
  }
  return [Number(max), indexOfMax];
}

function softmax(arr) {
  // Compute the maximum value in the array
  const maxVal = max(arr)[0];
  // Compute the exponentials of the array values
  const exps = arr.map((x) => Math.exp(x - maxVal));
  // Compute the sum of the exponentials
  const sumExps = exps.reduce((acc, val) => acc + val, 0);
  // Compute the softmax values
  const softmaxArr = exps.map((x) => x / sumExps);
  return softmaxArr;
}

self.onmessage = async (event) => {
  const inputString = event.data;
  try {
    const tokenizer = await BertTokenizer.from_pretrained(
      "Xenova/bert-base-uncased"
    );
    const encodedInput = await tokenizer(inputString, {
      return_tensors: "ort",
    });

    const session = await ort.InferenceSession.create("model.onnx");
    const feeds = {
      input_ids: new ort.Tensor(
        "int64",
        encodedInput.input_ids.data,
        encodedInput.input_ids.dims
      ),
      attention_mask: new ort.Tensor(
        "int64",
        encodedInput.attention_mask.data,
        encodedInput.input_ids.dims
      ),
    };

    if (encodedInput.token_type_ids) {
      feeds.token_type_ids = new ort.Tensor(
        "int64",
        encodedInput.token_type_ids.data,
        encodedInput.token_type_ids.dims
      );
    }

    const output = await session.run(feeds);
    const logits = output.logits.data;

    const maskTokenIndex = encodedInput.input_ids.data.indexOf(
      BigInt(tokenizer.mask_token_id)
    );

    if (maskTokenIndex === -1) {
      throw new Error("Mask token not found in input_ids");
    }

    const maskTokenLogits = logits.slice(
      (maskTokenIndex * logits.length) / encodedInput.input_ids.dims[1],
      ((maskTokenIndex + 1) * logits.length) / encodedInput.input_ids.dims[1]
    );

    if (maskTokenLogits.length === 0) {
      throw new Error("Mask token logits array is empty");
    }

    const probabilities = softmax(maskTokenLogits);

    const [maxProb, topPredictionIndex] = max(probabilities);
    console.log(maxProb, topPredictionIndex);

    const topPrediction = await tokenizer.decode([topPredictionIndex]);

    self.postMessage({ topPrediction });
  } catch (error) {
    console.error("ONNX inference error:", error);
    self.postMessage({ error: error.message });
  }
};
