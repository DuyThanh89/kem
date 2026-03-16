import React from 'react';

export function NumberInput({ value, onChange, disabled, autoFocus, placeholder = "?", size = "md" }) {
  const sizes = { sm: "w-20", md: "w-28", lg: "w-36" };
  return (
    <input
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      autoFocus={autoFocus}
      placeholder={placeholder}
      className={`${sizes[size]} p-3 text-center font-bold text-2xl border-4 border-blue-400 rounded-2xl outline-none focus:border-blue-600 transition-colors bg-white disabled:bg-gray-100 placeholder-blue-200`}
      style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
    />
  );
}

export function SubmitBar({ fields, onSubmit, submitted }) {
  const canSubmit = !submitted && fields.every(f => String(f).trim() !== "");
  return (
    <button
      onClick={onSubmit}
      disabled={!canSubmit}
      className={`mt-6 w-full py-4 px-6 rounded-2xl font-bold text-xl transition-all shadow-lg transform active:scale-95 ${
        canSubmit 
          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700" 
          : "bg-gray-200 text-gray-400 cursor-not-allowed"
      }`}
    >
      {submitted ? "Đã nộp ✓" : "Xác nhận ✓"}
    </button>
  );
}
