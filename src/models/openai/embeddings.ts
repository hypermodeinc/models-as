// import { Box } from "as-container/assembly";
import { Model } from "../..";

// Reference: https://platform.openai.com/docs/api-reference/embeddings

export default class EmbeddingsModel extends Model<
  EmbeddingsInput,
  EmbeddingsOutput
> {
  createInput(text: string): EmbeddingsInput {
    const model = this.info.fullName;
    return <EmbeddingsInput>{ model, input: text };
  }
}


@json
class EmbeddingsInput {
  input!: string; // todo: support other types of input (arrays, etc.)
  model!: string;
  encodingFormat: EncodingFormat = EncodingFormat.Float;
  // dimensions: Box<i32> | null = null;
  user: string = "";
}


@json
class EmbeddingsOutput {
  object!: string;
  model!: string;
  usage!: Usage;
  data!: Embedding[];
}


@json
export class EncodingFormat {
  type: string = "float";

  static Float: EncodingFormat = { type: "float" };
  static Base64: EncodingFormat = { type: "base64" };
}


@json
class Embedding {
  object!: string;
  index!: i32;
  embedding!: f64[];
}


@json
class Usage {

  @alias("prompt_tokens")
  promptTokens!: i32;


  @alias("total_tokens")
  totalTokens!: i32;
}
