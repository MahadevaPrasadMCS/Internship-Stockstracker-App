// src/pages/Dashboard.jsx (Premium Version)
import React, { useState, useEffect, useMemo } from "react";
import SummaryWidget from "../components/SummaryWidget";
import PortfolioTable from "../components/PortfolioTable";
import AddStockModal from "../components/AddStockModal";
import EditStockModal from "../components/EditStockModal";
import PriceChart from "../components/PriceChart";
import PriceRangeSelector from "../components/PriceRangeSelector";

import useStockPrices from "../hooks/useStockPrices";
import usePriceHistory from "../hooks/usePriceHistory";

import {
  getPortfolio,
  addStock,
  updateStock,
  deleteStock,
} from "../api/backendAPI";

import { mergePrices } from "../utils/calculatePL";
import { PlusCircle } from "lucide-react";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [chartSymbol, setChartSymbol] = useState(null);
  const [range, setRange] = useState("1M");
  const [toast, setToast] = useState(null);

  /* ---------------- Load Portfolio ---------------- */
  useEffect(() => {
    (async () => {
      const data = await getPortfolio();
      setItems(data || []);
    })();
  }, []);

  const symbols = useMemo(() => items.map((i) => i.symbol), [items]);

  /* ---------------- Live Prices ---------------- */
  const { prices, isLoading: pricesLoading } = useStockPrices(symbols);
  const mergedItems = useMemo(
    () => mergePrices(items, prices),
    [items, prices]
  );

  /* ---------------- Default Chart Symbol ---------------- */
  useEffect(() => {
    if (!chartSymbol && mergedItems.length) {
      setChartSymbol(mergedItems[0].symbol);
    }
  }, [mergedItems]);

  /* ---------------- Price History for Selected Chart ---------------- */
  const { history, loading: historyLoading } = usePriceHistory(chartSymbol);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2300);
  };

  /* ---------------- CRUD: Add ---------------- */
  async function handleAdd(stock) {
    const newItem = await addStock(stock);
    setItems((prev) => [newItem, ...prev]);
    showToast(`✅ Added ${stock.symbol}`);
  }

  /* ---------------- CRUD: Delete ---------------- */
  async function handleDelete(id) {
    await deleteStock(id);
    setItems((prev) => prev.filter((s) => (s._id || s.id) !== id));
    showToast("🗑️ Stock deleted", "warning");
  }

  /* ---------------- CRUD: Edit ---------------- */
  function handleEdit(stock) {
    setSelectedStock(stock);
    setEditOpen(true);
  }

  async function handleSave(updated) {
    const saved = await updateStock(updated._id || updated.id, updated);
    setItems((prev) => prev.map((s) => (s._id === saved._id ? saved : s)));
    showToast(`✏️ Updated ${saved.symbol}`);
  }

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* ---------------- Header Card ---------------- */}
      <div className="
        flex flex-col sm:flex-row items-center justify-between 
        p-5 rounded-xl border 
        bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 
        backdrop-blur-md shadow 
        dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20
      ">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            My US Portfolio
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Track US equities with real-time P/L and historical performance charts.
          </p>
        </div>

        <button
          onClick={() => setAddOpen(true)}
          className="
            flex items-center gap-2 mt-3 sm:mt-0 
            px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 
            text-white rounded-lg shadow-md btn-glow transition
          "
        >
          <PlusCircle size={18} />
          Add Stock
        </button>
      </div>


      {/* ---------------- Main Grid ---------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ---------------- Left Section ---------------- */}
        <div className="xl:col-span-2 space-y-4">

          {/* Portfolio Table */}
          <div className="
            p-4 rounded-xl border shadow-sm 
            bg-white dark:bg-gray-900/60 backdrop-blur-md
          ">
            <PortfolioTable
              items={mergedItems}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>


        {/* ---------------- Right Section ---------------- */}
        <aside className="space-y-5">

          {/* Summary Widget */}
          <SummaryWidget items={mergedItems} />


          {/* Chart Card */}
          <div
            className="
              p-5 rounded-xl border shadow-sm 
              bg-white dark:bg-gray-900/60 backdrop-blur-md
              transition-all
            "
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Performance Chart
              </h4>

              <div className="flex items-center gap-2">
                {/* Symbol Selector */}
                <select
                  value={chartSymbol ?? ""}
                  onChange={(e) => setChartSymbol(e.target.value)}
                  className="
                    px-2 py-1 rounded-lg border text-sm
                    bg-gray-50 dark:bg-gray-800 dark:border-gray-600
                  "
                >
                  {mergedItems.map((m) => (
                    <option key={m.symbol} value={m.symbol}>
                      {m.symbol}
                    </option>
                  ))}
                </select>

                <PriceRangeSelector value={range} onChange={setRange} />
              </div>
            </div>

            {/* Chart Component */}
            <PriceChart
              rawHistory={history}
              symbol={chartSymbol}
              buyPrice={
                mergedItems.find((i) => i.symbol === chartSymbol)?.buyPrice ?? null
              }
              range={range}
            />
          </div>
        </aside>
      </div>


      {/* ---------------- Modals ---------------- */}
      <AddStockModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
      />
      <EditStockModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        stock={selectedStock}
        onSave={handleSave}
      />

      {/* ---------------- Toast ---------------- */}
      {toast && (
        <div
          className={`
            fixed bottom-6 right-6 px-4 py-2 rounded-lg shadow-lg text-white 
            animate-slideInRight text-sm font-medium
            ${
              toast.type === "error"
                ? "bg-red-600"
                : toast.type === "warning"
                ? "bg-yellow-500"
                : "bg-emerald-600"
            }
          `}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
