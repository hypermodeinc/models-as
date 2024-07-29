import { Model } from "../..";
import { JSON } from "json-as";

/**
 * Provides input and output types that conform to the Gemini Generate Content API.
 *
 * Reference: https://ai.google.dev/api/generate-content
 */
export class GeminiGenerateModel extends Model<
  GeminiGenerateInput,
  GeminiGenerateOutput
> {
  /**
   * Creates an input object for the Gemini Generate Content API.
   *
   * @param contents The content of the current conversation with the model.
   * @returns An input object that can be passed to the `invoke` method.
   */
  createInput(contents: Content[]): GeminiGenerateInput {
    // for Gemini, the model is part of the URL, not the request body
    return <GeminiGenerateInput>{ contents };
  }
}

/**
 * Content type for both prompts and response candidates.
 */
@json
export class Content {
  /**
   * Creates a new content object.
   *
   * @param role The role of the author of this content.
   * @param parts The multi-part content message.
   */
  constructor(role: string, parts: Part[]) {
    this._role = role;
    this.parts = parts;
  }


  @alias("role")
  protected _role: string;

  /**
   * The role of the author of this content.
   */
  get role(): string {
    return this._role;
  }

  /**
   * The multi-part content message.
   * For now it can only be a text, even though Gemini supports more complex types.
   */
  parts: Part[];
}


@json
abstract class Part {}


@json
export class TextPart extends Part {
  text!: string;
}

/**
 * A user content.
 */
@json
export class UserContent extends Content {
  /**
   * Creates a new user content object.
   *
   * @param parts The multi-part content message.
   */
  constructor(parts: Part[]) {
    super("user", parts);
  }
}

/**
 * A user text content.
 */
@json
export class UserTextContent extends UserContent {
  /**
   * Creates a new user text content object.
   *
   * @param content The contents of the message.
   */
  constructor(content: string) {
    super([{ text: content }]);
  }
}

/**
 * A model content.
 */
@json
export class ModelContent extends Content {
  /**
   * Creates a new model content object.
   *
   * @param parts The multi-part content message.
   */
  constructor(parts: Part[]) {
    super("model", parts);
  }
}

/**
 * A model text content.
 */
@json
export class ModelTextContent extends ModelContent {
  /**
   * Creates a new model text content object.
   *
   * @param content The contents of the message.
   */
  constructor(content: string) {
    super([{ text: content }]);
  }
}

/**
 * The input object for the Gemini Generate Content API.
 */
@json
class GeminiGenerateInput {
  /**
   * The content of the current conversation with the model.
   */
  contents!: Content[];

  /**
   * Developer set system instruction. Currently, text only.
   */
  @omitnull()
  systemInstruction: Content | null = null;

  /**
   * Configuration options for model generation and outputs.
   */
  @omitnull()
  generationConfig: GenerationConfig | null = null;

  /**
   * A list of unique SafetySetting instances for blocking unsafe content.
   */
  @omitnull()
  safetySettings: SafetySetting[] | null = null;

  /**
   * A list of tools the model may use to generate the next response.
   */
  @omitnull()
  tools: Tool[] | null = null;

  /**
   * Tool configuration for any Tool specified in the request.
   */
  @omitnull()
  toolConfig: ToolConfig | null = null;

  /**
   * The name of the cached content used as context to serve the prediction.
   */
  @omitnull()
  cachedContent: string | null = null;
}

/**
 * The Gemini config options.
 */
@json
class GenerationConfig {
  /**
   * Number of generated responses to return.
   * Currently, this value can only be set to 1.
   *
   * @default 1
   */
  @omitif("this.candidateCount === 1")
  candidateCount: i32 = 1;

  /**
   * The set of character sequences (up to 5) that will stop output generation.
   */
  @omitnull()
  stopSequences: string[] | null = null;

  /**
   * The maximum number of tokens to include in a candidate.
   */
  @omitnull()
  maxOutputTokens: i32 | null = null;

  /**
   * Controls the randomness of the output.
   *
   * Values can range from [0.0, 2.0].
   */
  @omitnull()
  temperature: f64 | null = null;

  /**
   * The maximum cumulative probability of tokens to consider when sampling.
   */
  @omitnull()
  topP: f64 | null = null;

  /**
   * The maximum number of tokens to consider when sampling.
   */
  @omitnull()
  topK: i32 | null = null;

  /**
   * Output response mimetype of the generated candidate text.
   * Supported mimetype:
   *   `text/plain`: (default) Text output.
   *   `application/json`: JSON response in the candidates.
   */
  @omitif("this.responseMimeType == 'text/plain'")
  responseMimeType: string = "text/plain";

