import { isTMA, mockTelegramEnv } from '@telegram-apps/sdk';

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

    if (!isTMA()) {
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
    }
};
