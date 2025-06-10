import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, adminUsers }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAdmins = adminUsers.filter(admin =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (adminUser) => {
        if (confirm(`Apakah Anda yakin ingin menghapus admin ${adminUser.name}?`)) {
            router.delete(route('admin-users.destroy', adminUser.id));
        }
    };

    const handleToggleStatus = (adminUser) => {
        const action = adminUser.email_verified_at ? 'menonaktifkan' : 'mengaktifkan';
        if (confirm(`Apakah Anda yakin ingin ${action} admin ${adminUser.name}?`)) {
            router.patch(route('admin-users.toggle-status', adminUser.id));
        }
    };

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
                        Manajemen Admin
                    </h2>
                    <Link
                        href={route('admin-users.create')}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Tambah Admin
                    </Link>
                </div>
            }
        >
            <Head title="Manajemen Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Search Bar */}
                            <div className="mb-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Cari admin berdasarkan nama atau email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {filteredAdmins.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-500 text-lg">
                                        {searchTerm ? 'Tidak ada admin yang sesuai dengan pencarian.' : 'Belum ada admin yang terdaftar.'}
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Admin
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Role
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tanggal Dibuat
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredAdmins.map((adminUser) => (
                                                <tr key={adminUser.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                    <span className="text-sm font-medium text-gray-700">
                                                                        {adminUser.name.charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {adminUser.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {adminUser.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(adminUser.roles[0]?.name)}`}>
                                                            {adminUser.roles[0]?.name === 'superadmin' ? 'Super Admin' : 'Admin'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(adminUser.email_verified_at)}`}>
                                                            {adminUser.email_verified_at ? 'Aktif' : 'Nonaktif'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(adminUser.created_at).toLocaleDateString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route('admin-users.show', adminUser.id)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                Lihat
                                                            </Link>
                                                            {adminUser.id !== auth.user.id && (
                                                                <>
                                                                    <Link
                                                                        href={route('admin-users.edit', adminUser.id)}
                                                                        className="text-indigo-600 hover:text-indigo-900"
                                                                    >
                                                                        Edit
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => handleToggleStatus(adminUser)}
                                                                        className="text-yellow-600 hover:text-yellow-900"
                                                                    >
                                                                        {adminUser.email_verified_at ? 'Nonaktifkan' : 'Aktifkan'}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(adminUser)}
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
        </AuthenticatedLayout>
    );
}