  /**
   * Output response schema of the generated candidate text.
   * Note: This only applies when the specified `responseMIMEType` supports a schema; currently
   * this is limited to `application/json`.
   */
  @omitnull()
  responseSchema: JSON.Raw | null = null;
}

/**
 * Tool details that the model may use to generate response.
 */
@json
class Tool {
  /**
   * A list of FunctionDeclarations available to the model that can be used for function calling.
   */
  @omitnull()
  functionDeclarations: FunctionDeclarationsTool | null = null;


  @omitnull()
  codeExecution: CodeExecutionTool | null = null;
}


@json
class FunctionDeclarationsTool {
  /**
   * One or more function declarations to be passed
   * to the model along with the current user query.
   */
  @omitnull()
  functionDeclarations: FunctionDeclaration[] | null = null;
}

/**
 * Structured representation of a function declaration as defined by the
 * [OpenAPI 3.0 specification](https://spec.openapis.org/oas/v3.0.3).
 */
@json
class FunctionDeclaration {
  /**
   * The name of the function to call.
   */
  name!: string;

  /**
   * Description and purpose of the function.
   */
  @omitnull()
  description: string | null = null;

  /**
   * Describes the parameters to this function in JSON Schema Object
   * format.
   */
  @omitnull()
  parameters: JSON.Raw | null = null;
}

/**
 * Enables the model to execute code as part of generation.
 */
@json
class CodeExecutionTool {
  /**
   * Provide an empty object to enable code execution. This field may have
   * subfields added in the future.
   */
  codeExecution!: {};
}

/**
 * Tool config. This config is shared for all tools provided in the request.
 */
@json
class ToolConfig {
  functionCallingConfig!: FunctionCallingConfig;
}


@json
class FunctionCallingConfig {

  @omitnull()
  mode: FunctionCallingMode | null = null;


  @omitnull()
  allowedFunctionNames: string[] | null = null;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FunctionCallingMode {
  /**
   * Default model behavior, model decides to predict either a function call
   * or a natural language response.
   */
  export const AUTO = "AUTO";

  /**
   * Model is constrained to always predicting a function call only.
   * If "allowed_function_names" are set, the predicted function call will be
   * limited to any one of "allowed_function_names", else the predicted
   * function call will be any one of the provided "function_declarations".
   */
  export const ANY = "ANY";

  /**
   * Model will not predict any function call. Model behavior is same as when
   * not passing any function declarations.
   */
  export const NONE = "NONE";
}
export type FunctionCallingMode = string;

/**
 * Safety setting, affecting the safety-blocking behavior.
 */
@json
class SafetySetting {
  category!: HarmCategory;
  threshold!: HarmBlockThreshold;
}

/**
 * Harm categories that would cause prompts or candidates to be blocked.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace HarmCategory {
  export const UNSPECIFIED = "HARM_CATEGORY_UNSPECIFIED";
  export const HATE_SPEECH = "HARM_CATEGORY_HATE_SPEECH";
  export const SEXUALLY_EXPLICIT = "HARM_CATEGORY_SEXUALLY_EXPLICIT";
  export const HARASSMENT = "HARM_CATEGORY_HARASSMENT";
  export const DANGEROUS_CONTENT = "HARM_CATEGORY_DANGEROUS_CONTENT";
}
export type HarmCategory = string;

/**
 * Threshold above which a prompt or candidate will be blocked.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace HarmBlockThreshold {
  /**
   * Threshold is unspecified.
   */
  export const HARM_BLOCK_THRESHOLD_UNSPECIFIED =
    "HARM_BLOCK_THRESHOLD_UNSPECIFIED";

  /**
   * Content with NEGLIGIBLE will be allowed.
   */
  export const BLOCK_LOW_AND_ABOVE = "BLOCK_LOW_AND_ABOVE";

  /**
   * Content with NEGLIGIBLE and LOW will be allowed.
   */
  export const BLOCK_MEDIUM_AND_ABOVE = "BLOCK_MEDIUM_AND_ABOVE";

  /**
   * Content with NEGLIGIBLE, LOW, and MEDIUM will be allowed.
   */
  export const BLOCK_ONLY_HIGH = "BLOCK_ONLY_HIGH";

  /**
   * All content will be allowed.
   */
  export const BLOCK_NONE = "BLOCK_NONE";
}
export type HarmBlockThreshold = string;

/**
 * The output object for the Gemini Generate Content API.
 */
@json
class GeminiGenerateOutput {
  /**
   * Candidate responses from the model.
   */
  candidates!: Candidate[];

