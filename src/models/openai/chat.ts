import { Model } from "../..";

// Reference: https://platform.openai.com/docs/api-reference/chat

export default class ChatCompletionModel extends Model<
  ChatCompletionInput,
  ChatCompletionOutput
> {
  createInput(messages: Message[]): ChatCompletionInput {
    const model = this.info.fullName;
    return <ChatCompletionInput>{ model, messages };
  }
}


@json
class ChatCompletionInput {
  model!: string;
  messages!: Message[];


  @alias("frequency_penalty")
  @omitif("this.frequencyPenalty == 0.0")
  frequencyPenalty: f64 = 0.0;


  @alias("logit_bias")
  @omitnull()
  logitBias: Map<string, f64> | null = null;


  @omitif("this.logprobs == false")
  logprobs: bool = false;


  @alias("top_logprobs")
  @omitif("this.logprobs == false")
  topLogprobs: i32 = 0;


  @alias("max_tokens")
  @omitif("this.maxTokens == 4096")
  maxTokens: i32 = 4096; // TODO: make this an `i32 | null` when supported


  @omitif("this.n == 1")
  n: i32 = 1;


  @alias("presence_penalty")
  @omitif("this.presencePenalty == 0.0")
  presencePenalty: f64 = 0.0;


  @alias("response_format")
  @omitif("this.responseFormat.type == 'text'")
  responseFormat: ResponseFormat = ResponseFormat.Text;


  @omitif("this.seed == -1")
  seed: i32 = -1; // TODO: make this an `i32 | null` when supported


  @omitnull()
  stop: string[] | null = null;

  // stream: bool = false;

  // @omitif("this.stream == false")
  // @alias("stream_options")
  // streamOptions: StreamOptions | null = null;

  @omitif("this.temperature == 1.0")
  temperature: f64 = 1.0;


  @alias("top_p")
  @omitif("this.topP == 1.0")
  topP: f64 = 1.0;


  @omitnull()
  tools: Tool[] | null = null;


  @alias("tool_choice")
  @omitnull()
  toolChoice: string | null = null; // TODO: verify this works


  @alias("parallel_tool_calls")
  @omitif("this.parallelToolCalls == true || !this.tools || this.tools!.length == 0")
  parallelToolCalls: bool = true;


  @omitnull()
  user: string | null = null;
}


@json
class ChatCompletionOutput {
  id!: string;
  object!: string;
  choices!: Choice[];
  created!: i32; // unix timestamp seconds
  model!: string;


  @alias("system_fingerprint")
  systemFingerprint!: string;

  usage!: Usage;
}


@json
export class ResponseFormat {
  type!: string;

  static Json: ResponseFormat = { type: "json_object" };
  static Text: ResponseFormat = { type: "text" };
}

// @json
// export class StreamOptions {

//   @omitif("this.includeUsage == false")
//   @alias("include_usage")
//   includeUsage: bool = false;
// }

@json
export class Tool {
  type: string = "function";
  function: FunctionDefinition = new FunctionDefinition();
}


@json
export class FunctionDefinition {
  name!: string;


  @omitnull()
  description: string | null = null;


  @omitnull()
  parameters: string | null = null; // TODO: verify this works
}


@json
export class ToolCall {
  id!: string;
  type: string = "function";
  function!: FunctionCall;
}


@json
export class FunctionCall {
  name!: string;
  arguments!: string;
}


@json
class Usage {

  @alias("completion_tokens")
  completionTokens!: i32;


  @alias("prompt_tokens")
  promptTokens!: i32;


  @alias("total_tokens")
  totalTokens!: i32;
}


@json
class Choice {

  @alias("finish_reason")
  finishReason!: string;

  index!: i32;

  message!: CompletionMessage;

  logprobs!: Logprobs | null;
}


@json
class Logprobs {
  content: LogprobsContent[] | null = null;
}


@json
class LogprobsContent {
  token!: string;
  logprob!: f64;
  bytes!: u8[] | null; // TODO: verify this works


  @alias("top_logprobs")
  topLogprobs!: TopLogprobsContent[]; // TODO: verify this works
}


@json
class TopLogprobsContent {
  token!: string;
  logprob!: f64;
  bytes!: u8[] | null; // TODO: verify this works
}


@json
abstract class Message {
  constructor(role: string, content: string) {
    this._role = role;
    this.content = content;
  }


  @alias("role")
  protected _role: string;
  get role(): string {
    return this._role;
  }

  content: string;
}


@json
export class SystemMessage extends Message {
  constructor(content: string) {
    super("system", content);
  }


  @omitnull()
  name: string | null = null;
}


@json
export class UserMessage extends Message {
  constructor(content: string) {
    super("user", content);
  }


  @omitnull()
  name: string | null = null;
}


@json
export class AssistantMessage extends Message {
  constructor(content: string) {
    super("assistant", content);
  }


  @omitnull()
  name: string | null = null;


  @alias("tool_calls")
  @omitif("this.toolCalls.length == 0")
  toolCalls: ToolCall[] = [];
}


@json
export class ToolMessage extends Message {
  constructor(content: string) {
    super("tool", content);
  }


  @alias("tool_call_id")
  toolCallId!: string;
}


@json
class CompletionMessage extends Message {
  constructor(role: string, content: string) {
    super(role, content);
  }


  @alias("tool_calls")
  toolCalls: ToolCall[] = [];
}
