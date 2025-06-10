import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, kategoriLayanan }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Detail Kategori Layanan
                    </h2>
                    <div className="flex space-x-2">
                        <Link
                            href={route('kategori-layanan.edit', kategoriLayanan.id_kategori)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Edit
                        </Link>
                        <Link
                            href={route('kategori-layanan.index')}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Detail - ${kategoriLayanan.nama_kategori}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Informasi Kategori
                                    </h3>
                                    <dl className="space-y-3">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                ID Kategori
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {kategoriLayanan.id_kategori}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Nama Kategori
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {kategoriLayanan.nama_kategori}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Jumlah Layanan
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {kategoriLayanan.layanan ? kategoriLayanan.layanan.length : 0} layanan
                                                </span>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Dibuat
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {new Date(kategoriLayanan.created_at).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Terakhir Diupdate
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {new Date(kategoriLayanan.updated_at).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Daftar Layanan
                                    </h3>
                                    {kategoriLayanan.layanan && kategoriLayanan.layanan.length > 0 ? (
                                        <div className="space-y-3">
                                            {kategoriLayanan.layanan.map((layanan) => (
                                                <div key={layanan.id_layanan} className="border border-gray-200 rounded-lg p-4">
                                                    <h4 className="font-medium text-gray-900">
                                                        {layanan.nama_layanan}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {layanan.deskripsi}
                                                    </p>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <span className="text-sm font-medium text-green-600">
                                                            Rp {Number(layanan.harga).toLocaleString('id-ID')}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            oleh {layanan.user?.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>Belum ada layanan dalam kategori ini.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
