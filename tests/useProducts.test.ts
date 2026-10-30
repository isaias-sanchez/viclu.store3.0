// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useProducts } from '../src/hooks/useProducts';

const { fetchCatalog, snapshot } = vi.hoisted(() => ({
    fetchCatalog: vi.fn(),
    snapshot: [{ id: 'saved', name: 'Gorra guardada', image: '/images/saved.webp' }],
}));
vi.mock('../src/lib/catalog', () => ({ catalogSnapshot: snapshot }));
vi.mock('../src/lib/supabaseClient', () => ({
    supabase: { from: () => ({ select() { return this; }, order() { return this; }, abortSignal: fetchCatalog }) },
}));

beforeEach(() => { vi.useFakeTimers(); fetchCatalog.mockReset(); });
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('catalog availability', () => {
    it('keeps the saved catalog during downtime and automatically recovers after 30 seconds', async () => {
        fetchCatalog.mockResolvedValueOnce({ data: null, error: new Error('paused') })
            .mockResolvedValueOnce({ data: [{ id: 'live', name: 'Gorra actual' }], error: null });
        const { result } = renderHook(useProducts);
        await act(async () => {});
        expect(result.current.products).toEqual(snapshot);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeTruthy();
        await act(async () => { vi.advanceTimersByTime(30000); });
        expect(result.current.products[0].id).toBe('live');
        expect(result.current.error).toBeNull();
        await act(async () => { vi.advanceTimersByTime(90000); });
        expect(fetchCatalog).toHaveBeenCalledTimes(2);
    });

    it('reconnects when the browser comes online', async () => {
        fetchCatalog.mockRejectedValueOnce(new Error('offline')).mockResolvedValue({ data: [], error: null });
        const { result } = renderHook(useProducts);
        await act(async () => {});
        await act(async () => { window.dispatchEvent(new Event('online')); });
        expect(result.current.error).toBeNull();
        expect(result.current.products).toEqual([]);
        expect(fetchCatalog).toHaveBeenCalledTimes(2);
    });

    it('does not overlap requests and removes its timer and listeners on unmount', async () => {
        let finish!: (value: { data: never[]; error: null }) => void;
        fetchCatalog.mockReturnValue(new Promise(resolve => { finish = resolve; }));
        const { unmount } = renderHook(useProducts);
        await act(async () => {
            window.dispatchEvent(new Event('focus'));
            window.dispatchEvent(new Event('online'));
            vi.advanceTimersByTime(60000);
        });
        expect(fetchCatalog).toHaveBeenCalledTimes(1);
        await act(async () => { finish({ data: [], error: null }); });
        unmount();
        await act(async () => {
            vi.advanceTimersByTime(60000);
            window.dispatchEvent(new Event('focus'));
            window.dispatchEvent(new Event('online'));
        });
        expect(fetchCatalog).toHaveBeenCalledTimes(1);
    });
});
