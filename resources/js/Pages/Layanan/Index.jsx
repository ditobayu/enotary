import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, layanan, flash, statusFilter = '', statusLayanan = [] }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedLayanan, setSelectedLayanan] = useState(null);
    const [currentStatusFilter, setCurrentStatusFilter] = useState(statusFilter);

    const handleDelete = (layananItem) => {
        setSelectedLayanan(layananItem);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(route('layanan.destroy', selectedLayanan.id_layanan), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedLayanan(null);
            }
        });
    };

    const handleStatusFilter = (status) => {
        setCurrentStatusFilter(status);
        router.get(route('layanan.index'), { status }, { 
            preserveState: true,
            preserveScroll: true 
        });
    };

    const quickStatusUpdate = (layananItem, newStatusId) => {
        router.patch(route('layanan.update-status', layananItem.id_layanan), {
            id_status: newStatusId
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const getStatusBadgeColor = (status) => {
        const colors = {
            'Pengajuan': 'bg-blue-100 text-blue-800',
            'Diproses': 'bg-yellow-100 text-yellow-800',
            'Menunggu Dokumen': 'bg-orange-100 text-orange-800',
            'Review': 'bg-purple-100 text-purple-800',
            'Selesai': 'bg-green-100 text-green-800',
            'Ditolak': 'bg-red-100 text-red-800',
            'Dibatalkan': 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const canEditOrDelete = (layananItem) => {
        return layananItem.status.nama_status === 'Pengajuan' && 
               (auth.user.roles?.some(role => ['admin', 'superadmin'].includes(role.name)) || layananItem.id_user === auth.user.id);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        {auth.user.roles?.some(role => ['admin', 'superadmin'].includes(role.name)) ? 'Semua Layanan' : 'Layanan Saya'}
                    </h2>
                    <Link
                        href={route('layanan.create')}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Ajukan Layanan
                    </Link>
                </div>
            }
        >
            <Head title="Layanan" />

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
                            {/* Status Filter for Admin/Superadmin */}
                            {auth.user.roles?.some(role => ['admin', 'superadmin'].includes(role.name)) && statusLayanan.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Filter berdasarkan Status:
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => handleStatusFilter('')}
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                currentStatusFilter === '' 
                                                    ? 'bg-blue-500 text-white' 
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            Semua ({layanan.length})
                                        </button>
                                        {statusLayanan.map((status) => {
                                            const count = layanan.filter(l => l.status.nama_status === status.nama_status).length;
                                            return (
                                                <button
                                                    key={status.id_status}
                                                    onClick={() => handleStatusFilter(status.nama_status)}
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        currentStatusFilter === status.nama_status
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    }`}
                                                >
                                                    {status.nama_status} ({count})
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {layanan.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">Belum ada layanan yang diajukan.</p>
                                    <Link
                                        href={route('layanan.create')}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Ajukan Layanan Pertama
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ID Layanan
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Kategori
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tanggal Pengajuan
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                {auth.user.roles?.some(role => ['admin', 'superadmin'].includes(role.name)) && (
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Client
                                                    </th>
                                                )}
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {layanan.map((layananItem) => (
                                                <tr key={layananItem.id_layanan} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            #{layananItem.id_layanan}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {layananItem.kategori?.nama_kategori}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {new Date(layananItem.tanggal_pengajuan).toLocaleDateString('id-ID', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(layananItem.status?.nama_status)}`}>
                                                            {layananItem.status?.nama_status}
                                                        </span>
                                                    </td>
                                                    {auth.user.roles?.some(role => ['admin', 'superadmin'].includes(role.name)) && (
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {layananItem.user?.name}
                                                            </div>
                                                        </td>
                                                    )}
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-2">
                                                            <Link
                                                                href={route('layanan.show', layananItem.id_layanan)}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                Lihat
                                                            </Link>
                                                            
                                                            {/* Admin/Superadmin Quick Status Updates */}
                                                            {auth.user.roles?.some(role => ['admin', 'superadmin'].includes(role.name)) && (
                                                                <div className="flex space-x-1">
                                                                    {layananItem.status.nama_status === 'Pengajuan' && (
                                                                        <>
                                                                            <button
                                                                                onClick={() => quickStatusUpdate(layananItem, statusLayanan.find(s => s.nama_status === 'Diproses')?.id_status)}
                                                                                className="text-yellow-600 hover:text-yellow-900 text-xs"
                                                                                title="Proses"
                                                                            >
                                                                                Proses
                                                                            </button>
                                                                            <button
                                                                                onClick={() => quickStatusUpdate(layananItem, statusLayanan.find(s => s.nama_status === 'Ditolak')?.id_status)}
                                                                                className="text-red-600 hover:text-red-900 text-xs"
                                                                                title="Tolak"
                                                                            >
                                                                                Tolak
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                    {layananItem.status.nama_status === 'Diproses' && (
                                                                        <button
                                                                            onClick={() => quickStatusUpdate(layananItem, statusLayanan.find(s => s.nama_status === 'Selesai')?.id_status)}
                                                                            className="text-green-600 hover:text-green-900 text-xs"
                                                                            title="Selesaikan"
                                                                        >
                                                                            Selesai
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                            
                                                            {canEditOrDelete(layananItem) && (
                                                                <>
                                                                    <Link
                                                                        href={route('layanan.edit', layananItem.id_layanan)}
                                                                        className="text-yellow-600 hover:text-yellow-900"
                                                                    >
                                                                        Edit
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => handleDelete(layananItem)}
                                                                        className="text-red-600 hover:text-red-900"
                                                                    >
                                                                        Hapus
                                                                    </button>
                                                                </>
                                                            )}
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
                                    Apakah Anda yakin ingin menghapus layanan #{selectedLayanan?.id_layanan}?
                                    <span className="block mt-2 text-red-600 font-medium">
                                        Tindakan ini tidak dapat dibatalkan.
                                    </span>
                                </p>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-auto mr-2 hover:bg-gray-600"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-auto hover:bg-red-600"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
