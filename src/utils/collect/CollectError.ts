export class CollectError<T extends Record<string, Error>> extends Error {
  public errors: T;
  public constructor(errors: T) {
    let message = 'The following errors where found:';
    for (const [key, error] of Object.entries(errors)) {
      message += `\n\t${key}: ${error.message.replace('\n', '\n\t\t')}`;
    }
    super(message);
    this.errors = errors;
  }
}
