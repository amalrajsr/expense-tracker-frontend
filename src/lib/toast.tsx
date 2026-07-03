import toast, { type ToastOptions } from "react-hot-toast";

type ToastType = "success" | "error" | "custom";

export const showToast = (
  message: string,
  type: ToastType,
  options?: ToastOptions,
) => {
  if (type === "success") {
    toast.success(message, options);
    return;
  }

  if (type === "error") {
    toast.error(message, options);
    return;
  }
};

export default showToast;
