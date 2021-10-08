import { ErrorStore } from "../stores/ErrorStore";

type ErrorHandlerFunction = (error: any, defaultErrorHandler: () => Promise<void> | void) => Promise<void> | void;

export class ErrorHandlerService {
  constructor (
    private readonly errorStore: ErrorStore,
  ) {}

  private onError(e: any) {
    this.errorStore.errors.push(e);
    this.errorStore.severity = "error";
  }

  public async callRequest<R>(
    request: () => Promise<R>,
    onError?: ErrorHandlerFunction,
  ): Promise<R | null> {
    try {
      return await request();
    } catch (e) {
      if (onError) {
        await onError(e, () => this.onError(e));
      } else {
        this.onError(e);
      }
      return null;
    }
  }
}