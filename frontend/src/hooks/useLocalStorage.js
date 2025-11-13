import { useState, useEffect, useRef } from "react";

/**
 * useLocalStorage – Premium Persistent State Hook
 *
 * ✔ Stable across tabs (real-time sync)
 * ✔ Debounced writes (fewer disk operations)
 * ✔ Safe JSON parsing (prevents crashes)
 * ✔ Supports storage schema versioning
 * ✔ Auto-recovers when storage is corrupted
 *
 * @param {string} key  - LocalStorage key
 * @param {*} initialValue - Default value
 * @param {number} version - Schema version (optional)
 */
export default function useLocalStorage(key, initialValue, version = 1) {
  const writeTimer = useRef(null);

  /**
   * Read + validate stored value
   */
  const readValue = () => {
    if (typeof window === "undefined") return initialValue;

    try {
      const raw = localStorage.getItem(key);
      if (!raw) return initialValue;

      const parsed = JSON.parse(raw);

      // If structure version is outdated → reset storage
      if (parsed?.__v !== version) return initialValue;

      return parsed.value;
    } catch (err) {
      console.warn(`⚠️ Storage corrupted for key "${key}". Resetting…`, err);
      return initialValue;
    }
  };

  const [value, setValue] = useState(readValue);

  /**
   * Write updates → debounced for performance
   */
  const writeValue = (data) => {
    if (writeTimer.current) clearTimeout(writeTimer.current);

    writeTimer.current = setTimeout(() => {
      try {
        const wrapped = {
          __v: version,
          value: data,
        };
        localStorage.setItem(key, JSON.stringify(wrapped));
      } catch (err) {
        console.warn(`⚠️ Failed to write "${key}" to LocalStorage`, err);
      }
    }, 80); // slight delay improves responsiveness
  };

  /**
   * Update localStorage whenever value changes
   */
  useEffect(() => {
    writeValue(value);
    return () => clearTimeout(writeTimer.current);
  }, [value]);

  /**
   * Sync across tabs / windows
   */
  useEffect(() => {
    const syncHandler = (event) => {
      if (event.key !== key) return;
      try {
        const parsed = event.newValue ? JSON.parse(event.newValue) : null;

        if (!parsed) {
          setValue(initialValue);
        } else if (parsed.__v === version) {
          setValue(parsed.value);
        }
      } catch (err) {
        console.warn(`⚠️ Failed to sync key "${key}"`, err);
      }
    };

    window.addEventListener("storage", syncHandler);
    return () => window.removeEventListener("storage", syncHandler);
  }, [key, version, initialValue]);

  return [value, setValue];
}
