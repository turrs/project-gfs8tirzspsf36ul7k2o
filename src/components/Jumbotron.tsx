import React from 'react';

const Jumbotron: React.FC = () => (
  <div className="bg-[#1C1C28] border-[#2A2A3A] rounded-2xl p-8 shadow-lg flex flex-col justify-center items-start h-full">
    <h1 className="text-3xl font-bold text-[#9AE462] mb-4">
      "A simple DEX for Solana because swapping shouldn't require a DeFi degree."
    </h1>
    <p className="text-lg text-white mb-4">
      Swapping tokens on Solana should be simple, fast, and fun.
    </p>
    <ul className="list-disc pl-5 text-white space-y-2">
      <li>
        <span className="font-semibold text-[#9AE462]">Why Jup-suck?</span> Jupiter is powerful, but its complex UI can overwhelm beginners. We built Jup-suck to make swapping easy for everyone.
      </li>
      <li>
        <span className="font-semibold text-[#9AE462]">Simple &amp; Clean:</span> No clutter, no confusion. Just pick your tokens and swap instantly.
      </li>
      <li>
        <span className="font-semibold text-[#9AE462]">Powered by Jupiter Aggregator:</span> Get the best rates on Solana, with a user-friendly experience.
      </li>
    </ul>
    <p className="text-white mt-6 text-sm">
      Built for the community.
    </p>
  </div>
);

export default Jumbotron;