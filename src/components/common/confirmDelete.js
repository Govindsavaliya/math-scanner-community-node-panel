import Swal from "sweetalert2";

const BUTTON =
  "cursor-pointer rounded-lg border border-solid px-4 py-2 text-[14px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const classes = (confirmTone) => ({
    popup: "rounded-xl! border! border-line! bg-surface! p-6! text-ink! shadow-xl!",
    title: "p-0! pt-2! text-[18px]! font-semibold! text-ink!",
    htmlContainer: "m-0! mt-2! p-0! text-[14px]! text-muted!",
    icon: "mt-0! mb-2! size-16! scale-90!",
    actions: "mt-6! gap-3!",
    confirmButton: `${BUTTON} ${confirmTone} text-white hover:opacity-90`,
    cancelButton: `${BUTTON} border-line bg-surface text-ink hover:bg-canvas`,
    validationMessage: "bg-danger/10! text-danger!",
});

const dialog = Swal.mixin({
  customClass: classes("border-danger bg-danger"),
  buttonsStyling: false,
  reverseButtons: true,
  focusCancel: true,
});

/**
 * Confirmation dialog that runs the delete inside the dialog (showing
 * the server error in place if it fails).
 *
 * @param {() => Promise<unknown>} onConfirm  Usually `() => remove.mutateAsync(id)`.
 * @returns {Promise<boolean>} true when the item was deleted.
 */
export async function confirmDelete(
  onConfirm,
  { title, message, confirmButtonText, cancelButtonText } = {},
) {
  const result = await dialog.fire({
    title: title || "Delete this item?",
    text: message || "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: confirmButtonText || "Delete",
    cancelButtonText: cancelButtonText || "Cancel",
    showLoaderOnConfirm: false,
    allowOutsideClick: () => !Swal.isLoading(),
    preConfirm: async () => {
      try {
        return await onConfirm();
      } catch (error) {
        Swal.showValidationMessage(error?.message || "Failed to delete");
        throw error;
      }
    },
  });
  return result.isConfirmed;
}

/**
 * Confirmation dialog for restoring a soft-deleted item; runs the restore inside the dialog.
 *
 * @param {() => Promise<unknown>} onConfirm  Usually `() => restore.mutateAsync(id)`.
 * @returns {Promise<boolean>} true when the item was restored.
 */
export async function confirmRestore(onConfirm, { title, message, confirmButtonText } = {}) {
  const result = await dialog.fire({
    title: title || "Restore this item?",
    text: message || "It will become active again.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: confirmButtonText || "Restore",
    cancelButtonText: "Cancel",
    customClass: classes("border-primary bg-primary"),
    allowOutsideClick: () => !Swal.isLoading(),
    preConfirm: async () => {
      try {
        return await onConfirm();
      } catch (error) {
        Swal.showValidationMessage(error?.message || "Failed to restore");
        throw error;
      }
    },
  });
  return result.isConfirmed;
}

/** Generic yes/no confirmation (e.g. logout). Resolves true when confirmed. */
export async function confirmAction({ title, message, confirmButtonText = "Confirm", icon = "question" }) {
  const result = await dialog.fire({
    title,
    text: message,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Cancel",
    customClass: classes("border-primary bg-primary"),
  });
  return result.isConfirmed;
}
