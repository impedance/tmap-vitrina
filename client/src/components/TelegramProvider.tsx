import React, { useEffect, useState, useRef } from 'react';
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
    const didInit = useRef(false);

    useEffect(() => {
        if (didInit.current) return;
        didInit.current = true;

        const setup = async () => {
            console.log('[TMA] Starting SDK setup...');
            try {
                // init() sets up event listeners.
                console.log('[TMA] Calling init()...');
                init({ acceptCustomStyles: true });
                console.log('[TMA] init() success');

                // Mount components sequentially and securely checking state
                console.log('[TMA] Mounting miniApp...');
                if (miniApp.mount.isAvailable() && !miniApp.isMounted() && !miniApp.isMounting()) {
                    miniApp.mount();
                }
                if (miniApp.bindCssVars.isAvailable()) {
                    miniApp.bindCssVars();
                }
                console.log('[TMA] miniApp stage done');

                console.log('[TMA] Mounting themeParams...');
                if (themeParams.mount.isAvailable() && !themeParams.isMounted() && !themeParams.isMounting()) {
                    themeParams.mount();
                }
                if (themeParams.bindCssVars.isAvailable()) {
                    themeParams.bindCssVars();
                }
                console.log('[TMA] themeParams stage done');

                // Viewport mount is async and can hang on some iOS versions.
                console.log('[TMA] Mounting viewport (async)...');
                if (viewport.mount.isAvailable() && !viewport.isMounted() && !viewport.isMounting()) {
                    // Primitive timeout for viewport mount
                    const mountPromise = viewport.mount();
                    const timeoutPromise = new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Viewport mount timeout')), 3000)
                    );

                    try {
                        await Promise.race([mountPromise, timeoutPromise]);
                        console.log('[TMA] viewport mount success');
                    } catch (e) {
                        console.warn('[TMA] viewport mount failed or timed out:', e);
                    }
                }

                if (viewport.isMounted()) {
                    if (viewport.bindCssVars.isAvailable()) {
                        viewport.bindCssVars();
                    }
                    if (viewport.expand.isAvailable()) {
                        viewport.expand();
                    }
                }

                console.log('[TMA] Mounting backButton...');
                if (backButton.mount.isAvailable() && !backButton.isMounted()) {
                    backButton.mount();
                }

                console.log('[TMA] SDK setup completed successfully.');
                setIsReady(true);
            } catch (err) {
                console.error('[TMA] SDK setup error:', err);
                // Fail gracefully: show app even if SDK fails
                setIsReady(true);
            }
        };

        // Emergency fallback: if setup hangs for more than 5s, show the app anyway
        const fallbackId = setTimeout(() => {
            if (!isReady) {
                console.warn('[TMA] Emergency fallback triggered: SDK setup taking too long.');
                setIsReady(true);
            }
        }, 5000);

        setup();
        return () => clearTimeout(fallbackId);
    }, [isReady]);

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
