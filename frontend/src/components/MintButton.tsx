import { FC, useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { MINT_CAPABILITY_ID, PACKAGE_ID, PUBLISHER } from "../constant";

export const MintButton: FC = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [amount, setAmount] = useState<string>("100,000,000,000"); // Default 100 JELO
  const [recipient, setRecipient] = useState<string>("");
  const [requestAmount, setRequestAmount] = useState<string>("100,000,000,000"); // Default 100 JELO
  const [requesterAddress, setRequesterAddress] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  
  // Check if current user is the publisher
  const isPublisher = account?.address === PUBLISHER;

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const dismissToast = () => {
    setShowToast(false);
    setToastMessage("");
  };

  const handleMint = () => {
    // Log the input parameters
    console.log("Mint Parameters:");
    console.log("Recipient:", recipient);
    console.log("Amount in JELO:", (Number(amount.replace(/,/g, '')) / 1_000_000_000));

    if (!account) {
      showToastMessage("Please connect your wallet first");
      return;
    }

    if (!recipient) {
      showToastMessage("Please enter recipient address");
      return;
    }

    const tx = new Transaction();
    
    // Mint JELO tokens
    tx.moveCall({
      target: `${PACKAGE_ID}::jelo::mint`,
      arguments: [
        tx.object(MINT_CAPABILITY_ID),
        tx.pure.u64(Number(amount.replace(/,/g, ''))),
        tx.pure.address(recipient)
      ]
    });

    showToastMessage("Minting JELO tokens...");
    signAndExecute(
      { transaction: tx as any },
      {
        onError: (error) => {
          console.error("Mint error:", error);
          showToastMessage(`Transaction failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        },
        onSuccess: async (result) => {
          if (result.digest) {
            showToastMessage(`JELO tokens minted successfully! Transaction: ${result.digest}`);
            // Reset form
            setRecipient("");
            setAmount("100,000,000,000");
          } else {
            showToastMessage("Transaction completed but no digest received");
          }
        }
      }
    );
  };

  const handleRequestTokens = () => {
    // Log the request parameters
    console.log("Token Request Parameters:");
    console.log("Requester Address:", requesterAddress || account?.address);
    console.log("Amount (raw):", requestAmount);
    console.log("Amount (formatted):", Number(requestAmount.replace(/,/g, '')));
    console.log("Amount in JELO:", (Number(requestAmount.replace(/,/g, '')) / 1_000_000_000).toLocaleString());

    if (!account) {
      showToastMessage("Please connect your wallet first");
      return;
    }

    const addressToUse = requesterAddress || account?.address;
    
    if (!addressToUse) {
      showToastMessage("Please enter your address");
      return;
    }

    // Here you would send the request to your server
    // For now, we'll just show a toast message
    showToastMessage(`Token request sent for ${(Number(requestAmount.replace(/,/g, '')) / 1_000_000_000).toLocaleString()} JELO tokens to ${addressToUse}`);
    
    // Reset form
    setRequesterAddress("");
    setRequestAmount("100,000,000,000");
  };

  const handleUseMyAddress = () => {
    if (account) {
      setRecipient(account.address);
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 font-inter">
      {isPublisher ? (
        <>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Mint JELO Tokens</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount (in smallest unit, 9 decimals)
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e) => {
                  // Remove non-digit characters and format with commas
                  const value = e.target.value.replace(/,/g, '');
                  if (value === '' || /^\d+$/.test(value)) {
                    const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    setAmount(formattedValue);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="100,000,000,000"
              />
              <p className="text-xs text-gray-500 mt-1">
                {(Number(amount.replace(/,/g, '')) / 1_000_000_000).toLocaleString()} JELO tokens
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
              disabled={!account}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Mint JELO Tokens
            </button>

            {!account && (
              <div className="p-3 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-md text-sm">
                Please connect your wallet to mint tokens
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Request JELO Tokens</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount (in smallest unit, 9 decimals)
              </label>
              <input
                type="text"
                value={requestAmount}
                onChange={(e) => {
                  // Remove non-digit characters and format with commas
                  const value = e.target.value.replace(/,/g, '');
                  if (value === '' || /^\d+$/.test(value)) {
                    const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    setRequestAmount(formattedValue);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="100,000,000,000"
              />
              <p className="text-xs text-gray-500 mt-1">
                {(Number(requestAmount.replace(/,/g, '')) / 1_000_000_000).toLocaleString()} JELO tokens
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Address (optional, will use connected wallet if empty)
              </label>
              <input
                type="text"
                value={requesterAddress}
                onChange={(e) => setRequesterAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="0x..."
              />
            </div>

            <button
              onClick={handleRequestTokens}
              disabled={!account}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Request JELO Tokens
            </button>

            {!account && (
              <div className="p-3 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-md text-sm">
                Please connect your wallet to request tokens
              </div>
            )}
          </div>
        </>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between z-50">
          <span>{toastMessage}</span>
          <button
            onClick={dismissToast}
            className="ml-4 text-gray-300 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};