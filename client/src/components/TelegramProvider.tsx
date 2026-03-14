import React, { useEffect, useState, useRef } from 'react';
import {
    init,
    miniApp,
    themeParams,
    viewport,
    backButton,
} from '@telegram-apps/sdk-react';

/**
 * Check if we're running inside the actual Telegram WebApp (not just with the script loaded).
 * Returns true only if Telegram.WebApp exists AND has valid initData (meaning we're actually in Telegram).
 */
const isActualTelegramEnv = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    // Check if Telegram WebApp object exists and has initData (real Telegram env)
    const tg = (window as unknown as { Telegram?: { WebApp?: { initData?: string } } }).Telegram;
    return !!(tg?.WebApp?.initData);
};

export const TelegramProvider = ({ children }: { children: React.ReactNode }) => {
    // Check if we log inside the telegram app or browser.
    const isTelegramEnv = isActualTelegramEnv();
    const [isReady, setIsReady] = useState(false);
    const didInit = useRef(false);

    useEffect(() => {
        if (didInit.current) return;
        didInit.current = true;

        const setup = async () => {
            try {
                // init() sets up event listeners.
                init({ acceptCustomStyles: true });

                // Mount components sequentially and securely checking state
                if (miniApp.mount.isAvailable() && !miniApp.isMounted() && !miniApp.isMounting()) {
                    miniApp.mount();
                }
                if (miniApp.bindCssVars.isAvailable()) {
                    miniApp.bindCssVars();
                }

                if (themeParams.mount.isAvailable() && !themeParams.isMounted() && !themeParams.isMounting()) {
                    themeParams.mount();
                }
                if (themeParams.bindCssVars.isAvailable()) {
                    themeParams.bindCssVars();
                }

                // Viewport mount is async. We avoid double mounting by checking isMounting()
                if (viewport.mount.isAvailable() && !viewport.isMounted() && !viewport.isMounting()) {
                    await viewport.mount();
                }
                if (viewport.isMounted()) {
                    if (viewport.bindCssVars.isAvailable()) {
                        viewport.bindCssVars();
                    }
                    if (viewport.expand.isAvailable()) {
                        viewport.expand();
                    }
                }

                if (backButton.mount.isAvailable() && !backButton.isMounted()) {
                    backButton.mount();
                }

                setIsReady(true);
            } catch (err) {
                console.error('[TMA] SDK setup error:', err);
            }
        };

        setup();
    }, []);

    return (
        <div className="min-h-screen bg-[var(--tg-theme-bg-color,white)] text-[var(--tg-theme-text-color,black)]">
            {isReady ? children : null}
            {!isTelegramEnv && (
                <div className="fixed top-2 right-2 z-[9999] bg-yellow-400 text-black text-[10px] px-2 py-1 rounded font-bold shadow-md uppercase pointer-events-none">
                    Browser Mode
                </div>
            )}
        </div>
    );
};
