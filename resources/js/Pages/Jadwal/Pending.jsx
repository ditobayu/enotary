import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Pending({ auth, jadwals }) {
    const getStatusBadgeColor = (status) => {
        const colors = {
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Disetujui': 'bg-green-100 text-green-800',
            'Ditolak': 'bg-red-100 text-red-800',
            'Selesai': 'bg-blue-100 text-blue-800',
            'Cancel': 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const handleQuickAction = (jadwalId, action) => {
        const confirmMessage = action === 'Disetujui' 
            ? 'Apakah Anda yakin ingin menyetujui jadwal ini?' 
            : 'Apakah Anda yakin ingin menolak jadwal ini?';
            
        if (confirm(confirmMessage)) {
            router.patch(route('jadwal.update-status', jadwalId), {
                status_jadwal: action
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Jadwal Pending Persetujuan
                    </h2>
                    <div className="flex space-x-2">
                        <Link
                            href={route('jadwal.index')}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Semua Jadwal
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Jadwal Pending" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {jadwals.data.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="flex flex-col items-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A9.971 9.971 0 0118 28a9.971 9.971 0 014 3.714" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                                            Tidak ada jadwal pending
                                        </h3>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Semua jadwal janji temu sudah diproses atau belum ada yang diajukan.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-orange-800">
                                                    {jadwals.data.length} jadwal menunggu persetujuan
                                                </h3>
                                                <p className="mt-1 text-sm text-orange-700">
                                                    Silakan review dan berikan keputusan untuk setiap jadwal yang diajukan client.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full table-auto">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        ID Jadwal
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Client
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Layanan
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Tanggal & Waktu
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Diajukan
                                                    </th>
                                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Aksi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {jadwals.data.map((jadwal) => (
                                                    <tr key={jadwal.id_jadwal} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                #{jadwal.id_jadwal}
                                                            </div>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(jadwal.status_jadwal)}`}>
                                                                {jadwal.status_jadwal}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {jadwal.user?.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {jadwal.user?.email}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {jadwal.layanan?.kategori?.nama_kategori}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                Layanan #{jadwal.layanan?.id_layanan}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {new Date(jadwal.tanggal_janji).toLocaleDateString('id-ID', {
                                                                    weekday: 'short',
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {jadwal.jam_janji}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {new Date(jadwal.created_at).toLocaleDateString('id-ID', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {new Date(jadwal.created_at).toLocaleTimeString('id-ID', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <div className="flex justify-center space-x-2">
                                                                <Link
                                                                    href={route('jadwal.show', jadwal.id_jadwal)}
                                                                    className="text-indigo-600 hover:text-indigo-900 text-sm"
                                                                >
                                                                    Detail
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleQuickAction(jadwal.id_jadwal, 'Disetujui')}
                                                                    className="text-green-600 hover:text-green-900 text-sm"
                                                                >
                                                                    Setujui
                                                                </button>
                                                                <button
                                                                    onClick={() => handleQuickAction(jadwal.id_jadwal, 'Ditolak')}
                                                                    className="text-red-600 hover:text-red-900 text-sm"
                                                                >
                                                                    Tolak
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        
                                        {/* Pagination */}
                                        {jadwals.links && (
                                            <div className="mt-6 flex justify-center">
                                                <div className="flex space-x-1">
                                                    {jadwals.links.map((link, index) => (
                                                        link.url ? (
                                                            <Link
                                                                key={index}
                                                                href={link.url}
                                                                className={`px-3 py-2 text-sm leading-4 border rounded ${
                                                                    link.active
                                                                        ? 'bg-blue-500 text-white border-blue-500'
                                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                                }`}
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        ) : (
                                                            <span
                                                                key={index}
                                                                className="px-3 py-2 text-sm leading-4 border rounded bg-white text-gray-700 border-gray-300 opacity-50 cursor-not-allowed"
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
