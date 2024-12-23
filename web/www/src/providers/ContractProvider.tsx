import { useChainId } from "wagmi";
import { createContext, useContext, useMemo } from "react";

import abi from "../web3/abi";
import { Contract } from "../web3/contracts";

type ContractContext = {
  abi: typeof abi;
  contract: (typeof Contract)[keyof typeof Contract];
};

const ContractContext = createContext<Partial<ContractContext>>({});

export default function ContractProvider({
  children,
}: React.PropsWithChildren) {
  const chainId = useChainId();
  const contract = useMemo(
    () => Contract[chainId as keyof typeof Contract],
    [chainId]
  );

  return (
    <ContractContext.Provider value={{ contract, abi }}>
      {children}
    </ContractContext.Provider>
  );
}

export const useContract = () => useContext(ContractContext) as ContractContext;
