import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, jadwals }) {
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

    const isAdmin = auth.user.roles?.some(role => ['admin', 'superadmin'].includes(role.name));
    const isClient = auth.user.roles?.some(role => role.name === 'client');

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        {isAdmin ? 'Semua Jadwal Janji Temu' : 'Jadwal Janji Temu Saya'}
                    </h2>
                    {isAdmin && (
                        <Link
                            href={route('jadwal.pending')}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Jadwal Pending
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Jadwal Janji Temu" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {jadwals.data.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">
                                        {isClient 
                                            ? 'Anda belum memiliki jadwal janji temu.' 
                                            : 'Belum ada jadwal janji temu.'
                                        }
                                    </p>
                                    {isClient && (
                                        <p className="text-sm text-gray-400">
                                            Buat janji temu melalui halaman detail layanan.
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ID Jadwal
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Layanan
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tanggal & Waktu
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                {isAdmin && (
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
                                            {jadwals.data.map((jadwal) => (
                                                <tr key={jadwal.id_jadwal} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            #{jadwal.id_jadwal}
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
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {jadwal.jam_janji}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(jadwal.status_jadwal)}`}>
                                                            {jadwal.status_jadwal}
                                                        </span>
                                                    </td>
                                                    {isAdmin && (
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {jadwal.user?.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {jadwal.user?.email}
                                                            </div>
                                                        </td>
                                                    )}
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-2">
                                                            <Link
                                                                href={route('jadwal.show', jadwal.id_jadwal)}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                Lihat
                                                            </Link>
                                                                             {isClient && jadwal.id_user === auth.user.id && ['Pending', 'Disetujui'].includes(jadwal.status_jadwal) && (
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Apakah Anda yakin ingin membatalkan jadwal ini?')) {
                                                            router.patch(route('jadwal.cancel', jadwal.id_jadwal));
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Batalkan
                                                </button>
                                            )}
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
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
