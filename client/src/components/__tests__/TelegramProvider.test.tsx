import React from 'react';
import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TelegramProvider } from '../TelegramProvider';

const mocks = vi.hoisted(() => {
    const mockMounter = () => {
        let mounting = false;
        let mounted = false;

        const mounter = vi.fn().mockImplementation(() => {
            if (mounting) {
                throw new Error('ConcurrentCallError: The component is already mounting');
            }
            mounting = true;
            // For synchronous mounts, we'll just say it's mounted.
            // In React 18 StrictMode, the double render happens synchronously for useEffect.
            return undefined;
        });

        return {
            mount: Object.assign(mounter, {
                isAvailable: vi.fn().mockReturnValue(true),
            }),
            isMounting: vi.fn().mockImplementation(() => mounting),
            isMounted: vi.fn().mockImplementation(() => mounted),
            bindCssVars: Object.assign(vi.fn(), {
                isAvailable: vi.fn().mockReturnValue(true),
            }),
            reset: () => {
                mounting = false;
                mounted = false;
                mounter.mockClear();
            },
        };
    };

    const miniAppMock = mockMounter();
    const themeParamsMock = mockMounter();
    const viewportMock = Object.assign(mockMounter(), {
        expand: Object.assign(vi.fn(), { isAvailable: vi.fn().mockReturnValue(true) }),
    });

    let vpMounting = false;
    viewportMock.mount.mockImplementation(async () => {
        if (vpMounting) {
            throw new Error('ConcurrentCallError: The component is already mounting');
        }
        vpMounting = true;
        return Promise.resolve();
    });

    const backButtonMock = mockMounter();

    return {
        miniAppMock,
        themeParamsMock,
        viewportMock,
        backButtonMock,
        resetVpMounting: () => { vpMounting = false; }
    };
});

vi.mock('@telegram-apps/sdk-react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@telegram-apps/sdk-react')>();
    return {
        ...actual,
        init: vi.fn(),
        isTMA: vi.fn().mockReturnValue(true),
        miniApp: mocks.miniAppMock,
        themeParams: mocks.themeParamsMock,
        viewport: mocks.viewportMock,
        backButton: mocks.backButtonMock,
    };
});

describe('TelegramProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.miniAppMock.reset();
        mocks.themeParamsMock.reset();
        mocks.viewportMock.reset();
        mocks.backButtonMock.reset();
        mocks.resetVpMounting();

        // We want to suppress console.error in tests for expected errors
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    it('renders children correctly', async () => {
        let getByText: any;
        await act(async () => {
            const result = render(
                <TelegramProvider>
                    <div>Test Child</div>
                </TelegramProvider>
            );
            getByText = result.getByText;
            // wait for isReady
            await new Promise(resolve => setTimeout(resolve, 10));
        });
        expect(getByText('Test Child')).toBeTruthy();
    });

    it('does not throw ConcurrentCallError on double mount', async () => {
        await act(async () => {
            render(
                <React.StrictMode>
                    <TelegramProvider>
                        <div>Strict Mode Child</div>
                    </TelegramProvider>
                </React.StrictMode>
            );
            // allow async useEffect to complete
            await new Promise(resolve => setTimeout(resolve, 10));
        });

        // Check that console.error was not called with our specific error message
        // Actually, in the broken implementation, the error SHOULD appear in console.error
        // Wait, the plan says "Убедиться, что тест падает (Red) при текущей имплементации".
        // So the test should FAIL here if the error happens!
        // This means we should expect it NOT to happen, and when it DOES happen, the test fails.
        expect(console.error).not.toHaveBeenCalledWith(
            expect.stringContaining('[TMA] SDK setup error:'),
            expect.any(Error)
        );
    });
});
