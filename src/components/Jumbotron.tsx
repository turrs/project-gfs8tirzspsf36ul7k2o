import React from 'react';

const Jumbotron: React.FC = () => (
  <div className="bg-[#9AE462] rounded-2xl p-8 shadow-lg flex flex-col justify-center items-start h-full">
    <h1 className="text-3xl font-bold text-black mb-4">Welcome to Jup-suck!</h1>
    <p className="text-lg text-black mb-6">
      "A simple DEX for Solana—because swapping shouldn't require a DeFi degree."
    </p>
    <ul className="list-disc pl-5 text-black">
    Built this DEX because Jupiter, while powerful, is too complex for beginners.
Its interface and overwhelming data often confuse new users.
From 2022 to 2025, Jupiter kept growing in features—but also in complexity.
I wanted a simpler, faster, and more beginner-friendly alternative.
Swapping tokens on Solana should be easy for everyone, not just DeFi experts.


    </ul>
  </div>
);

export default Jumbotron;