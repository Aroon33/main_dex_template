"use client";

export default function StakePage() {
  return (
    <div className="w-full space-y-10">

      {/* TITLE */}
      <h1
        className="
          text-4xl font-extrabold 
          bg-gradient-to-r from-purple-400 to-blue-400 
          bg-clip-text text-transparent
        "
      >
        Stake & Earn
      </h1>

      {/* MAIN STAKE CARD */}
      <div
        className="
          bg-black/40 backdrop-blur-xl 
          border border-white/10 rounded-2xl 
          p-8 shadow-xl space-y-8
        "
      >
        {/* APR DISPLAY */}
        <div className="text-center space-y-2">
          <p className="text-gray-300">Current APR</p>
          <p className="text-5xl font-extrabold text-white tracking-wide">
            24.8%
          </p>
        </div>

        {/* STAKE INPUT */}
        <div className="space-y-2">
          <label className="text-gray-300 text-sm">Amount to Stake</label>
          <input
            type="number"
            className="
              w-full bg-black/60 border border-white/10 rounded-lg 
              p-3 text-white focus:outline-none
            "
            placeholder="Enter amount"
          />
        </div>

        {/* BUTTONS */}
        <div className="grid grid-cols-2 gap-4">
          {/* STAKE BUTTON */}
          <button
            className="
              p-3 rounded-lg 
              bg-gradient-to-r from-purple-500 to-indigo-600
              hover:opacity-90 transition shadow-lg active:scale-95
            "
          >
            Stake
          </button>

          {/* UNSTAKE BUTTON */}
          <button
            className="
              p-3 rounded-lg 
              bg-gradient-to-r from-gray-600 to-gray-800
              hover:opacity-90 transition shadow-lg active:scale-95
            "
          >
            Unstake
          </button>
        </div>

        {/* INFO BOX */}
        <div
          className="
            bg-black/30 border border-white/10 rounded-xl 
            p-4 text-gray-300 text-sm space-y-1
          "
        >
          <p>Your staked balance: 0.00 PXP</p>
          <p>Rewards will accumulate every block.</p>
        </div>
      </div>

    </div>
  );
}
