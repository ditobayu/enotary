import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, notifikasi }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Detail Notifikasi
                    </h2>
                    <Link
                        href={route('notifikasi.index')}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Kembali ke Daftar
                    </Link>
                </div>
            }
        >
            <Head title="Detail Notifikasi" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="space-y-6">
                                {/* Status Badge */}
                                <div className="flex items-center space-x-3">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        notifikasi.status_baca 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {notifikasi.status_baca ? 'Sudah Dibaca' : 'Belum Dibaca'}
                                    </span>
                                </div>

                                {/* Notification Content */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Isi Pesan
                                    </h3>
                                    <div className="prose max-w-none">
                                        <p className="text-gray-800 leading-relaxed">
                                            {notifikasi.isi_pesan}
                                        </p>
                                    </div>
                                </div>

                                {/* Notification Details */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Detail Notifikasi
                                    </h3>
                                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                ID Notifikasi
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                #{notifikasi.id_notifikasi}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Tanggal Dikirim
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {formatDate(notifikasi.tanggal_kirim)}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Status Baca
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {notifikasi.status_baca ? 'Sudah Dibaca' : 'Belum Dibaca'}
                                            </dd>
                                        </div>
                                        {notifikasi.updated_at !== notifikasi.created_at && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Terakhir Diperbarui
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {formatDate(notifikasi.updated_at)}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>

                                {/* Navigation Actions */}
                                <div className="border-t pt-6">
                                    <div className="flex justify-between">
                                        <Link
                                            href={route('notifikasi.index')}
                                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                        >
                                            ← Kembali ke Daftar
                                        </Link>
                                        
                                        <Link
                                            href={route('layanan.index')}
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Lihat Layanan Saya
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
