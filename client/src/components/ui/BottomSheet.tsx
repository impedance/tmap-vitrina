import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted) return null;

    return createPortal(
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 z-[1000] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sheet */}
            <div
                className={`fixed bottom-0 left-0 right-0 bg-bg z-[1001] rounded-t-l p-6 safe-p-bottom transition-transform duration-300 transform ${isOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}
            >
                {/* Handle */}
                <div className="w-12 h-1.5 bg-surface rounded-full mx-auto mb-6" />

                <div className="flex items-center justify-between mb-4">
                    {title && <h2 className="text-h3 font-bold">{title}</h2>}
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-surface text-text active:scale-90 transition-transform"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </>,
        document.body
    );
};
