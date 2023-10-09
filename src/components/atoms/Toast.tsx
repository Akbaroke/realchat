import { toast } from 'sonner';

export const toastSuccess = (message: string, id: string) =>
  toast.success(message, { id });

export const toastError = (message: string, id: string) =>
  toast.error(message, { id });

export const toastLoading = (message: string, id: string) =>
  toast.loading(message, { id });
