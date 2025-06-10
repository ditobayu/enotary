import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Jadwal({ auth, clientUser, jadwal, filters, availableStatuses, availableBulan, availableTahun }) {
    const [filterStatus, setFilterStatus] = useState(filters.status || '');
    const [filterBulan, setFilterBulan] = useState(filters.bulan || '');
    const [filterTahun, setFilterTahun] = useState(filters.tahun || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('client-users.jadwal', clientUser.id), {
            status: filterStatus,
            bulan: filterBulan,
            tahun: filterTahun,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Dikonfirmasi': return 'bg-green-100 text-green-800';
            case 'Selesai': return 'bg-blue-100 text-blue-800';
            case 'Dibatalkan': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getLayananStatusColor = (status) => {
        switch (status) {
            case 'Pengajuan': return 'bg-yellow-100 text-yellow-800';
            case 'Dalam Proses': return 'bg-blue-100 text-blue-800';
            case 'Butuh Dokumen Tambahan': return 'bg-orange-100 text-orange-800';
            case 'Selesai': return 'bg-green-100 text-green-800';
            case 'Ditolak': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getBulanName = (bulan) => {
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return months[bulan - 1];
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Jadwal - {clientUser.name}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Daftar semua jadwal janji temu yang dibuat oleh client
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
            <Head title={`Jadwal - ${clientUser.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Filter Bar */}
                            <div className="mb-6">
                                <form onSubmit={handleFilter} className="flex flex-wrap gap-4 items-end">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status Jadwal
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
                                            Bulan
                                        </label>
                                        <select
                                            value={filterBulan}
                                            onChange={(e) => setFilterBulan(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Semua Bulan</option>
                                            {availableBulan.map((bulan) => (
                                                <option key={bulan} value={bulan}>{getBulanName(bulan)}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tahun
                                        </label>
                                        <select
                                            value={filterTahun}
                                            onChange={(e) => setFilterTahun(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Semua Tahun</option>
                                            {availableTahun.map((tahun) => (
                                                <option key={tahun} value={tahun}>{tahun}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Filter
                                    </button>

                                    {(filters.status || filters.bulan || filters.tahun) && (
                                        <Link
                                            href={route('client-users.jadwal', clientUser.id)}
                                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                        >
                                            Reset
                                        </Link>
                                    )}
                                </form>
                            </div>

                            {/* Jadwal Table */}
                            {jadwal.data.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-500 text-lg">
                                        {filters.status || filters.bulan || filters.tahun 
                                            ? 'Tidak ada jadwal yang sesuai dengan filter.' 
                                            : 'Client belum membuat jadwal apapun.'}
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ID / Layanan
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status Layanan
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tanggal & Jam
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status Jadwal
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {jadwal.data.map((item) => (
                                                <tr key={item.id_jadwal} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                Jadwal #{item.id_jadwal}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                Layanan #{item.layanan.id_layanan} - {item.layanan.kategori.nama_kategori}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLayananStatusColor(item.layanan.status.nama_status)}`}>
                                                            {item.layanan.status.nama_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {new Date(item.tanggal_janji).toLocaleDateString('id-ID', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {item.jam_janji}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(item.status_jadwal)}`}>
                                                            {item.status_jadwal}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route('jadwal.show', item.id_jadwal)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                Lihat
                                                            </Link>
                                                            <Link
                                                                href={route('layanan.show', item.layanan.id_layanan)}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Layanan
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {jadwal.data.length > 0 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Menampilkan {jadwal.from} - {jadwal.to} dari {jadwal.total} jadwal
                                    </div>
                                    <div className="flex space-x-2">
                                        {jadwal.links && jadwal.links.map((link, index) => {
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
