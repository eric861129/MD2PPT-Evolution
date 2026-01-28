import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'brand' | 'product' | 'action' | 'secondary' | 'outline-white' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'product', 
  isLoading,
  disabled,
  ...props 
}) => {
  const baseStyles = "flex items-center justify-center gap-2 px-5 py-2 text-sm font-bold rounded-lg transition-all duration-200 active:scale-95 disabled:active:scale-100 disabled:cursor-not-allowed disabled:opacity-50";
  
  const variants = {
    // Master Brand (Amber)
    brand: "bg-[var(--brand-primary)] hover:opacity-90 text-white shadow-sm",
    // MD2PPT Product Action (Energetic Coral)
    product: "bg-[var(--product-primary)] hover:bg-[var(--product-hover)] text-white shadow-[0_10px_30px_var(--product-glow)]",
    // 對比藍色 (用於匯出 - 保持原樣或視情況調整)
    action: "bg-[#004578] hover:bg-[#002050] text-white shadow-lg",
    // 中性灰
    secondary: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700",
    // 用於 Header 上的半透明按鈕
    "outline-white": "bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm",
    // 危險操作
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
};