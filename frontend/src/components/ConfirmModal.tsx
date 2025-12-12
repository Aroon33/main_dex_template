"use client";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  amount: string | number;
}

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  amount,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/60 border border-white/10 p-6 rounded-2xl shadow-xl w-full max-w-sm">

        <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>

        <p className="text-gray-300 text-center mb-6">
          {amount} ETH を実行しますか？
        </p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="w-1/2 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="w-1/2 p-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 transition"
          >
            Confirm
          </button>
        </div>

      </div>
    </div>
  );
}
