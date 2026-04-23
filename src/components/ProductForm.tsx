import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { Product } from '../types/product';
import { supabase } from '../lib/supabaseClient'; // 👈 Importamos el cliente
import { Image as ImageIcon, X, Save, Loader2 } from 'lucide-react';

interface ProductFormProps {
    onSubmit: (product: Product) => void;
    initialData?: Partial<Product>;
    buttonText?: string;
}

const ProductForm = ({ onSubmit, initialData = {}, buttonText = "Guardar Producto" }: ProductFormProps) => {
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        brand: '',
        price: 0,
        stock: 1,
        description: '',
        color: '',
        image: null,
        active: true,
        category: 'Hoodie',
        ...initialData
    });

    const [uploading, setUploading] = useState(false);

    // --- NUEVA LÓGICA DE SUBIDA A STORAGE ---
    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validación básica
        if (file.size > 2 * 1024 * 1024) { // 2MB límite
            alert("⚠️ La imagen es muy pesada. Máximo 2MB.");
            return;
        }

        setUploading(true);
        try {
            // 1. Generar nombre único para no sobrescribir
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // 2. Subir al Bucket 'product-images'
            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 3. Obtener la URL Pública
            const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            // 4. Guardar URL corta en el estado
            setFormData(prev => ({ ...prev, image: data.publicUrl }));

        } catch (error) {
            console.error("Error subiendo imagen:", error);
            alert("❌ Error al subir la imagen a la nube.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!formData.name?.trim()) {
            alert("❌ El nombre es obligatorio.");
            return;
        }
        if (!formData.price || Number(formData.price) <= 0) {
            alert("❌ El precio debe ser válido.");
            return;
        }

        const newProduct: Product = {
            id: formData.id || crypto.randomUUID(),
            name: formData.name,
            brand: formData.brand || 'Viclu',
            price: Number(formData.price),
            stock: Number(formData.stock) || 0,
            description: formData.description || '',
            color: formData.color || 'N/A',
            active: formData.active ?? true,
            image: formData.image || null, // Aquí irá la URL corta
            category: formData.category || 'Hoodie'
        };

        onSubmit(newProduct);

        if (!initialData.id) {
            setFormData({
                name: '', brand: '', price: 0, stock: 1,
                description: '', color: '', image: null, category: 'Hoodie'
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* SECCIÓN IMAGEN */}
            <div className="flex flex-col items-center justify-center mb-6">
                <div className="relative w-32 h-40 bg-[#0F0F0F] border-2 border-dashed border-white/20 rounded-lg overflow-hidden group hover:border-[#E5E4E2] transition-colors">

                    {uploading ? (
                        <div className="flex flex-col items-center justify-center h-full text-[#E5E4E2]">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            <span className="text-[10px]">Subiendo...</span>
                        </div>
                    ) : formData.image ? (
                        <>
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-white/30">
                            <ImageIcon className="w-8 h-8 mb-2" />
                            <span className="text-[10px] uppercase text-center">Subir Foto</span>
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={uploading}
                    />
                </div>
            </div>

            {/* CAMPOS DE TEXTO (Igual que antes) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs text-white/50 uppercase ml-1">Nombre *</label>
                    <input
                        className="w-full p-3 bg-black border border-white/20 rounded text-white focus:border-[#E5E4E2] outline-none"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ej: Hoodie Platinum"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs text-white/50 uppercase ml-1">Precio *</label>
                    <input
                        type="number"
                        className="w-full p-3 bg-black border border-white/20 rounded text-white focus:border-[#E5E4E2] outline-none"
                        value={formData.price || ''}
                        onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                </div>


                <div className="space-y-1">
                    <label className="text-xs text-white/50 uppercase ml-1">Marca</label>
                    <input
                        className="w-full p-3 bg-black border border-white/20 rounded text-white focus:border-[#E5E4E2] outline-none"
                        value={formData.brand}
                        onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs text-white/50 uppercase ml-1">Stock</label>
                    <input
                        type="number"
                        className="w-full p-3 bg-black border border-white/20 rounded text-white focus:border-[#E5E4E2] outline-none"
                        value={formData.stock}
                        onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                    />
                </div>

                <div className="md:col-span-2 space-y-1">
                    <label className="text-xs text-white/50 uppercase ml-1">Descripción</label>
                    <textarea
                        className="w-full p-3 bg-black border border-white/20 rounded text-white focus:border-[#E5E4E2] outline-none min-h-[80px]"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-[#E5E4E2] hover:bg-white text-black font-display font-bold text-lg py-3 rounded flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
            >
                <Save className="w-5 h-5" />
                {buttonText}
            </button>
        </form>
    );
};

export default ProductForm;
