import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Product } from '../types/product';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. CARGAR PRODUCTOS DESDE LA NUBE (Supabase)
    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false }); // Los más nuevos primero

        if (error) {
            console.error('Error cargando productos:', error);
            alert('Error de conexión con el inventario');
        } else {
            setProducts(data as Product[] || []);
        }
        setLoading(false);
    };

    // Cargar al iniciar
    useEffect(() => {
        fetchProducts();
    }, []);

    // 2. AÑADIR PRODUCTO (Insertar en Nube)
    const addProduct = async (product: Product): Promise<boolean> => {
        // En Supabase, el ID se genera automáticamente.
        // Omitimos enviar el campo 'id' para que la base de datos lo cree.

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...productData } = product;

        console.log("Intentando guardar producto:", productData);

        const { error } = await supabase
            .from('products')
            .insert([productData]);

        if (error) {
            console.error('Error guardando en Supabase:', error);
            // Mensaje más amigable para el usuario
            let mensaje = 'No se pudo guardar.';
            if (error.code === '42501') mensaje = 'Permiso denegado (Revisa Políticas RLS).';
            if (error.code === '23505') mensaje = 'El producto ya existe.';

            alert(`⚠️ Error: ${mensaje}\nDetalle: ${error.message}`);
            return false;
        } else {
            console.log("Producto guardado con éxito.");
            // Recargar lista para ver el cambio
            fetchProducts();
            return true;
        }
    };

    // 3. ELIMINAR PRODUCTO
    const removeProduct = async (id: string) => {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Error eliminando');
        } else {
            fetchProducts();
        }
    };

    // 4. CAMBIAR ESTADO (Activo/Inactivo)
    const toggleStatus = async (id: string) => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        const { error } = await supabase
            .from('products')
            .update({ active: !product.active })
            .eq('id', id);

        if (!error) {
            fetchProducts();
        }
    };

    // 5. ELIMINAR TODOS LOS PRODUCTOS DE UNA CATEGORÍA (cascada — usado al borrar categoría)
    const removeProductsByCategory = async (category: string): Promise<{ ok: boolean; count: number; error?: string }> => {
        // Contar antes para reportar
        const targetCount = products.filter(p => p.category === category).length;

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('category', category);

        if (error) {
            console.error('Error eliminando productos de categoría:', error);
            return { ok: false, count: 0, error: error.message };
        }

        await fetchProducts();
        return { ok: true, count: targetCount };
    };

    return {
        products,
        loading,
        addProduct,
        removeProduct,
        toggleStatus,
        removeProductsByCategory,
        refreshProducts: fetchProducts // Exponemos esto por si queremos recargar manual
    };
};
