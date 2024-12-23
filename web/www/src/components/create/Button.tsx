import { useState } from "react";
import CreateDialog from "./Dialog";

export default function CreateButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn !btn-primary !py-2 rounded-xl truncate"
        onClick={() => setOpen(true)}
      >
        Create Token
      </button>
      <CreateDialog
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}
