'use client';

import React from 'react';
import { Wallet, X } from 'lucide-react';

export type WalletType = 'wepin' | 'metamask';

interface WalletSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletType: WalletType) => void;
  isConnecting: boolean;
}

export const WalletSelectionModal: React.FC<WalletSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectWallet,
  isConnecting
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Connect Wallet</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onSelectWallet('wepin')}
            disabled={isConnecting}
            className="w-full p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-3 text-white transition-all disabled:opacity-50"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Wallet size={16} />
            </div>
            <div className="text-left">
              <div className="font-medium">Wepin Wallet</div>
              <div className="text-sm text-slate-400">Social login & easy setup</div>
            </div>
          </button>

          <button
            onClick={() => onSelectWallet('metamask')}
            disabled={isConnecting}
            className="w-full p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-3 text-white transition-all disabled:opacity-50"
          >
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <Wallet size={16} />
            </div>
            <div className="text-left">
              <div className="font-medium">MetaMask</div>
              <div className="text-sm text-slate-400">Browser extension wallet</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};