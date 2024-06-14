import { JSON } from "json-as";

type ModelInvoker = (modelName: string, inputJson: string) => string | null;

export class ModelInfo {
  constructor(
    public readonly name: string,
    public readonly fullName: string = name,
  ) {}
}

export interface ModelFactory {
  getModel<T extends Model<object, object>>(modelName: string): T;
}

export abstract class Model<TInput extends object, TOutput extends object> {
  protected constructor(
    public readonly info: ModelInfo,
    private invoker: ModelInvoker,
  ) {}

  debug: boolean = false;

  /**
   * Invokes the model with the given input.
   * @param input The input object to pass to the model.
   * @returns The output object from the model.
   */
  invoke(input: TInput): TOutput {
    const modelName = this.info.name;
    const inputJson = JSON.stringify(input);
    if (this.debug) {
      console.debug(`Invoking ${modelName} model with input: ${inputJson}`);
    }

    const outputJson = this.invoker(modelName, inputJson);
    if (!outputJson) {
      throw new Error(`Failed to invoke ${modelName} model.`);
    }

    if (this.debug) {
      console.debug(`Received output: ${outputJson}`);
    }

    return JSON.parse<TOutput>(outputJson, true);
  }
}