  /**
   * Returns the prompt's feedback related to the content filters.
   */
  @omitnull()
  promptFeedback: PromptFeedback | null = null;

  /**
   * Metadata on the generation requests' token usage.
   */
  usageMetadata!: UsageMetadata;
}

/**
 *
 */
@json
class Candidate {
  /**
   * Index of the candidate in the list of candidates.
   */
  index!: i8;

  /**
   * Generated content returned from the model.
   */
  content!: Content;

  /**
   * The reason why the model stopped generating tokens.
   */
  @omitnull()
  finishReason: FinishReason | null = null;

  /**
   * List of ratings for the safety of a response candidate.
   */
  @omitnull()
  safetyRatings: SafetyRating[] | null = null;

  /**
   * Citation information for model-generated candidate.
   */
  @omitnull()
  citationMetadata: CitationMetadata | null = null;
}

/**
 * Reason that a candidate finished.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FinishReason {
  /**
   * Default value. This value is unused.
   */
  export const FINISH_REASON_UNSPECIFIED = "FINISH_REASON_UNSPECIFIED";

  /**
   * Natural stop point of the model or provided stop sequence.
   */
  export const STOP = "STOP";

  /**
   * The maximum number of tokens as specified in the request was reached.
   */
  export const MAX_TOKENS = "MAX_TOKENS";

  /**
   * The candidate content was flagged for safety reasons.
   */
  export const SAFETY = "SAFETY";

  /**
   * The candidate content was flagged for recitation reasons.
   */
  export const RECITATION = "RECITATION";

  /**
   * The candidate content was flagged for using an unsupported language.
   */
  export const LANGUAGE = "LANGUAGE";

  /**
   * Unknown reason.
   */
  export const OTHER = "OTHER";
}
export type FinishReason = string;

/**
 * Safety setting, affecting the safety-blocking behavior.
 */
@json
class SafetyRating {
  category!: HarmCategory;
  probability!: HarmProbability;
}

/**
 * Probability that a prompt or candidate matches a harm category.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace HarmProbability {
  /**
   * Probability is unspecified.
   */
  export const HARM_PROBABILITY_UNSPECIFIED = "HARM_PROBABILITY_UNSPECIFIED";

  /**
   * Content has a negligible chance of being unsafe.
   */
  export const NEGLIGIBLE = "NEGLIGIBLE";

  /**
   * Content has a low chance of being unsafe.
   */
  export const LOW = "LOW";

  /**
   * Content has a medium chance of being unsafe.
   */
  export const MEDIUM = "MEDIUM";

  /**
   * Content has a high chance of being unsafe.
   */
  export const HIGH = "HIGH";
}
export type HarmProbability = string;

/**
 * Citation metadata that may be found on a {@link Candidate}.
 */
@json
export class CitationMetadata {
  citationSources!: CitationSource[];
}

/**
 * A single citation source.
 */
@json
export class CitationSource {
  /**
   * Start of segment of the response that is attributed to this source.
   */
  @omitnull()
  startIndex: i64 | null = null;

  /**
   * End of the attributed segment, exclusive.
   */
  @omitnull()
  endIndex: i64 | null = null;

  /**
   * URI that is attributed as a source for a portion of the text.
   */
  @omitnull()
  uri: string | null = null;

  /**
   * License for the GitHub project that is attributed as a source for segment.
   */
  license: string | null = null;
}

/**
 * If the prompt was blocked, this will be populated with `blockReason` and
 * the relevant `safetyRatings`.
 * @public
 */
@json
export class PromptFeedback {
  blockReason!: BlockReason;
  safetyRatings!: SafetyRating[];
}

/**
 * Reason that a prompt was blocked.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace BlockReason {
  /**
   * A blocked reason was not specified.
   */
  export const BLOCKED_REASON_UNSPECIFIED = "BLOCKED_REASON_UNSPECIFIED";

  /**
   * Content was blocked by safety settings.
   */
  export const SAFETY = "SAFETY";

  /**
   * Content was blocked, but the reason is uncategorized.
   */
  export const OTHER = "OTHER";
}
export type BlockReason = string;

/**
 * Metadata on the generation request's token usage.
 */
@json
export class UsageMetadata {
  /**
   * Number of tokens in the prompt.
   */
  promptTokenCount!: i32;

  /**
   * Total number of tokens across the generated candidates.
   */
  candidatesTokenCount!: i32;

  /**
   * Total token count for the generation request (prompt + candidates).
   */
  totalTokenCount!: i32;

  /**
   * Total token count in the cached part of the prompt, i.e. in the cached content.
   */
  cachedContentTokenCount: i32 | null = null;
}
