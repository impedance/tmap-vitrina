/**
 * TelegramProvider — SDK v3 correct implementation
 *
 * Architecture:
 * - init() is called in useEffect on mount. It returns a cleanup fn, which we return from
 *   useEffect to run on unmount (React 18 Strict Mode calls this correctly).
 * - We mount each component (miniApp, themeParams, viewport, backButton) only once, and
 *   unmount them in the cleanup to prevent ConcurrentCallError on re-mount.
 * - isTMA() from @telegram-apps/sdk detects the real Telegram environment.
 *   In browser mode, mockTelegramEnv() (called in telegramAdapter.ts before this renders)
 *   seeds the mock so init() won't throw LaunchParamsRetrieveError.
 */
import { useEffect, useRef } from 'react';
import {
    init,
    isTMA,
    mountMiniApp,
    unmountMiniApp,
    bindMiniAppCssVars,
    mountThemeParams,
    unmountThemeParams,
    bindThemeParamsCssVars,
    mountViewport,
    unmountViewport,
    bindViewportCssVars,
    expandViewport,
    mountBackButton,
    unmountBackButton,
} from '@telegram-apps/sdk';

export const TelegramProvider = ({ children }: { children: React.ReactNode }) => {
    const isTelegramEnv = isTMA();
    const cleanupRef = useRef<VoidFunction | null>(null);

    useEffect(() => {
        const setup = async () => {
            try {
                // init() sets up event listeners & returns a cleanup function.
                // Calling it with proper cleanup prevents double-registration in Strict Mode.
                const cleanupInit = init({ acceptCustomStyles: true });
                cleanupRef.current = cleanupInit;

                // Mount components sequentially, each returns a signal promise.
                // Using the named v3 functions prevents ConcurrentCallError because
                // they incorporate internal mutex-like state checks.
                if (mountMiniApp.isAvailable()) {
                    await mountMiniApp();
                    bindMiniAppCssVars();
                }

                if (mountThemeParams.isAvailable()) {
                    mountThemeParams();
                    bindThemeParamsCssVars();
                }

                if (mountViewport.isAvailable()) {
                    await mountViewport();
                    bindViewportCssVars();
                    if (expandViewport.isAvailable()) {
                        expandViewport();
                    }
                }

                if (mountBackButton.isAvailable()) {
                    mountBackButton();
                }
            } catch (err) {
                console.error('[TMA] SDK setup error:', err);
            }
        };

        setup();

        return () => {
            // Cleanup: unmount all components, then revoke init() listeners.
            // Order matters: unmount before destroying the event bridge.
            try {
                unmountBackButton();
            } catch { /* ignore */ }
            try {
                unmountViewport();
            } catch { /* ignore */ }
            try {
                unmountThemeParams();
            } catch { /* ignore */ }
            try {
                unmountMiniApp();
            } catch { /* ignore */ }

            // Call the cleanup returned by init() to remove event listeners.
            if (cleanupRef.current) {
                cleanupRef.current();
                cleanupRef.current = null;
            }
        };
    }, []); // Empty dep array: run once on mount, cleanup on unmount.

    return (
        <div className="min-h-screen bg-[var(--tg-theme-bg-color,white)] text-[var(--tg-theme-text-color,black)]">
            {children}
            {!isTelegramEnv && (
                <div className="fixed top-2 right-2 z-[9999] bg-yellow-400 text-black text-[10px] px-2 py-1 rounded font-bold shadow-md uppercase pointer-events-none">
                    Browser Mode
                </div>
            )}
        </div>
    );
};
