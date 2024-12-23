import clsx from "clsx";
import { Link } from "react-router";
import { MdWeb } from "react-icons/md";
import { FaTwitter, FaTelegram } from "react-icons/fa";

import type { Token } from "../../../.graphclient";

type TokenSocialProps = {
  className?: string;
  token: Pick<Token, "socialX" | "socialTelegram" | "socialWebsite">;
};

export default function TokenSocial({ token, className }: TokenSocialProps) {
  return (
    <div className={clsx(className, "flex items-center")}>
      {token.socialX && (
        <Link
          target="_blank"
          to={token.socialX}
          className="p-2"
        >
          <FaTwitter />
        </Link>
      )}
      {token.socialTelegram && (
        <Link
          target="_blank"
          to={token.socialTelegram}
          className="p-2"
        >
          <FaTelegram />
        </Link>
      )}
      {token.socialWebsite && (
        <Link
          target="_blank"
          to={token.socialWebsite}
          className="p-2"
        >
          <MdWeb />
        </Link>
      )}
    </div>
  );
}
