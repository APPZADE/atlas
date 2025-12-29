import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 mb-4">404 - Sayfa Bulunamadı</h2>
            <p className="text-slate-400 mb-8">Aradığınız gezegen haritamızda yok.</p>
            <Link href="/" className="px-6 py-3 bg-cyan-500 text-white rounded-full font-bold hover:bg-cyan-600 transition">
                Ana Sayfaya Dön
            </Link>
        </div>
    );
}
