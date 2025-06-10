import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, logAktivitas, users, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedUser, setSelectedUser] = useState(filters.user || '');
    const [selectedRole, setSelectedRole] = useState(filters.role || '');
    const [selectedDate, setSelectedDate] = useState(filters.date || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('log-aktivitas.index'), {
            search: searchTerm,
            user: selectedUser,
            role: selectedRole,
            date: selectedDate,
        }, {
            preserveState: true,
        });
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedUser('');
        setSelectedRole('');
        setSelectedDate('');
        router.get(route('log-aktivitas.index'));
    };

    const getRoleBadgeColor = (roleName) => {
        return roleName === 'admin' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-green-100 text-green-800';
    };

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Log Aktivitas
                    </h2>
                </div>
            }
        >
            <Head title="Log Aktivitas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filter Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Log Aktivitas</h3>
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Pencarian
                                        </label>
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Cari aktivitas atau nama user..."
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            User
                                        </label>
                                        <select
                                            value={selectedUser}
                                            onChange={(e) => setSelectedUser(e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">Semua User</option>
                                            {users.map(user => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name} ({user.roles[0]?.name})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Role
                                        </label>
                                        <select
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">Semua Role</option>
                                            <option value="client">Client</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tanggal
                                        </label>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Filter
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Activity Logs Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Daftar Log Aktivitas
                                </h3>
                                <div className="text-sm text-gray-600">
                                    Total: {logAktivitas.total} log aktivitas
                                </div>
                            </div>

                            {logAktivitas.data.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-500 text-lg mb-2">Tidak ada log aktivitas</div>
                                    <p className="text-gray-400">Belum ada aktivitas yang dicatat dalam sistem.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        User
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Role
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Aktivitas
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Tanggal & Waktu
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Aksi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {logAktivitas.data.map((log) => (
                                                    <tr key={log.id_log} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10">
                                                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                        <span className="text-sm font-medium text-gray-700">
                                                                            {log.user?.name?.charAt(0).toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {log.user?.name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {log.user?.email}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(log.user?.roles[0]?.name)}`}>
                                                                {log.user?.roles[0]?.name === 'admin' ? 'Admin' : 'Client'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                                {log.aktivitas}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {formatDateTime(log.tanggal_waktu)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <Link
                                                                href={route('log-aktivitas.show', log.id_log)}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                Detail
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {logAktivitas.last_page > 1 && (
                                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6">
                                            <div className="flex-1 flex justify-between sm:hidden">
                                                {logAktivitas.prev_page_url && (
                                                    <Link
                                                        href={logAktivitas.prev_page_url}
                                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        Previous
                                                    </Link>
                                                )}
                                                {logAktivitas.next_page_url && (
                                                    <Link
                                                        href={logAktivitas.next_page_url}
                                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        Next
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-700">
                                                        Showing{' '}
                                                        <span className="font-medium">{logAktivitas.from}</span>
                                                        {' '}to{' '}
                                                        <span className="font-medium">{logAktivitas.to}</span>
                                                        {' '}of{' '}
                                                        <span className="font-medium">{logAktivitas.total}</span>
                                                        {' '}results
                                                    </p>
                                                </div>
                                                <div>
                                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                        {logAktivitas.prev_page_url && (
                                                            <Link
                                                                href={logAktivitas.prev_page_url}
                                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                                            >
                                                                Previous
                                                            </Link>
                                                        )}
                                                        {logAktivitas.next_page_url && (
                                                            <Link
                                                                href={logAktivitas.next_page_url}
                                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                                            >
                                                                Next
                                                            </Link>
                                                        )}
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
