import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useProducts } from '../hooks/useProducts';
import { supabase } from '../lib/supabaseClient';
import { Trash2, Eye, EyeOff, Plus, LogOut, Loader2 } from 'lucide-react';
import type { Product } from '../types/product';

import ProductForm from '../components/ProductForm';

export default function AdminPage() {
    const [session, setSession] = useState<Session | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const { products, addProduct, removeProduct, toggleStatus } = useProducts();

    // Restaurar sesión al montar + escuchar cambios de auth
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setAuthLoading(false);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(null);
        setSubmitting(true);

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        setSubmitting(false);
        if (error) {
            setLoginError(error.message === 'Invalid login credentials'
                ? 'Credenciales inválidas'
                : error.message);
        } else {
            setPassword('');
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const handleSaveProduct = async (newProduct: Product) => {
        const success = await addProduct(newProduct);
        if (success) {
            alert("✅ ¡Producto guardado en el inventario!");
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#E5E4E2] animate-spin" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <form onSubmit={handleLogin} className="bg-[#1A1A1A] p-8 rounded border border-white/10 w-full max-w-md shadow-2xl">
                    <h1 className="text-3xl text-[#E5E4E2] font-display text-center mb-2">VICLU ADMIN</h1>
                    <p className="text-white/40 text-center mb-6 text-sm">Acceso Propietario</p>

                    <label className="sr-only" htmlFor="admin-email">Correo</label>
                    <input
                        id="admin-email"
                        type="email"
                        autoComplete="email"
                        placeholder="correo@ejemplo.com"
                        required
                        className="w-full bg-black border border-white/20 p-4 text-white mb-3 rounded focus:outline-none focus:border-[#E5E4E2] text-center tracking-wide"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="sr-only" htmlFor="admin-password">Contraseña</label>
                    <input
                        id="admin-password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="Contraseña"
                        required
                        className="w-full bg-black border border-white/20 p-4 text-white mb-4 rounded focus:outline-none focus:border-[#E5E4E2] text-center tracking-widest"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {loginError && (
                        <p className="text-red-400 text-sm text-center mb-4" role="alert">
                            {loginError}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[#E5E4E2] text-black font-bold py-4 rounded hover:bg-white transition uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {submitting ? 'Verificando…' : 'Ingresar'}
                    </button>

                    <p className="mt-6 text-center text-xs text-white/30">
                        Autenticación segura vía Supabase
                    </p>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-[#E5E4E2] font-body pb-20">
            <div className="sticky top-0 z-50 bg-[#0F0F0F]/95 backdrop-blur border-b border-white/10 mb-8">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-display tracking-wide">Panel de Control</h1>
                        <p className="text-xs text-white/40 mt-0.5">{session.user.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                        <LogOut className="w-4 h-4" /> Salir
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-[#1A1A1A] p-6 rounded border border-white/10 sticky top-24">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white/90">
                            <Plus className="w-5 h-5" /> Nuevo Producto
                        </h2>
                        <ProductForm onSubmit={handleSaveProduct} buttonText="Guardar en Inventario" />
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4 text-white/90">Inventario Actual ({products.length})</h2>

                    {/* MOBILE — cards apiladas (visible < md) */}
                    <div className="md:hidden space-y-3">
                        {products.map(product => (
                            <div
                                key={product.id}
                                className="bg-[#1A1A1A] rounded border border-white/10 p-3 flex gap-3"
                            >
                                {/* Imagen */}
                                <div className="w-16 h-16 bg-white/5 rounded overflow-hidden flex-shrink-0">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt=""
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">N/A</div>
                                    )}
                                </div>

                                {/* Detalle */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-[#E5E4E2] truncate">{product.name}</div>
                                    <div className="text-xs text-white/50 mb-2">{product.brand} • {product.stock} unds.</div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-mono text-sm text-white/90">${product.price.toLocaleString()}</span>
                                        <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full ${product.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {product.active ? 'Activo' : 'Baja'}
                                        </span>
                                    </div>
                                </div>

                                {/* Acciones — siempre visibles (apiladas vertical en mobile) */}
                                <div className="flex flex-col gap-1 flex-shrink-0">
                                    <button
                                        onClick={() => toggleStatus(product.id)}
                                        title={product.active ? "Dar de baja" : "Activar"}
                                        aria-label={product.active ? "Dar de baja" : "Activar"}
                                        className="p-2 hover:bg-white/10 rounded text-[#E5E4E2] transition-colors"
                                    >
                                        {product.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => { if (confirm('¿Eliminar permanentemente?')) removeProduct(product.id) }}
                                        title="Eliminar"
                                        aria-label="Eliminar"
                                        className="p-2 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {products.length === 0 && (
                            <div className="p-8 text-center text-white/30 text-sm bg-[#1A1A1A] rounded border border-white/10">
                                No hay productos en el inventario.
                            </div>
                        )}
                    </div>

                    {/* DESKTOP — tabla completa (visible ≥ md) */}
                    <div className="hidden md:block overflow-hidden rounded border border-white/10 bg-[#1A1A1A]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-black/40 text-white/50 text-xs uppercase tracking-wider">
                                    <th className="p-4 w-20">Img</th>
                                    <th className="p-4">Detalle</th>
                                    <th className="p-4 text-right">Precio</th>
                                    <th className="p-4 text-center">Estado</th>
                                    <th className="p-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {products.map(product => (
                                    <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="w-12 h-12 bg-white/5 rounded overflow-hidden">
                                                {product.image ? (
                                                    <img src={product.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">N/A</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-[#E5E4E2]">{product.name}</div>
                                            <div className="text-xs text-white/50">{product.brand} • {product.stock} unds.</div>
                                        </td>
                                        <td className="p-4 text-right font-mono text-sm">
                                            ${product.price.toLocaleString()}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full ${product.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {product.active ? 'Activo' : 'Baja'}
                                            </span>
                                        </td>
                                        <td className="p-4 flex justify-end gap-2">
                                            <button
                                                onClick={() => toggleStatus(product.id)}
                                                title={product.active ? "Dar de baja" : "Activar"}
                                                className="p-2 hover:bg-white/10 rounded text-[#E5E4E2] transition-colors"
                                            >
                                                {product.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => { if (confirm('¿Eliminar permanentemente?')) removeProduct(product.id) }}
                                                className="p-2 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {products.length === 0 && (
                            <div className="p-8 text-center text-white/30 text-sm">
                                No hay productos en el inventario.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
