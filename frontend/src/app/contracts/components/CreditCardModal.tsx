"use client";

import { ContractNode } from "../types";
import { RiCloseLine } from "react-icons/ri";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

interface CreditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: ContractNode;
}

export default function CreditCardModal({
  isOpen,
  onClose,
  contract,
}: CreditCardModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isOpen || !isMounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="absolute top-4 right-4 z-50">
        <button
          className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <RiCloseLine className="w-8 h-8 text-white" />
        </button>
      </div>

      <div
        className="relative w-[90vw] max-w-[1000px] h-auto aspect-[16/10] m-4 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/card-bg.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent"></div>
        <div className="absolute top-[8%] left-[5%]">
          <p className="text-white font-bold text-4xl md:text-6xl tracking-wider">
            HAICHANBANK
          </p>
        </div>
        <div className="absolute top-[-3%] right-[3%]">
          <img
            src="/mastercard.svg"
            alt="MasterCard"
            className="w-[200px] md:w-[200px] h-auto"
          />
        </div>
        <div className="absolute top-[38%] left-[5%]">
          <img
            src="/chip.png"
            alt="Card Chip"
            className="w-[150px] md:w-[150px] h-auto object-contain drop-shadow-md"
          />
        </div>
        <div className="absolute top-[38%] left-[21%]">
          <img
            src="/contactless-indicator.png"
            alt="Contactless"
            className="w-[90px] md:w-[90px] h-auto opacity-80"
          />
        </div>
        <div className="absolute top-[60%] left-[5%] right-[5%]">
          <p className="font-['OCR-A'] text-[5vmin] md:text-[5vmin] text-white tracking-[0.15em] whitespace-nowrap overflow-hidden">
            {contract.oracleData?.CARD_NUMBER
              ? contract.oracleData.CARD_NUMBER.replace(
                  /(\d{4})/g,
                  "$1 "
                ).trim()
              : "1000 0101 3559 6630"}
          </p>
        </div>
        <div className="absolute bottom-[8%] left-[5%]">
          <p className="text-lg md:text-xl text-white/80 uppercase tracking-wider mb-2">
            CARD HOLDER
          </p>
          <p className="text-white uppercase font-medium text-2xl md:text-4xl">
            {contract.oracleData?.TR_FIRST_NAM &&
            contract.oracleData?.TR_LAST_NAM
              ? `${contract.oracleData.TR_FIRST_NAM} ${contract.oracleData.TR_LAST_NAM}`
              : "NAM DINH"}
          </p>
        </div>
        <div className="absolute bottom-[8%] right-[5%] text-right">
          <p className="text-lg md:text-xl text-white/80 uppercase tracking-wider mb-2">
            EXPIRES
          </p>
          <p className="text-white font-medium text-2xl md:text-4xl">MM/YY</p>
        </div>
      </div>
    </div>,
    document.body
  );
}
