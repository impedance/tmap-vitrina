declare global {
    interface Window {
        Telegram?: any;
    }
}

/**
 * Initializes a mock WebApp environment if it's not present (e.g. running in a normal browser).
 */
export const initTelegramAdapter = () => {
    if (typeof window !== 'undefined' && !window.Telegram?.WebApp) {
        window.Telegram = window.Telegram || {};
        window.Telegram.WebApp = {
            initData: 'query_id=mock_query_id&user=%7B%22id%22%3A123%2C%22first_name%22%3A%22Mock%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22mockuser%22%2C%22language_code%22%3A%22en%22%7D',
            initDataUnsafe: {
                query_id: 'mock_query_id',
                user: {
                    id: 123,
                    first_name: 'Mock',
                    last_name: 'User',
                    username: 'mockuser',
                    language_code: 'en'
                }
            },
            version: '7.0',
            platform: 'weba',
            colorScheme: 'light',
            themeParams: {
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
                destructive_text_color: '#ff3b30'
            },
            isExpanded: true,
            viewportHeight: window.innerHeight,
            viewportStableHeight: window.innerHeight,
            headerColor: '#ffffff',
            backgroundColor: '#ffffff',
            bottomBarColor: '#ffffff',
            isClosingConfirmationEnabled: false,
            expand: () => { },
            close: () => { },
            ready: () => { },
            sendData: (data: string) => { console.log('Mock WebApp sendData called with:', data); },
            openLink: (url: string) => window.open(url, '_blank'),
            openTelegramLink: (url: string) => window.open(url, '_blank'),
            BackButton: {
                isVisible: false,
                onClick: (_cb: any) => { },
                offClick: (_cb: any) => { },
                show: () => { },
                hide: () => { }
            },
            MainButton: {
                text: 'CONTINUE',
                color: '#2481cc',
                textColor: '#ffffff',
                isVisible: false,
                isActive: true,
                isProgressVisible: false,
                setText: () => { },
                onClick: (_cb: any) => { },
                offClick: (_cb: any) => { },
                show: () => { },
                hide: () => { },
                enable: () => { },
                disable: () => { },
                showProgress: () => { },
                hideProgress: () => { },
                setParams: () => { }
            },
            HapticFeedback: {
                impactOccurred: () => { },
                notificationOccurred: () => { },
                selectionChanged: () => { }
            }
        } as any;

        // Set CSS variables for browser fallback explicitly
        const root = document.documentElement;
        Object.entries(window.Telegram.WebApp.themeParams).forEach(([key, value]) => {
            const cssKey = `--tg-theme-${key.replace(/_/g, '-')}`;
            root.style.setProperty(cssKey, value as string);
        });

        console.log('Telegram WebApp MOCK environment initialized.');
    }
};
