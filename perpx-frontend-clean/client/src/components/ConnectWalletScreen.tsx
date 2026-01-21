import { Wallet } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

interface ConnectWalletScreenProps {
  title: string;
  description: string;
}

export default function ConnectWalletScreen({ title, description }: ConnectWalletScreenProps) {
  const { connect } = useWallet();

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
              <Wallet className="h-10 w-10 text-primary" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">{title}</h2>
            <p className="text-base sm:text-lg text-white/60">
              {description}
            </p>
          </div>

          {/* Connect Button */}
          <div className="flex justify-center">
            <button
              onClick={connect}
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all duration-200 text-lg"
            >
              Connect Wallet
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100x</div>
              <div className="text-xs text-white/40 mt-1">Leverage</div>
            </div>
            <div className="text-center border-x border-white/10">
              <div className="text-2xl font-bold text-primary">$0</div>
              <div className="text-xs text-white/40 mt-1">Fees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-xs text-white/40 mt-1">Trading</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
