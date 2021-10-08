import { Color } from "@material-ui/lab";
import { makeObservable, observable } from "mobx";

export class ErrorStore {
  public errors: any[] = [];

  public severity: Color = "error";

  constructor() {
    makeObservable(this, {
      errors: observable,
      severity: observable,
    });
  }
}