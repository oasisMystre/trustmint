type Env = "WALLETCONNECT_PROJECT_ID"|"CLOUDINARY_CLOUD_NAME"|"INFURA_BSC_SEPOLIA_ENDPOINT"|"PYTH_ENDPOINT"|"INFURA_BASE_SEPOLIA_ENDPOINT"|"INFURA_ETHEREUM_SEPOLIA_ENDPOINT"|"INFURA_BSC_ENDPOINT"|"INFURA_BASE_ENDPOINT"|"INFURA_ETHEREUM_ENDPOINT";

export const getEnv = <T extends object | string = string>(name: Env) => {
  const value = import.meta.env[name] || import.meta.env["VITE_APP_" + name];
  if (value)
    try {
      return JSON.parse(value) as T;
    } catch {
      return value;
    }
  return null;
};
