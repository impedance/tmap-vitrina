import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import * as api from './utils/api';
import { TelegramProvider } from './components/TelegramProvider';
import { CartProvider } from './store/CartStore';

vi.mock('@telegram-apps/sdk-react', () => {
    // Helper for SDK methods that have .isAvailable()
    const makeAvailableFn = (impl = () => { }) => {
        const fn = impl as any;
        fn.isAvailable = () => true;
        return fn;
    };

    return {
        miniApp: {
            isMounted: () => true,
            state: () => ({}),
            mount: makeAvailableFn(),
            bindCssVars: makeAvailableFn()
        },
        themeParams: {
            isMounted: () => true,
            isMounting: () => false,
            state: () => ({ bg_color: '#ffffff' }),
            mount: makeAvailableFn(),
            bindCssVars: makeAvailableFn()
        },
        viewport: {
            isMounted: () => true,
            isExpanded: () => true,
            height: () => 800,
            mount: makeAvailableFn(async () => { }),
            bindCssVars: makeAvailableFn(),
            expand: makeAvailableFn()
        },
        backButton: {
            isMounted: () => true,
            mount: makeAvailableFn(),
            hide: () => { },
            show: () => { },
            onClick: () => { }
        },
        isTMA: () => true,
        init: () => { },
    };
});


describe('App Blackbox Test', () => {
    it('should render the app and load the catalog', async () => {
        // Mock the API response for products
        vi.spyOn(api.api, 'get').mockResolvedValueOnce({
            data: [
                { id: 1, title: 'Test Product', price: 100, images: '[]', badges: '[]', features: '[]' }
            ]
        });

        render(
            <TelegramProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </TelegramProvider>
        );

        // After loading, "Поиск шоколада..." input from Catalog should be present
        await waitFor(() => {
            expect(screen.getByPlaceholderText(/Поиск шоколада/i)).toBeTruthy();
        });
    });
});
