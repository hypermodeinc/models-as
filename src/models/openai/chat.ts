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
  frequencyPenalty: f64 = 0.0;


  @alias("logit_bias")
  logitBias: Map<string, f64> | null = null;

  logprobs: bool = false;

  // @alias("top_logprobs")
  // topLogprobs: i32 = 0;  // TODO: only send when logprobs is true

  @alias("max_tokens")
  maxTokens: i32 = 4096;

  n: i32 = 1;


  @alias("presence_penalty")
  presencePenalty: f64 = 0.0;


  @alias("response_format")
  responseFormat: ResponseFormat = ResponseFormat.Text;

  // seed: i32 | null = null; // TODO: we need a true Nullable<i32> type for this to work
  stop: string[] | null = null;

  // stream: bool = false;
  // @alias("stream_options")
  // streamOptions: StreamOptions | null = null;

  temperature: f64 = 1.0;


  @alias("top_p")
  topP: f64 = 1.0;

  tools: Tool[] | null = null;


  @alias("tool_choice")
  toolChoice: string | null = null; // TODO: verify this works

  // @alias("parallel_tool_calls")
  // parallelToolCalls: bool = true;  // TODO: omit this when no tools

  @alias("user")
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
  description: string | null = null;
  name!: string;
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

  name: string | null = null;
}


@json
export class UserMessage extends Message {
  constructor(content: string) {
    super("user", content);
  }

  name: string | null = null;
}


@json
export class AssistantMessage extends Message {
  constructor(content: string) {
    super("assistant", content);
  }

  name: string | null = null;


  @alias("tool_calls")
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
