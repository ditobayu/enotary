import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ auth, jadwal }) {
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
    const isOwner = jadwal.id_user === auth.user.id;

    const handleStatusChange = (newStatus) => {
        console.log('Attempting to change status to:', newStatus);
        console.log('Jadwal ID:', jadwal.id_jadwal);
        console.log('Route URL:', route('jadwal.update-status', jadwal.id_jadwal));
        
        if (confirm(`Apakah Anda yakin ingin mengubah status menjadi "${newStatus}"?`)) {
            router.patch(route('jadwal.update-status', jadwal.id_jadwal), {
                status_jadwal: newStatus
            });
        }
    };

    const handleCancel = () => {
        if (confirm('Apakah Anda yakin ingin membatalkan jadwal ini?')) {
            router.patch(route('jadwal.cancel', jadwal.id_jadwal));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Detail Jadwal #{jadwal.id_jadwal}
                    </h2>
                    <div className="flex space-x-2">
                        {isAdmin && jadwal.status_jadwal === 'Pending' && (
                            <>
                                <button
                                    onClick={() => handleStatusChange('Disetujui')}
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    Setujui
                                </button>
                                <button
                                    onClick={() => handleStatusChange('Ditolak')}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    Tolak
                                </button>
                            </>
                        )}
                        {isAdmin && jadwal.status_jadwal === 'Disetujui' && (
                            <button
                                onClick={() => handleStatusChange('Selesai')}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Tandai Selesai
                            </button>
                        )}
                        {isClient && isOwner && ['Pending', 'Disetujui'].includes(jadwal.status_jadwal) && (
                            <button
                                onClick={handleCancel}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Batalkan
                            </button>
                        )}
                        <Link
                            href={route('jadwal.index')}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Detail Jadwal #${jadwal.id_jadwal}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Informasi Jadwal */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Informasi Jadwal
                                    </h3>
                                    <dl className="space-y-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                ID Jadwal
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                #{jadwal.id_jadwal}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Status
                                            </dt>
                                            <dd className="mt-1">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(jadwal.status_jadwal)}`}>
                                                    {jadwal.status_jadwal}
                                                </span>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Tanggal Janji Temu
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {new Date(jadwal.tanggal_janji).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Waktu
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {jadwal.jam_janji}
                                            </dd>
                                        </div>
                                        {isAdmin && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Client
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    <div>{jadwal.user?.name}</div>
                                                    <div className="text-gray-500">{jadwal.user?.email}</div>
                                                </dd>
                                            </div>
                                        )}
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Dibuat
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {new Date(jadwal.created_at).toLocaleDateString('id-ID', {
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
                                                {new Date(jadwal.updated_at).toLocaleDateString('id-ID', {
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

                                {/* Informasi Layanan Terkait */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Layanan Terkait
                                    </h3>
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <dl className="space-y-3">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">
                                                    ID Layanan
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    <Link
                                                        href={route('layanan.show', jadwal.layanan.id_layanan)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        #{jadwal.layanan.id_layanan}
                                                    </Link>
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Kategori Layanan
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {jadwal.layanan.kategori?.nama_kategori}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Status Layanan
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {jadwal.layanan.status?.nama_status}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Tanggal Pengajuan Layanan
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {new Date(jadwal.layanan.tanggal_pengajuan).toLocaleDateString('id-ID')}
                                                </dd>
                                            </div>
                                        </dl>
                                        
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <Link
                                                href={route('layanan.show', jadwal.layanan.id_layanan)}
                                                className="text-blue-600 hover:text-blue-900 text-sm"
                                            >
                                                Lihat Detail Layanan →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Information */}
                            {jadwal.status_jadwal === 'Pending' && (
                                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-yellow-800">
                                                Jadwal Menunggu Persetujuan
                                            </h3>
                                            <div className="mt-2 text-sm text-yellow-700">
                                                <p>Jadwal janji temu Anda sedang menunggu persetujuan dari admin. Anda akan menerima notifikasi setelah ada keputusan.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {jadwal.status_jadwal === 'Disetujui' && (
                                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-green-800">
                                                Jadwal Disetujui
                                            </h3>
                                            <div className="mt-2 text-sm text-green-700">
                                                <p>Jadwal janji temu Anda telah disetujui. Harap hadir tepat waktu sesuai jadwal yang telah ditentukan.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {jadwal.status_jadwal === 'Ditolak' && (
                                <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">
                                                Jadwal Ditolak
                                            </h3>
                                            <div className="mt-2 text-sm text-red-700">
                                                <p>Jadwal janji temu Anda ditolak. Anda dapat mengajukan jadwal baru dengan waktu yang berbeda.</p>
                                                {isClient && isOwner && (
                                                    <div className="mt-3">
                                                        <Link
                                                            href={route('jadwal.create', jadwal.layanan.id_layanan)}
                                                            className="text-red-800 underline hover:text-red-900"
                                                        >
                                                            Ajukan Jadwal Baru
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
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
