import { LoadingStore, LoadingType } from "../stores/LoadingStore";

export class LoadingService {
  constructor(
    private readonly loadingStore: LoadingStore,
  ) {}

  public withLoading = async (loadingType: LoadingType, loadAction: () => Promise<void>) => {
    try {
      this.incrementLoading(loadingType);
      await loadAction();
    } finally {
      this.decrementLoading(loadingType);
    }
  };

  public withLoadingReturn = async <T> (loadingType: LoadingType, loadAction: () => Promise<T>) => {
    try {
      this.incrementLoading(loadingType);
      return await loadAction();
    } finally {
      this.decrementLoading(loadingType);
    }
  };

  public incrementLoading = (loadingType: LoadingType) => {
    this.loadingStore.addLoading(loadingType);
  };

  public decrementLoading = (loadingType: LoadingType) => {
    this.loadingStore.removeLoading(loadingType);
  };
}