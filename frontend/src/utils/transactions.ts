import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { MINT_CAPABILITY_ID, PACKAGE_ID } from "../constant";

export async function mintJeloTokens(
  client: SuiClient,
  signer: any,
  amount: number,
  recipient: string
) {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::jelo::mint`,
    arguments: [
      tx.object(MINT_CAPABILITY_ID),
      tx.pure.u64(amount),
      tx.pure.address(recipient)
    ]
  });
  
  return await client.signAndExecuteTransaction({
    transaction: tx,
    signer,
    options: {
      showEffects: true,
      showEvents: true,
    }
  });
}

export async function getMintCapabilityDetails(client: SuiClient) {
  const result = await client.getObject({
    id: MINT_CAPABILITY_ID,
    options: {
      showContent: true,
      showType: true,
    }
  });
  
  return result.data?.content;
}

export async function getCoinMetadata(client: SuiClient) {
  const result = await client.getCoinMetadata({
    coinType: `${PACKAGE_ID}::jelo::JELO`,
  });
  
  return result;
}