import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, adminUser }) {
    const getRoleBadgeColor = (roleName) => {
        return roleName === 'superadmin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
    };

    const getStatusBadgeColor = (isActive) => {
        return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Detail Admin: {adminUser.name}
                    </h2>
                    <div className="flex space-x-2">
                        {adminUser.id !== auth.user.id && (
                            <Link
                                href={route('admin-users.edit', adminUser.id)}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Edit Admin
                            </Link>
                        )}
                        <Link
                            href={route('admin-users.index')}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Detail Admin: ${adminUser.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Profile Header */}
                            <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
                                <div className="flex-shrink-0 h-20 w-20">
                                    <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-gray-700">
                                            {adminUser.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-6">
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {adminUser.name}
                                    </h3>
                                    <p className="text-lg text-gray-600 mt-1">
                                        {adminUser.email}
                                    </p>
                                    <div className="flex items-center space-x-3 mt-3">
                                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getRoleBadgeColor(adminUser.roles[0]?.name)}`}>
                                            {adminUser.roles[0]?.name === 'superadmin' ? 'Super Admin' : 'Admin'}
                                        </span>
                                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(adminUser.email_verified_at)}`}>
                                            {adminUser.email_verified_at ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Admin Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                        Informasi Akun
                                    </h4>
                                    
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">ID User</span>
                                                <p className="text-sm text-gray-900 mt-1">#{adminUser.id}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">NIK</span>
                                                <p className="text-sm text-gray-900 mt-1">{adminUser.nik}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Email</span>
                                                <p className="text-sm text-gray-900 mt-1">{adminUser.email}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Role</span>
                                                <p className="text-sm text-gray-900 mt-1">
                                                    {adminUser.roles[0]?.name === 'superadmin' ? 'Super Admin' : 'Admin'}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Status</span>
                                                <p className="text-sm text-gray-900 mt-1">
                                                    {adminUser.email_verified_at ? 'Aktif' : 'Nonaktif'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                        Informasi Waktu
                                    </h4>
                                    
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="space-y-3">
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Akun Dibuat</span>
                                                <p className="text-sm text-gray-900 mt-1">
                                                    {new Date(adminUser.created_at).toLocaleDateString('id-ID', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Terakhir Diperbarui</span>
                                                <p className="text-sm text-gray-900 mt-1">
                                                    {new Date(adminUser.updated_at).toLocaleDateString('id-ID', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            {adminUser.email_verified_at && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Email Diverifikasi</span>
                                                    <p className="text-sm text-gray-900 mt-1">
                                                        {new Date(adminUser.email_verified_at).toLocaleDateString('id-ID', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Permissions Information */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                    Hak Akses
                                </h4>
                                
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    {adminUser.roles[0]?.name === 'superadmin' ? (
                                        <div>
                                            <h5 className="font-medium text-blue-900 mb-2">Super Admin</h5>
                                            <ul className="text-sm text-blue-800 space-y-1">
                                                <li>• Akses penuh ke semua fitur sistem</li>
                                                <li>• Dapat mengelola admin lain (CRUD)</li>
                                                <li>• Dapat mengelola semua data layanan</li>
                                                <li>• Dapat melihat semua laporan dan analitik</li>
                                                <li>• Dapat mengatur konfigurasi sistem</li>
                                            </ul>
                                        </div>
                                    ) : (
                                        <div>
                                            <h5 className="font-medium text-blue-900 mb-2">Admin</h5>
                                            <ul className="text-sm text-blue-800 space-y-1">
                                                <li>• Dapat mengelola data layanan</li>
                                                <li>• Dapat melihat dan memproses permohonan</li>
                                                <li>• Dapat mengelola jadwal janji temu</li>
                                                <li>• Dapat mengelola kategori layanan</li>
                                                <li>• Tidak dapat mengelola admin lain</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
