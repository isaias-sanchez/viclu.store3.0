// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ProductForm from '../src/components/ProductForm';

const { upload, getPublicUrl } = vi.hoisted(() => ({ upload: vi.fn(), getPublicUrl: vi.fn() }));
vi.mock('../src/lib/supabaseClient', () => ({
    supabase: { storage: { from: () => ({ upload, getPublicUrl }) } },
}));

const image = 'https://example.com/product.jpg';
const fields = { name: 'Gorra', price: 50, description: 'Roja LA', brand: 'Nike' };
const deferred = <T,>() => {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>(r => { resolve = r; });
    return { promise, resolve };
};

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    getPublicUrl.mockReturnValue({ data: { publicUrl: image } });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('product photo and save lifecycle', () => {
    it('blocks button and form submission until the upload completes, then sends its URL', async () => {
        const pending = deferred<{ error: null }>();
        upload.mockReturnValue(pending.promise);
        const onSubmit = vi.fn().mockResolvedValue(true);
        const { container } = render(<ProductForm onSubmit={onSubmit} categories={['Beisboleras']} initialData={fields} />);
        await userEvent.upload(screen.getByLabelText('Foto del producto'), new File(['photo'], 'cap.jpg', { type: 'image/jpeg' }));
        expect((screen.getByRole('button', { name: 'Esperando foto…' }) as HTMLButtonElement).disabled).toBe(true);
        fireEvent.submit(container.querySelector('form')!);
        expect(onSubmit).not.toHaveBeenCalled();
        await act(async () => { pending.resolve({ error: null }); });
        await userEvent.click(screen.getByRole('button', { name: 'Guardar Producto' }));
        expect(onSubmit).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ image, name: 'Gorra' }));
    });

    it('rejects a product with no uploaded photo', async () => {
        const onSubmit = vi.fn();
        render(<ProductForm onSubmit={onSubmit} categories={['Beisboleras']} initialData={fields} />);
        await userEvent.click(screen.getByRole('button', { name: 'Guardar Producto' }));
        expect(onSubmit).not.toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Sube la foto'));
    });

    it('preserves the photo and fields after the server rejects a save', async () => {
        const onSubmit = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
        render(<ProductForm onSubmit={onSubmit} categories={['Beisboleras']} initialData={{ ...fields, image }} />);
        await userEvent.click(screen.getByRole('button', { name: 'Guardar Producto' }));
        expect((screen.getByPlaceholderText('Ej: Hoodie Platinum') as HTMLInputElement).value).toBe('Gorra');
        expect(screen.getByAltText('Preview').getAttribute('src')).toBe(image);
        await userEvent.click(screen.getByRole('button', { name: 'Guardar Producto' }));
        expect(onSubmit.mock.calls[1][0]).toMatchObject({ ...fields, image });
        await waitFor(() => expect((screen.getByPlaceholderText('Ej: Hoodie Platinum') as HTMLInputElement).value).toBe(''));
    });

    it('prevents duplicate saves and resets only after the save succeeds', async () => {
        const pending = deferred<boolean>();
        const onSubmit = vi.fn().mockReturnValue(pending.promise);
        const { container } = render(<ProductForm onSubmit={onSubmit} categories={['Beisboleras']} initialData={{ ...fields, image }} />);
        await userEvent.click(screen.getByRole('button', { name: 'Guardar Producto' }));
        expect((screen.getByRole('button', { name: 'Guardando…' }) as HTMLButtonElement).disabled).toBe(true);
        fireEvent.submit(container.querySelector('form')!);
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect((screen.getByPlaceholderText('Ej: Hoodie Platinum') as HTMLInputElement).value).toBe('Gorra');
        await act(async () => { pending.resolve(true); });
        expect((screen.getByPlaceholderText('Ej: Hoodie Platinum') as HTMLInputElement).value).toBe('');
    });

    it('preserves the form when the save throws and permits a retry', async () => {
        const onSubmit = vi.fn().mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce(true);
        render(<ProductForm onSubmit={onSubmit} categories={['Beisboleras']} initialData={{ ...fields, image }} />);
        await userEvent.click(screen.getByRole('button', { name: 'Guardar Producto' }));
        expect(screen.getByAltText('Preview').getAttribute('src')).toBe(image);
        await userEvent.click(screen.getByRole('button', { name: 'Guardar Producto' }));
        expect(onSubmit).toHaveBeenCalledTimes(2);
    });
});
