import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 's' | 'm' | 'l';
    loading?: boolean;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'm',
    loading,
    fullWidth,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 cursor-pointer';

    const variants = {
        primary: 'bg-primary text-on-primary',
        secondary: 'bg-surface text-primary',
        outline: 'bg-transparent border border-primary text-primary',
        ghost: 'bg-transparent text-primary hover:bg-surface',
    };

    const sizes = {
        s: 'px-3 py-1.5 text-caption rounded-s',
        m: 'px-4 py-2.5 text-body rounded-m',
        l: 'px-6 py-4 text-body-plus rounded-l',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : null}
            {children}
        </button>
    );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color }) => (
    <span
        className="px-2 py-0.5 rounded-s text-[10px] font-bold uppercase tracking-wider bg-accent text-on-primary truncate max-w-[100px]"
        style={color ? { backgroundColor: color } : {}}
    >
        {children}
    </span>
);

export const Chip: React.FC<{ label: string; active?: boolean; onClick?: () => void }> = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 rounded-full text-caption border transition-colors cursor-pointer ${active
                ? 'bg-primary border-primary text-on-primary'
                : 'bg-surface border-transparent text-text'
            }`}
    >
        {label}
    </button>
);
