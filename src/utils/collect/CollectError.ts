import type { Dictionary } from 'type-core';

export class CollectError<T extends Dictionary<Error>> extends Error {
  public errors: T;
  public constructor(errors: T) {
    let message = 'the following errors where found:';
    for (const [key, error] of Object.entries(errors)) {
      message += `\n\t${key}: ${error.message.replace('\n', '\n\t\t')}`;
    }
    super(message);
    this.errors = errors;
  }
}
