import { makeObservable, observable } from "mobx";

export enum LoadingType {
  SEARCH_MOVIES = "search-movies",
}

export class LoadingStore {
  public loadingCountsByType: { [key in LoadingType ]: number } = {
    [LoadingType.SEARCH_MOVIES]: 0,
  };

  constructor() {
    makeObservable(this, {
        loadingCountsByType: observable,
    });
  }

  public isLoading = (loadingType: LoadingType) => this.loadingCountsByType[loadingType] > 0;

  public addLoading(loadingType: LoadingType) {
    const count = this.loadingCountsByType[loadingType];
    this.loadingCountsByType[loadingType] = count + 1;
  }

  public removeLoading(loadingType: LoadingType) {
    const count = this.loadingCountsByType[loadingType];
    this.loadingCountsByType[loadingType] = count - 1;
  }
}