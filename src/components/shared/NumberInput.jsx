import { formatNumber } from '../../generators/utils';

export function NumberInput({ value, onChange, disabled, autoFocus, placeholder = "?", size = "md", onKeyDown }) {
  const sizeClasses = {
    sm: "w-28 text-xl py-2",
    md: "w-48 text-3xl py-3",
    lg: "w-80 text-5xl py-4",
  };

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    onChange(rawValue);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={formatNumber(value)}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      disabled={disabled}
      autoFocus={autoFocus}
      placeholder={placeholder}
      className={`${sizeClasses[size]} text-center font-black bg-white border-4 border-blue-100 rounded-3xl outline-none focus:border-blue-500 focus:ring-8 focus:ring-blue-500/10 transition-all text-blue-600 shadow-inner`}
    />
  );
}
