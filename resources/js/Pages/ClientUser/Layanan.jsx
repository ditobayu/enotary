import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Layanan({ auth, clientUser, layanan, filters, availableStatuses, availableKategori }) {
    const [filterStatus, setFilterStatus] = useState(filters.status || '');
    const [filterKategori, setFilterKategori] = useState(filters.kategori || '');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('client-users.layanan', clientUser.id), {
            status: filterStatus,
            kategori: filterKategori,
            search: searchTerm,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Pengajuan': return 'bg-yellow-100 text-yellow-800';
            case 'Dalam Proses': return 'bg-blue-100 text-blue-800';
            case 'Butuh Dokumen Tambahan': return 'bg-orange-100 text-orange-800';
            case 'Selesai': return 'bg-green-100 text-green-800';
            case 'Ditolak': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Layanan - {clientUser.name}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Daftar semua layanan yang diajukan oleh client
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <Link
                            href={route('client-users.show', clientUser.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Detail Client
                        </Link>
                        <Link
                            href={route('client-users.index')}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Layanan - ${clientUser.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Filter Bar */}
                            <div className="mb-6">
                                <form onSubmit={handleFilter} className="flex flex-wrap gap-4 items-end">
                                    <div className="flex-1 min-w-64">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cari Layanan
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Cari berdasarkan keterangan atau kategori..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Semua Status</option>
                                            {availableStatuses.map((status) => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Kategori
                                        </label>
                                        <select
                                            value={filterKategori}
                                            onChange={(e) => setFilterKategori(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Semua Kategori</option>
                                            {availableKategori.map((kategori) => (
                                                <option key={kategori} value={kategori}>{kategori}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Filter
                                    </button>

                                    {(filters.status || filters.kategori || filters.search) && (
                                        <Link
                                            href={route('client-users.layanan', clientUser.id)}
                                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                        >
                                            Reset
                                        </Link>
                                    )}
                                </form>
                            </div>

                            {/* Layanan Table */}
                            {layanan.data.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-500 text-lg">
                                        {filters.status || filters.kategori || filters.search 
                                            ? 'Tidak ada layanan yang sesuai dengan filter.' 
                                            : 'Client belum mengajukan layanan apapun.'}
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ID / Kategori
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tanggal Pengajuan
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Dokumen
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Jadwal
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {layanan.data.map((item) => (
                                                <tr key={item.id_layanan} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                #{item.id_layanan}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {item.kategori.nama_kategori}
                                                            </div>
                                                            {item.keterangan && (
                                                                <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                                                                    {item.keterangan}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(item.status.nama_status)}`}>
                                                            {item.status.nama_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(item.tanggal_pengajuan).toLocaleDateString('id-ID', {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {item.dokumen.length} dokumen
                                                        </div>
                                                        {item.dokumen.length > 0 && (
                                                            <div className="text-xs text-gray-500">
                                                                {item.dokumen.slice(0, 2).map(doc => doc.nama_dokumen).join(', ')}
                                                                {item.dokumen.length > 2 && ` +${item.dokumen.length - 2} lainnya`}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {item.jadwal.length} jadwal
                                                        </div>
                                                        {item.jadwal.length > 0 && (
                                                            <div className="text-xs text-gray-500">
                                                                Terakhir: {new Date(item.jadwal[0].tanggal_janji).toLocaleDateString('id-ID')}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link
                                                            href={route('layanan.show', item.id_layanan)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Lihat Detail
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {layanan.data.length > 0 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Menampilkan {layanan.from} - {layanan.to} dari {layanan.total} layanan
                                    </div>
                                    <div className="flex space-x-2">
                                        {layanan.links && layanan.links.map((link, index) => {
                                            if (!link.url) {
                                                return (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-2 text-sm rounded-md bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            }
                                            
                                            return (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    preserveState
                                                    className={`px-3 py-2 text-sm rounded-md ${
                                                        link.active
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        })}
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
