import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, clientUser, stats }) {
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

    const getJadwalStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Dikonfirmasi': return 'bg-green-100 text-green-800';
            case 'Selesai': return 'bg-blue-100 text-blue-800';
            case 'Dibatalkan': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Detail Client: {clientUser.name}
                    </h2>
                    <div className="flex space-x-2">
                        <Link
                            href={route('client-users.layanan', clientUser.id)}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Lihat Layanan
                        </Link>
                        <Link
                            href={route('client-users.jadwal', clientUser.id)}
                            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Lihat Jadwal
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
            <Head title={`Detail Client: ${clientUser.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center mb-6 pb-6 border-b border-gray-200">
                                <div className="flex-shrink-0 h-20 w-20">
                                    <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-blue-800">
                                            {clientUser.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-6">
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {clientUser.name}
                                    </h3>
                                    <p className="text-lg text-gray-600 mt-1">
                                        {clientUser.email}
                                    </p>
                                    <div className="flex items-center space-x-3 mt-3">
                                        <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                                            Client
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            ID: #{clientUser.id}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{stats.total_layanan}</div>
                                    <div className="text-sm text-blue-600">Total Layanan</div>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-600">{stats.layanan_aktif}</div>
                                    <div className="text-sm text-yellow-600">Layanan Aktif</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{stats.layanan_selesai}</div>
                                    <div className="text-sm text-green-600">Layanan Selesai</div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{stats.total_jadwal}</div>
                                    <div className="text-sm text-purple-600">Total Jadwal</div>
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-900">Informasi Akun</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Email</span>
                                            <p className="text-sm text-gray-900">{clientUser.email}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Tanggal Daftar</span>
                                            <p className="text-sm text-gray-900">
                                                {new Date(clientUser.created_at).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Status Email</span>
                                            <p className="text-sm text-gray-900">
                                                {clientUser.email_verified_at ? 'Terverifikasi' : 'Belum Verifikasi'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-900">Ringkasan Jadwal</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Pending</span>
                                            <span className="text-sm font-medium text-yellow-600">{stats.jadwal_pending}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Dikonfirmasi</span>
                                            <span className="text-sm font-medium text-green-600">{stats.jadwal_confirmed}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Total</span>
                                            <span className="text-sm font-medium text-gray-900">{stats.total_jadwal}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Layanan */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-semibold text-gray-900">Layanan Terbaru</h4>
                                <Link
                                    href={route('client-users.layanan', clientUser.id)}
                                    className="text-blue-600 hover:text-blue-900 text-sm"
                                >
                                    Lihat Semua
                                </Link>
                            </div>
                            
                            {clientUser.layanan.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    Belum ada layanan yang diajukan
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dokumen</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jadwal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {clientUser.layanan.slice(0, 5).map((layanan) => (
                                                <tr key={layanan.id_layanan} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        #{layanan.id_layanan}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {layanan.kategori.nama_kategori}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(layanan.status.nama_status)}`}>
                                                            {layanan.status.nama_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(layanan.tanggal_pengajuan).toLocaleDateString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {layanan.dokumen.length} dokumen
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {layanan.jadwal.length} jadwal
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Jadwal */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-semibold text-gray-900">Jadwal Terbaru</h4>
                                <Link
                                    href={route('client-users.jadwal', clientUser.id)}
                                    className="text-blue-600 hover:text-blue-900 text-sm"
                                >
                                    Lihat Semua
                                </Link>
                            </div>
                            
                            {clientUser.jadwal.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    Belum ada jadwal yang dibuat
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Layanan</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jam</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {clientUser.jadwal.slice(0, 5).map((jadwal) => (
                                                <tr key={jadwal.id_jadwal} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        #{jadwal.id_jadwal}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {jadwal.layanan.kategori.nama_kategori}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(jadwal.tanggal_janji).toLocaleDateString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {jadwal.jam_janji}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getJadwalStatusColor(jadwal.status_jadwal)}`}>
                                                            {jadwal.status_jadwal}
                                                        </span>
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
        </AuthenticatedLayout>
    );
}
