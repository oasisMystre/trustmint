import xior from "xior";
import { Cloudinary } from "@cloudinary/url-gen";
import { createContext, useContext, useMemo } from "react";

import { format } from "../utils/format";

type CloudinaryContext = {
  cloudinary: Cloudinary;
  uploadFiles: (
    ...files: File[]
  ) => Promise<{ secure_url: string; url: string }>;
};

type CloudinaryProviderProps = {
  cloudName: string;
};

const CloudinaryContext = createContext<Partial<CloudinaryContext>>({});

export default function CloudinaryProvider({
  cloudName,
  children,
}: React.PropsWithChildren<CloudinaryProviderProps>) {
  const cloudinary = useMemo(
    () =>
      new Cloudinary({
        cloud: {
          cloudName,
        },
      }),
    [cloudName]
  );

  const uploadFiles = (...files: File[]) => {
    const formData = new FormData();
    for (const file of files) {
      formData.append("file", file);
      formData.append("tags", "browser_upload,token");
      formData.append("upload_preset", "ml_default");
    }

    return xior
      .post<{ secure_url: string; url: string }>(
        format("https://api.cloudinary.com/v1_1/%/upload", cloudName),
        formData
      )
      .then(({ data }) => data);
  };

  return (
    <CloudinaryContext.Provider value={{ cloudinary, uploadFiles }}>
      {children}
    </CloudinaryContext.Provider>
  );
}

export const useCloudinary = () =>
  useContext(CloudinaryContext) as CloudinaryContext;
