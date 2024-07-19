import Anthropic from "@anthropic-ai/sdk";

import { Model } from "../..";

enum Role {
  User = "user",
  Assistant = "assistant",
}

/**
 * A message object that can be sent to the model.
 */
@json
abstract class Message implements Anthropic.MessageParam {
  /**
   * Creates a new message object.
   *
   * @param role The role of the author of this message.
   * @param content The contents of the message.
   */
  constructor(role: Role.User | Role.Assistant, content: string) {
    this._role = role;
    this.content = content;
  }

  @alias("role")
  protected _role: Role.User | Role.Assistant;

  /**
   * The role of the author of this message.
   */
  get role() {
    return this._role;
  }

  /**
   * The contents of the message.
   * For now it can only be a string, even though Anthropic supports more complex types.
   */
  content: string; // TODO: support more complex types
}

/**
 * A user message.
 */
@json
export class UserMessage extends Message {
  /**
   * Creates a new user message object.
   *
   * @param content The contents of the message.
   */
  constructor(content: string) {
    super(Role.User, content);
  }
}

/**
 * An assistant message.
 */
@json
export class AssistantMessage extends Message {
  /**
   * Creates a new assistant message object.
   *
   * @param content The contents of the message.
   */
  constructor(content: string) {
    super(Role.Assistant, content);
  }
}
