import { Model } from "../..";

// Reference: https://platform.openai.com/docs/api-reference/embeddings

export class EmbeddingsModel extends Model<EmbeddingsInput, EmbeddingsOutput> {
  createInput<T>(content: T): EmbeddingsInput {
    const model = this.info.fullName;

    switch (idof<T>()) {
      case idof<string>():
      case idof<string[]>():
      case idof<i64[]>():
      case idof<i32[]>():
      case idof<i16[]>():
      case idof<i8[]>():
      case idof<u64[]>():
      case idof<u32[]>():
      case idof<u16[]>():
      case idof<u8[]>():
      case idof<i64[][]>():
      case idof<i32[][]>():
      case idof<i16[][]>():
      case idof<i8[][]>():
      case idof<u64[][]>():
      case idof<u32[][]>():
      case idof<u16[][]>():
      case idof<u8[][]>():
        return <TypedEmbeddingsInput<T>>{ model, input: content };
    }

    throw new Error("Unsupported input content type.");
  }
}


@json
class EmbeddingsInput {
  model!: string;


  @omitif("this.encodingFormat.type == 'float'")
  encodingFormat: EncodingFormat = EncodingFormat.Float;


  @omitif("this.dimensions == -1")
  dimensions: i32 = -1; // TODO: make this an `i32 | null` when supported


  @omitnull()
  user: string | null = null;
}


@json
class TypedEmbeddingsInput<T> extends EmbeddingsInput {
  input!: T;
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
