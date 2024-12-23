import { MdArrowUpward } from "react-icons/md";
import Avatar from "../Avatar";

export default function ProfileInfo() {
  return (
    <div className="flex items-center space-x-4">
      <Avatar
        alt={""}
        width={64}
        height={64}
      />
      <div className="flex flex-col space-y-2">
        <h1 className="text-lg">Test Name Test</h1>
        <div className="flex items-center space-x-4">
          <p>9e5678..9000</p>
          <button className="flex items-center space-x-2 text-black/75 dark:text-white/75">
            <span className="text-xs md:text-sm">View in Explorer</span>
            <MdArrowUpward className="rotate-45" />
          </button>
        </div>
      </div>
      <button className="btn btn-outline-primary">
        Edit Profile
      </button>
    </div>
  );
}
