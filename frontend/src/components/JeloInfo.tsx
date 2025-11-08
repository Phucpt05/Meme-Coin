import { FC, useEffect, useState } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { getMintCapabilityDetails, getCoinMetadata } from "../utils/transactions";
import { PACKAGE_ID } from "../constant";

interface MintCapability {
  total_minted: string;
}

interface CoinMetadata {
  name: string;
  symbol: string;
  decimals: number;
  supply: string;
}

export const JeloInfo: FC = () => {
  const client = useSuiClient();
  const [mintCap, setMintCap] = useState<MintCapability | null>(null);
  const [coinMetadata, setCoinMetadata] = useState<CoinMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mintCapData, metadataData] = await Promise.all([
          getMintCapabilityDetails(client as any),
          getCoinMetadata(client as any)
        ]);

        if (mintCapData && 'fields' in mintCapData) {
          const fields = mintCapData.fields as any;
          setMintCap({
            total_minted: fields.total_minted || "0"
          });
        }

        if (metadataData) {
          setCoinMetadata({
            name: metadataData.name,
            symbol: metadataData.symbol,
            decimals: metadataData.decimals,
            supply: "0" // CoinMetadata doesn't have supply field
          });
        }
      } catch (error) {
        console.error("Error fetching JELO info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [client]);

  const totalSupply = 1_000_000_000_000_000_000; // 1 billion in smallest unit
  const totalMinted = mintCap?.total_minted ? Number(mintCap.total_minted) : 0;
  const remainingSupply = totalSupply - totalMinted;
  const mintPercentage = ((totalMinted / totalSupply) * 100).toFixed(2);

  if (loading) {
    return (
      <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 font-inter">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">JELO Token Info</h2>
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 font-inter">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">JELO Token Info</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Token Details</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Name:</strong> {coinMetadata?.name || "JELO"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Symbol:</strong> {coinMetadata?.symbol || "JELO"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Decimals:</strong> {coinMetadata?.decimals || 9}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Supply Information</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Total Supply:</strong> {(totalSupply / 1_000_000_000).toLocaleString()} JELO
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Total Minted:</strong> {(totalMinted / 1_000_000_000).toLocaleString()} JELO
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Remaining:</strong> {(remainingSupply / 1_000_000_000).toLocaleString()} JELO
          </p>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${mintPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{mintPercentage}% minted</p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Contract Address:</strong> {PACKAGE_ID}
        </p>
      </div>
    </div>
  );
};