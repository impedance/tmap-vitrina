import { useMemo, useEffect } from 'react';
import { init, miniApp, viewport, themeParams, backButton } from '@telegram-apps/sdk';

// Initialize the SDK
try {
    init();
} catch (e) {
    console.error('Failed to init Telegram SDK', e);
}

export const TelegramProvider = ({ children }: { children: React.ReactNode }) => {
    const isTelegram = useMemo(() => {
        return window.location.hash.includes('tgWebAppData') || window.location.search.includes('tgWebApp');
    }, []);

    useEffect(() => {
        if (isTelegram) {
            try {
                // Mount components
                if (miniApp.mount.isAvailable()) miniApp.mount();
                if (themeParams.mount.isAvailable()) themeParams.mount();
                if (viewport.mount.isAvailable()) {
                    viewport.mount().then(() => {
                        viewport.expand();
                    }).catch(e => console.error('Viewport mount error', e));
                }

                if (backButton.mount.isAvailable()) {
                    backButton.mount();
                }
            } catch (e) {
                console.error('Error during Telegram SDK component mounting:', e);
            }
        }
    }, [isTelegram]);

    return (
        <div className="min-h-screen bg-[var(--tg-theme-bg-color,white)] text-[var(--tg-theme-text-color,black)]">
            {children}
            {!isTelegram && (
                <div className="fixed top-2 right-2 z-[9999] bg-yellow-400 text-black text-[10px] px-2 py-1 rounded font-bold shadow-md uppercase pointer-events-none">
                    Browser Mode
                </div>
            )}
        </div>
    );
};
