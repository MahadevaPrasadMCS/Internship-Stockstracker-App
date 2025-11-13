// src/components/PriceRangeSelector.jsx
import React from "react";
import { motion } from "framer-motion";

const ranges = ["1D", "5D", "1M", "3M", "1Y", "ALL"];

export default function PriceRangeSelector({ value, onChange }) {
  return (
    <div
      className="
        flex flex-wrap gap-2
        bg-gray-900/20 dark:bg-gray-700/30 
        px-2 py-1 rounded-lg border border-gray-300/40 dark:border-gray-600/40
      "
      style={{ maxWidth: "100%" }} // prevents overflow
    >
      {ranges.map((r) => {
        const active = value === r;

        return (
          <motion.button
            key={r}
            onClick={() => onChange(r)}
            className={`
              px-3 py-1 text-xs font-semibold rounded-md transition 
              ${active 
                ? "bg-indigo-600 text-white shadow-sm" 
                : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200/40 dark:hover:bg-gray-700/40"
              }
            `}
            whileTap={{ scale: 0.92 }}
          >
            {r}
          </motion.button>
        );
      })}
    </div>
  );
}
