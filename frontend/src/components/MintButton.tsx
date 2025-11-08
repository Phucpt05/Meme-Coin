import { FC, useState } from "react";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { mintJeloTokens } from "../utils/transactions";

export const MintButton: FC = () => {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [amount, setAmount] = useState<string>("100000000000"); // Default 100 JELO
  const [recipient, setRecipient] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const handleMint = async () => {
    if (!account) {
      setResult("Please connect your wallet first");
      return;
    }

    if (!recipient) {
      setResult("Please enter recipient address");
      return;
    }

    setIsLoading(true);
    setResult("");

    try {
      const result = await mintJeloTokens(
        client as any,
        account,
        Number(amount),
        recipient
      );

      if (result.digest) {
        setResult(`Success! Transaction: ${result.digest}`);
      } else {
        setResult("Transaction failed");
      }
    } catch (error) {
      console.error("Mint error:", error);
      setResult(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseMyAddress = () => {
    if (account) {
      setRecipient(account.address);
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 font-inter">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Mint JELO Tokens</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount (in smallest unit, 9 decimals)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="100000000000"
          />
          <p className="text-xs text-gray-500 mt-1">
            {(Number(amount) / 1_000_000_000).toLocaleString()} JELO tokens
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Recipient Address
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="0x..."
            />
            <button
              onClick={handleUseMyAddress}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              Use My Address
            </button>
          </div>
        </div>

        <button
          onClick={handleMint}
          disabled={isLoading || !account}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Minting..." : "Mint JELO Tokens"}
        </button>

        {result && (
          <div className={`p-3 rounded-md text-sm ${
            result.includes("Success") 
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}>
            {result}
          </div>
        )}

        {!account && (
          <div className="p-3 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-md text-sm">
            Please connect your wallet to mint tokens
          </div>
        )}
      </div>
    </div>
  );
};