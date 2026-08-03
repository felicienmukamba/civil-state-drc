import { toast } from 'sonner';

export class Toast {
  static success(message: string, description?: string) {
    toast.success(message, {
      description,
    });
  }

  static error(message: string, description?: string) {
    toast.error(message, {
      description,
    });
  }

  static info(message: string, description?: string) {
    toast.info(message, {
      description,
    });
  }

  static warning(message: string, description?: string) {
    toast.warning(message, {
      description,
    });
  }

  static promise<T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  }
}
