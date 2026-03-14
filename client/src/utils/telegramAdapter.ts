import { mockTelegramEnv } from '@telegram-apps/sdk';

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

/**
 * Initializes a mock Telegram Mini App environment using the official SDK utility.
 * This must be called BEFORE calling init() / TelegramProvider renders.
 *
 * In SDK v3, the correct way to simulate TMA in the browser is `mockTelegramEnv`,
 * which seeds the SDK's internal state so it can resolve launch parameters without
 * throwing LaunchParamsRetrieveError.
 */
export const initTelegramAdapter = () => {
    if (typeof window === 'undefined') return;

    // Only mock if we're NOT in actual Telegram (check for real initData, not just script presence)
    if (!isActualTelegramEnv()) {
        // We pass launchParams as a query string for simpler type compliance.
        // Theme params are URL-encoded JSON.
        const themeParams = JSON.stringify({
            bg_color: '#ffffff',
            text_color: '#000000',
            hint_color: '#999999',
            link_color: '#2481cc',
            button_color: '#2481cc',
            button_text_color: '#ffffff',
            secondary_bg_color: '#efeff4',
            header_bg_color: '#ffffff',
            accent_text_color: '#2481cc',
            section_bg_color: '#ffffff',
            destructive_text_color: '#ff3b30',
        });

        const params = new URLSearchParams({
            tgWebAppVersion: '7.0',
            tgWebAppPlatform: 'weba',
            tgWebAppThemeParams: themeParams,
        });

        mockTelegramEnv({ launchParams: params });
        console.log('[TMA] Browser mode: Telegram environment mocked via official SDK utility.');
    } else {
        console.log('[TMA] Running in actual Telegram environment, skipping mock.');
    }
};
