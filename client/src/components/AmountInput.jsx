import React, { useMemo, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const AmountInput = ({
  name = 'amount',
  value = '',
  onChange,
  placeholder = '0.00',
  required = false,
  min = 0,
  defaultMax = 50000,
  step = 10,
  className = '',
  id,
}) => {
  const inputRef = useRef(null);
  const { isDark } = useTheme();

  // Convert current value to numeric representation for the slider
  const numericValue = useMemo(() => {
    if (value === '' || value === null || value === undefined) return 0;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }, [value]);

  // Dynamically scale slider maximum if the user manually types a higher amount
  const sliderMax = useMemo(() => {
    if (numericValue > defaultMax) {
      return Math.ceil((numericValue * 1.25) / 1000) * 1000;
    }
    return defaultMax;
  }, [numericValue, defaultMax]);

  // Calculate track progress fill percentage
  const percentage = useMemo(() => {
    if (sliderMax <= min) return 0;
    const boundedVal = Math.min(Math.max(numericValue, min), sliderMax);
    return Math.round(((boundedVal - min) / (sliderMax - min)) * 100);
  }, [numericValue, min, sliderMax]);

  // Handle direct manual typing in the text/number input
  const handleManualInputChange = (e) => {
    const rawValue = e.target.value;
    // Allow empty string, digits, and an optional single decimal point
    if (rawValue === '' || /^\d*\.?\d*$/.test(rawValue)) {
      if (onChange) {
        onChange(e);
      }
    }
  };

  // Keyboard arrow keys support for fine-tuning
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const delta = e.key === 'ArrowUp' ? (e.shiftKey ? 100 : 10) : (e.shiftKey ? -100 : -10);
      const current = parseFloat(value) || 0;
      const next = Math.max(min, Math.round((current + delta) * 100) / 100);
      if (onChange) {
        onChange({
          target: {
            name,
            value: next > 0 ? next.toString() : '',
          },
        });
      }
    }
  };

  // Handle optional slider adjustment
  const handleSliderChange = (e) => {
    const sliderVal = e.target.value;
    if (onChange) {
      onChange({
        target: {
          name,
          value: sliderVal,
        },
      });
    }
  };

  // Clicking the input container focuses the text input
  const handleContainerClick = (e) => {
    if (e.target.tagName !== 'INPUT' || e.target.type !== 'range') {
      inputRef.current?.focus();
    }
  };

  const activeTrackColor = isDark ? '#10b981' : '#0f172a';
  const inactiveTrackColor = isDark ? '#334155' : '#e2e8f0';

  return (
    <div
      onClick={handleContainerClick}
      className={`relative flex items-center w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-slate-900 dark:focus-within:ring-emerald-500 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:border-transparent transition-all cursor-text group ${className}`}
    >
      {/* Currency Symbol Prefix */}
      <span className="pl-3.5 pr-1 text-slate-400 dark:text-slate-500 text-sm font-semibold select-none pointer-events-none">
        ₹
      </span>

      {/* Direct Manual Number Input (Full Keyboard Support, Select/Delete/Type) */}
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        name={name}
        id={id || name}
        value={value ?? ''}
        onChange={handleManualInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        className="w-full min-w-0 bg-transparent py-2.5 pr-2 pl-0.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none font-medium selection:bg-slate-200 dark:selection:bg-slate-700"
      />

      {/* Optional Secondary Horizontal Slider */}
      <div
        className="flex items-center gap-1.5 pr-3 pl-2 shrink-0 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="range"
          min={min}
          max={sliderMax}
          step={step}
          value={Math.min(Math.max(numericValue, min), sliderMax)}
          onChange={handleSliderChange}
          title={`Adjust amount: ₹${numericValue}`}
          aria-label="Optional amount slider"
          className="amount-slider w-20 sm:w-28"
          style={{
            background: `linear-gradient(to right, ${activeTrackColor} 0%, ${activeTrackColor} ${percentage}%, ${inactiveTrackColor} ${percentage}%, ${inactiveTrackColor} 100%)`,
          }}
        />
      </div>
    </div>
  );
};

export default AmountInput;
