import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, notifikasi, filters }) {
    const [selectedFilter, setSelectedFilter] = useState(filters.status);

    const handleFilterChange = (status) => {
        setSelectedFilter(status);
        router.get(route('notifikasi.index'), { status }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleMarkAsRead = (notifikasiId) => {
        router.patch(route('notifikasi.mark-read', notifikasiId), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleMarkAllAsRead = () => {
        router.post(route('notifikasi.mark-all-read'), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const unreadCount = notifikasi.data.filter(n => !n.status_baca).length;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Notifikasi
                    </h2>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Tandai Semua Dibaca
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Notifikasi" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Filter Buttons */}
                            <div className="mb-6 flex space-x-4">
                                <button
                                    onClick={() => handleFilterChange('')}
                                    className={`px-4 py-2 rounded ${
                                        selectedFilter === '' 
                                            ? 'bg-blue-500 text-white' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Semua
                                </button>
                                <button
                                    onClick={() => handleFilterChange('unread')}
                                    className={`px-4 py-2 rounded ${
                                        selectedFilter === 'unread' 
                                            ? 'bg-blue-500 text-white' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Belum Dibaca ({unreadCount})
                                </button>
                                <button
                                    onClick={() => handleFilterChange('read')}
                                    className={`px-4 py-2 rounded ${
                                        selectedFilter === 'read' 
                                            ? 'bg-blue-500 text-white' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Sudah Dibaca
                                </button>
                            </div>

                            {/* Notifications List */}
                            {notifikasi.data.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-500 text-lg">
                                        {selectedFilter === 'unread' 
                                            ? 'Tidak ada notifikasi yang belum dibaca' 
                                            : selectedFilter === 'read'
                                            ? 'Tidak ada notifikasi yang sudah dibaca'
                                            : 'Belum ada notifikasi'
                                        }
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {notifikasi.data.map((notification) => (
                                        <div
                                            key={notification.id_notifikasi}
                                            className={`border rounded-lg p-4 transition-colors ${
                                                !notification.status_baca 
                                                    ? 'bg-blue-50 border-blue-200' 
                                                    : 'bg-white border-gray-200'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-start space-x-3">
                                                        {!notification.status_baca && (
                                                            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                                        )}
                                                        <div className="flex-1">
                                                            <p className={`text-gray-900 ${
                                                                !notification.status_baca ? 'font-semibold' : 'font-normal'
                                                            }`}>
                                                                {notification.isi_pesan}
                                                            </p>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {formatDate(notification.tanggal_kirim)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2 ml-4">
                                                    <Link
                                                        href={route('notifikasi.show', notification.id_notifikasi)}
                                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    >
                                                        Lihat Detail
                                                    </Link>
                                                    {!notification.status_baca && (
                                                        <button
                                                            onClick={() => handleMarkAsRead(notification.id_notifikasi)}
                                                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                                                        >
                                                            Tandai Dibaca
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {notifikasi.links && notifikasi.links.length > 3 && (
                                <div className="mt-6 flex justify-center">
                                    <nav className="flex space-x-2">
                                        {notifikasi.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    if (link.url) {
                                                        router.visit(link.url);
                                                    }
                                                }}
                                                disabled={!link.url}
                                                className={`px-3 py-2 text-sm rounded ${
                                                    link.active
                                                        ? 'bg-blue-500 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
