import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, kategoriLayanan, flash }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedKategori, setSelectedKategori] = useState(null);

    const handleDelete = (kategori) => {
        setSelectedKategori(kategori);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(route('kategori-layanan.destroy', selectedKategori.id_kategori), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedKategori(null);
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Kategori Layanan
                    </h2>
                    <Link
                        href={route('kategori-layanan.create')}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Tambah Kategori
                    </Link>
                </div>
            }
        >
            <Head title="Kategori Layanan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            {flash.success}
                        </div>
                    )}
                    
                    {flash?.error && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {flash.error}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {kategoriLayanan.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">Belum ada kategori layanan.</p>
                                    <Link
                                        href={route('kategori-layanan.create')}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Tambah Kategori Pertama
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nama Kategori
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Jumlah Layanan
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {kategoriLayanan.map((kategori) => (
                                                <tr key={kategori.id_kategori} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {kategori.nama_kategori}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {kategori.layanan_count} layanan
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-2">
                                                            <Link
                                                                href={route('kategori-layanan.show', kategori.id_kategori)}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                Lihat
                                                            </Link>
                                                            <Link
                                                                href={route('kategori-layanan.edit', kategori.id_kategori)}
                                                                className="text-yellow-600 hover:text-yellow-900"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(kategori)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="modal">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg font-medium text-gray-900">Konfirmasi Hapus</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    Apakah Anda yakin ingin menghapus kategori "{selectedKategori?.nama_kategori}"?
                                    {selectedKategori?.layanan_count > 0 && (
                                        <span className="block mt-2 text-red-600 font-medium">
                                            Kategori ini memiliki {selectedKategori.layanan_count} layanan dan tidak dapat dihapus.
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-auto mr-2 hover:bg-gray-600"
                                >
                                    Batal
                                </button>
                                {selectedKategori?.layanan_count === 0 && (
                                    <button
                                        onClick={confirmDelete}
                                        className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-auto hover:bg-red-600"
                                    >
                                        Hapus
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
