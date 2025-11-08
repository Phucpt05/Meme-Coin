import React from "react";
import { ConnectButton } from "@mysten/dapp-kit";
import { useNavigation } from "../../providers/navigation/NavigationContext";

const NavBar: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <nav className="bg-transparent p-4 shadow-md w-full font-inter">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/wallet')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Wallet
        </button>
        <ConnectButton />
      </div>
    </nav>
  );
};

export default NavBar;
