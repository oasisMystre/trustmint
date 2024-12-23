import { useState } from "react";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { array, InferType, mixed, object, string } from "yup";

import { useChainId, useWriteContract } from "wagmi";
import { type Address, parseEventLogs } from "viem";

import abi from "../../web3/abi";
import { format } from "../../utils/format";
import { Contract } from "../../web3/contracts";

import Input from "../Input";
import FileInput from "../FileInput";
import ListInput from "../ListInput";
import TransactionConfirmationToast from "../TransactionConfirmationToast";
import { useCloudinary } from "../../providers/CloudinaryProvider";

type MetadataTabProps = {
  onClose: () => void;
};

export default function MetadataTab({ onClose }: MetadataTabProps) {
  const navigate = useNavigate();
  const chainId = useChainId();
  const { uploadFiles } = useCloudinary();

  const { writeContractAsync } = useWriteContract();
  const [hash, setHash] = useState<Address | null>(null);

  const validationSchema = object({
    name: string().required(),
    ticker: string().required(),
    description: string(),
    logo: mixed<File>().required(),
    links: array(
      object({
        name: string(),
        value: string().url("Invalid url"),
      })
    ).required(),
  });

  const onSubmit = async (values: InferType<typeof validationSchema>) => {
    const file = await uploadFiles(values.logo);
    const hash = await writeContractAsync({
      abi,
      args: [
        values.name,
        values.ticker.replace(/^\$/, ""),
        values.description ?? "",
        file.secure_url,
        ...(values.links.map((link) => link.value ?? "") as [
          string,
          string,
          string
        ]),
      ],
      functionName: "addToken",
      address: Contract[chainId as keyof typeof Contract].address,
    });

    return setHash(hash);
  };

  return (
    <Formik
      initialValues={{
        name: "",
        ticker: "",
        description: "",
        logo: "" as unknown as File,
        links: [
          { name: "twitter", value: "" },
          { name: "telegram", value: "" },
          { name: "website", value: "" },
        ],
      }}
      validationSchema={validationSchema}
      onSubmit={(values) =>
        onSubmit(values).catch(() => {
          toast.error("Ooops! An unexpected error occured");
        })
      }
    >
      {({ isSubmitting, handleReset }) => (
        <Form className="flex-1 flex flex-col space-y-8">
          <div className="flex flex-col space-y-2">
            <Input
              label="Name"
              inputProps={{ placeholder: "Token name", name: "name" }}
            />
            <Input
              label="Ticker"
              inputProps={{ placeholder: "Token ticker", name: "ticker" }}
            />
            <Input
              label="Description"
              inputProps={{
                placeholder: "Token description",
                name: "description",
              }}
            />
            <FileInput
              name="logo"
              label="Image or Video"
            />
            <ListInput
              label="Social media & Links"
              name="links"
              addActionProps={{ text: "Add Link" }}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn !btn-primary !py-0 rounded"
          >
            {isSubmitting ? (
              <div className="size-6 my-3 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="py-3">Create Coin</span>
            )}
          </button>
          {hash && (
            <TransactionConfirmationToast
              hash={hash}
              onSuccess={({ logs }) => {
                const events = parseEventLogs({
                  logs,
                  abi,
                  eventName: "AddedToken",
                });

                if (events.length > 0) {
                  const [event] = events;
                  window.setTimeout(() => {
                    handleReset();
                    onClose();

                    return navigate(
                      format("/%/%", chainId, event.args.tokenAddress)
                    );
                  }, 4000);
                }
              }}
            />
          )}
        </Form>
      )}
    </Formik>
  );
}
