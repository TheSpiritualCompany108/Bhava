/**
 * Admin toasts — one popup system for every save / update / delete in the admin.
 *
 *   import { toast } from "./toast";
 *   toast.success("Saved — live on the Hero banner.");
 *   toast.error("Could not save. Please try again.");
 *
 * <AdminToaster /> (adminToast.jsx) is mounted once by AdminPage. Calls work from anywhere, no props or context needed.
 */
export const listeners = new Set();
let nextId = 1;

const emit = (type, message, ms) => {
  if (!message) return;
  const item = { id: nextId++, type, message: String(message), ms };
  listeners.forEach((fn) => fn(item));
};

export const toast = {
  success: (message, ms = 4000) => emit("success", message, ms),
  error: (message, ms = 6000) => emit("error", message, ms),
  info: (message, ms = 4000) => emit("info", message, ms),
};

