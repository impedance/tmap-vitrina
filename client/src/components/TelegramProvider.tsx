import React, { useEffect, useState } from 'react';
import {
    init,
    isTMA,
    miniApp,
    themeParams,
    viewport,
    backButton,
} from '@telegram-apps/sdk-react';

export const TelegramProvider = ({ children }: { children: React.ReactNode }) => {
    // Check if we log inside the telegram app or browser. 
    // We can use isTMA() directly since it checks the environment synchronous.
    const isTelegramEnv = isTMA();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const setup = async () => {
            try {
                // init() sets up event listeners.
                init({ acceptCustomStyles: true });

                // Mount components sequentially and securely checking state
                if (miniApp.mount.isAvailable() && !miniApp.isMounted()) {
                    miniApp.mount();
                }
                if (miniApp.bindCssVars.isAvailable()) {
                    miniApp.bindCssVars();
                }

                if (themeParams.mount.isAvailable() && !themeParams.isMounted()) {
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
