import { FC } from "react";
import { WalletStatus } from "../components/wallet/Status";
import { useNavigation } from "../providers/navigation/NavigationContext";

const WalletView: FC = () => {
  const { navigate } = useNavigation();

  return (
    <>
      <div className="text-center font-inter">
        <div className="mb-4">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
        <h1 className="text-4xl font-bold mb-8">Wallet Info</h1>
      </div>
      <WalletStatus />
    </>
  )
}

export default WalletView;
