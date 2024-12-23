import clsx from "clsx";
import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";

type PaneDialogProps = {
  panelProps?: { className?: string };
  dialogProps: React.ComponentProps<typeof Dialog>;
};

export default function PaneDialog({
  dialogProps,
  panelProps,
  children,
}: React.PropsWithChildren<PaneDialogProps>) {
  return (
    <Dialog
      {...dialogProps}
      className={clsx(dialogProps.className, "relative z-20")}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/25 dark:bg-white/25 dark:text-white dark:backdrop-blur-sm" />
      <div className="fixed inset-0 flex flex-col md:justify-center md:items-center">
        <DialogPanel
          className={clsx(
            "bg-white py-4 rounded-xl lt-md:h-4xl lt-md:mt-auto lt-md:pb-4 lt-md:rounded-t-xl lt-md:overflow-y-scroll md:self-center md:min-w-xl dark:bg-dark",
            panelProps?.className
          )}
        >
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
