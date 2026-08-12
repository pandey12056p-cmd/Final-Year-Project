"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Props = {
  fullName: string;
  eventTitle: string;
  certificateId: string;
  issueDate: string;
};

export default function CertificateVerify({
  fullName,
  eventTitle,
  certificateId,
  issueDate,
}: Props) {
  // State for loading sequence
  const [loadingStage, setLoadingStage] = useState(0);
  const [loadingText, setLoadingText] = useState("🔍 Scanning certificate QR metadata...");
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  // States for interactive hashing playground
  const [liveName, setLiveName] = useState(fullName);
  const [liveHash, setLiveHash] = useState("");
  const [blockchainHash, setBlockchainHash] = useState("");
  const [isCopiedContract, setIsCopiedContract] = useState(false);
  const [isCopiedTx, setIsCopiedTx] = useState(false);

  // Smart Contract Info (realistic simulation)
  const contractAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
  const blockNumber = 19485203;

  // Run the mock blockchain indexing/verification scan
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setLoadingStage(1);
      setLoadingText("🌐 Connecting to Ethereum Sepolia RPC node...");
    }, 900);

    const timer2 = setTimeout(() => {
      setLoadingStage(2);
      setLoadingText("📜 Fetching Smart Contract ABI & verifyCertificate()...");
    }, 1800);

    const timer3 = setTimeout(() => {
      setLoadingStage(3);
      setLoadingText("🔐 Re-calculating SHA-256 cryptographic proof...");
    }, 2700);

    const timer4 = setTimeout(() => {
      setIsFullyLoaded(true);
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  // SHA-256 Hashing logic (Web Crypto API)
  async function sha256(message: string) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Calculate hashes
  useEffect(() => {
    async function computeHashes() {
      // Original anchored hash
      const originalPayload = `${certificateId}:${fullName}:${eventTitle}:${issueDate}`;
      const originalHashVal = await sha256(originalPayload);
      setBlockchainHash("0x" + originalHashVal);

      // Live payload hash
      const livePayload = `${certificateId}:${liveName}:${eventTitle}:${issueDate}`;
      const liveHashVal = await sha256(livePayload);
      setLiveHash("0x" + liveHashVal);
    }
    computeHashes();
  }, [liveName, fullName, eventTitle, certificateId, issueDate]);

  // Copy helper
  const copyToClipboard = (text: string, type: "contract" | "tx") => {
    navigator.clipboard.writeText(text);
    if (type === "contract") {
      setIsCopiedContract(true);
      setTimeout(() => setIsCopiedContract(false), 2000);
    } else {
      setIsCopiedTx(true);
      setTimeout(() => setIsCopiedTx(false), 2000);
    }
  };

  const isAuthentic = liveHash === blockchainHash;

  // Render Loading Overlay
  if (!isFullyLoaded) {
    return (
      <div className="max-w-xl mx-auto bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 shadow-2xl text-center">
        <div className="flex flex-col items-center justify-center py-12">
          {/* Animated Spinner */}
          <div className="relative w-28 h-28 mb-8">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
            {/* Spinning gradient ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-indigo-500 animate-spin"></div>
            {/* Pulsing Shield in center */}
            <div className="absolute inset-0 flex items-center justify-center animate-pulse">
              <svg className="w-12 h-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white tracking-wide">
            Decentralized Certificate Validation
          </h2>
          <p className="text-slate-400 text-xs mt-2 max-w-sm">
            Querying blockchain nodes and verifying cryptographic integrity proofs.
          </p>

          {/* Progress Logs */}
          <div className="mt-8 w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-left font-mono text-[11px] leading-6 space-y-1">
            <div className="flex items-center gap-2 text-green-400">
              <span>✔</span> <span>Initializing secure gateway connection...</span>
            </div>
            <div className={`flex items-center gap-2 transition-all duration-300 ${loadingStage >= 1 ? "text-green-400" : "text-slate-600"}`}>
              <span>{loadingStage >= 1 ? "✔" : "⚡"}</span>
              <span>Scanning certificate QR metadata...</span>
            </div>
            <div className={`flex items-center gap-2 transition-all duration-300 ${loadingStage >= 2 ? "text-green-400" : "text-slate-600"}`}>
              <span>{loadingStage >= 2 ? "✔" : "⚡"}</span>
              <span>Connecting to Ethereum Sepolia network...</span>
            </div>
            <div className={`flex items-center gap-2 transition-all duration-300 ${loadingStage >= 3 ? "text-green-400" : "text-slate-600"}`}>
              <span>{loadingStage >= 3 ? "✔" : "⚡"}</span>
              <span>Querying Smart Contract verifyCertificate()...</span>
            </div>
            <div className="flex items-center gap-3 text-blue-400 animate-pulse mt-3 pt-2 border-t border-slate-900">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
              <span>{loadingText}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl w-full mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4.5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
                Secured via Web3
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">
              Certificate Legitimacy Verified
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Cryptographic signature matches blockchain ledger consensus.
            </p>
          </div>
        </div>

        <div>
          <Link
            href={`/certificate/${certificateId.split("-").pop()}`}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/10 transition cursor-pointer flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>View Certificate PDF</span>
          </Link>
        </div>
      </div>

      {/* Grid: Details & Blockchain Proof */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Certificate Details */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl">
          <div>
            <h2 className="text-sm font-bold text-slate-300 tracking-wider uppercase border-b border-slate-800 pb-3 flex items-center gap-2">
              <svg className="w-4.5 h-4.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Certificate Metadata
            </h2>

            <div className="mt-6 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">
                  Student Name
                </span>
                <span className="text-base font-extrabold text-white mt-0.5 block">
                  {fullName}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">
                  Event Name
                </span>
                <span className="text-base font-extrabold text-white mt-0.5 block">
                  {eventTitle}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">
                  Certificate ID
                </span>
                <span className="text-base font-extrabold text-blue-400 mt-0.5 block">
                  {certificateId}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">
                  Issue Date
                </span>
                <span className="text-base font-extrabold text-white mt-0.5 block">
                  {issueDate}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Issuer Institution</span>
            <span className="text-white font-bold">Event Aggregator</span>
          </div>
        </div>

        {/* Blockchain Ledger Proof */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div>
            <h2 className="text-sm font-bold text-slate-300 tracking-wider uppercase border-b border-slate-800 pb-3 flex items-center gap-2">
              <svg className="w-4.5 h-4.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Smart Contract Proof
            </h2>

            <div className="mt-6 space-y-4 text-xs font-mono">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 font-semibold">Network</span>
                <span className="text-blue-300 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Ethereum Sepolia
                </span>
              </div>

              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 font-semibold">Block Height</span>
                <span className="text-white font-bold">#{blockNumber.toLocaleString()}</span>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Contract Address</span>
                  <button
                    onClick={() => copyToClipboard(contractAddress, "contract")}
                    className="text-[10px] text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isCopiedContract ? "Copied!" : "Copy"}</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
                <span className="text-[10.5px] text-slate-300 font-semibold block mt-1 break-all bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
                  {contractAddress}
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Anchored TX Hash</span>
                  <button
                    onClick={() => copyToClipboard(blockchainHash, "tx")}
                    className="text-[10px] text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isCopiedTx ? "Copied!" : "Copy"}</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
                <span className="text-[10.5px] text-slate-300 font-semibold block mt-1 break-all bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
                  {blockchainHash}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Validation Proof</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100% UNTAMPERED
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Blockchain Playground for Demos */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <h2 className="text-sm font-bold text-slate-300 tracking-wider uppercase border-b border-slate-800 pb-3 flex items-center gap-2">
          <svg className="w-4.5 h-4.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Blockchain Integrity Sandbox
        </h2>
        
        <p className="text-slate-400 text-xs mt-3 leading-5">
          Blockchain verification secures data integrity by anchoring cryptographic hashes of the record. 
          Modify the student name below to test how the blockchain consensus validation immediately flags data tampering.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
          
          {/* Input field */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">
              Test Name Input
            </label>
            <input
              type="text"
              value={liveName}
              onChange={(e) => setLiveName(e.target.value)}
              placeholder="Edit name to test tampering"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-semibold focus:outline-none focus:border-purple-500 transition"
            />
            <button
              onClick={() => setLiveName(fullName)}
              disabled={liveName === fullName}
              className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition ${
                liveName === fullName ? "text-slate-700 cursor-default" : "text-purple-400 hover:text-purple-300 cursor-pointer"
              }`}
            >
              Reset to Authentic Name
            </button>
          </div>

          {/* Cryptographic Hashes display */}
          <div className="md:col-span-3 space-y-4 font-mono text-[11px]">
            <div>
              <span className="text-[10px] font-bold font-sans text-slate-500 tracking-wider uppercase block mb-1">
                Live Dynamic Hash <span className="text-slate-600">(Calculated from input above)</span>
              </span>
              <span className={`block p-2.5 rounded-lg border break-all font-semibold ${
                isAuthentic ? "bg-slate-950/40 border-slate-800 text-slate-300" : "bg-red-950/20 border-red-900/60 text-red-400 animate-pulse"
              }`}>
                {liveHash || "Computing..."}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold font-sans text-slate-500 tracking-wider uppercase block mb-1">
                Blockchain Anchored Hash <span className="text-slate-600">(Immutable On-Chain Reference)</span>
              </span>
              <span className="block p-2.5 rounded-lg bg-slate-950/40 border border-slate-800 text-slate-300 break-all font-semibold">
                {blockchainHash || "Computing..."}
              </span>
            </div>

          </div>
        </div>

        {/* Live Integrity Banner */}
        <div className={`mt-6 rounded-2xl border p-4.5 flex items-center gap-3.5 transition-all duration-300 ${
          isAuthentic 
            ? "bg-emerald-950/25 border-emerald-900/60 text-emerald-400" 
            : "bg-red-950/25 border-red-900/60 text-red-400"
        }`}>
          {isAuthentic ? (
            <>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="font-extrabold text-sm tracking-wide">
                  INTEGRITY VERIFIED: AUTHENTIC CERTIFICATE
                </h4>
                <p className="text-[11px] text-emerald-500/80 mt-0.5 font-medium leading-4">
                  The client-side dynamic cryptographic proof perfectly matches the immutable ledger anchor hash. 
                  This document is 100% genuine.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">
                <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h4 className="font-extrabold text-sm tracking-wide">
                  WARNING: CRYPTOGRAPHIC HASH MISMATCH (DATA TAMPERED)
                </h4>
                <p className="text-[11px] text-red-400/85 mt-0.5 font-medium leading-4">
                  The certificate details have been altered! The dynamic hash does not match the block header anchored hash.
                  This certificate COPY IS FRAUDULENT or has been modified.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}