import React, { useState } from 'react';
import { Minus, Plus, ChevronDown } from 'lucide-react';

interface StepperProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

export const Stepper: React.FC<StepperProps> = ({ value, onChange, min = 0, max = 99 }) => {
    const handleMinus = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (value > min) onChange(value - 1);
    };

    const handlePlus = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (value < max) onChange(value + 1);
    };

    return (
        <div className="flex items-center gap-3 bg-surface rounded-m p-1">
            <button
                onClick={handleMinus}
                disabled={value <= min}
                className="w-8 h-8 flex items-center justify-center rounded-s bg-bg text-text disabled:opacity-30 active:scale-90 transition-transform cursor-pointer"
            >
                <Minus size={16} />
            </button>
            <span className="text-body font-bold min-w-[20px] text-center">{value}</span>
            <button
                onClick={handlePlus}
                disabled={value >= max}
                className="w-8 h-8 flex items-center justify-center rounded-s bg-bg text-text disabled:opacity-30 active:scale-90 transition-transform cursor-pointer"
            >
                <Plus size={16} />
            </button>
        </div>
    );
};

export const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-surface">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-4 flex items-center justify-between text-body-plus font-semibold text-left cursor-pointer"
            >
                {title}
                <ChevronDown
                    size={20}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isOpen && (
                <div className="pb-4 text-body text-hint animate-in fade-in slide-in-from-top-1">
                    {children}
                </div>
            )}
        </div>
    );
};
