import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, clients, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [sortBy, setSortBy] = useState(filters.sort || 'name');
    const [sortOrder, setSortOrder] = useState(filters.order || 'asc');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('client-users.index'), {
            search: searchTerm,
            sort: sortBy,
            order: sortOrder,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSort = (field) => {
        const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
        router.get(route('client-users.index'), {
            search: searchTerm,
            sort: field,
            order: newOrder,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const getSortIcon = (field) => {
        if (sortBy !== field) return '⇅';
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const getStatusBadgeColor = (layananCount) => {
        if (layananCount === 0) return 'bg-gray-100 text-gray-800';
        if (layananCount <= 3) return 'bg-blue-100 text-blue-800';
        return 'bg-green-100 text-green-800';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Manajemen Client
                    </h2>
                    <div className="text-sm text-gray-600">
                        Total Client: {clients.total}
                    </div>
                </div>
            }
        >
            <Head title="Manajemen Client" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Search and Filter Bar */}
                            <div className="mb-6">
                                <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
                                    <div className="flex-1 min-w-64">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cari Client
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Cari berdasarkan nama atau email..."
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
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Urutkan
                                        </label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="name">Nama</option>
                                            <option value="email">Email</option>
                                            <option value="created_at">Tanggal Daftar</option>
                                            <option value="layanan_count">Jumlah Layanan</option>
                                            <option value="jadwal_count">Jumlah Jadwal</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Order
                                        </label>
                                        <select
                                            value={sortOrder}
                                            onChange={(e) => setSortOrder(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="asc">A-Z / Terlama</option>
                                            <option value="desc">Z-A / Terbaru</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Cari
                                    </button>

                                    {(filters.search || filters.sort !== 'name' || filters.order !== 'asc') && (
                                        <Link
                                            href={route('client-users.index')}
                                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                        >
                                            Reset
                                        </Link>
                                    )}
                                </form>
                            </div>

                            {/* Client Table */}
                            {clients.data.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-500 text-lg">
                                        {filters.search ? 'Tidak ada client yang sesuai dengan pencarian.' : 'Belum ada client yang terdaftar.'}
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th 
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleSort('name')}
                                                >
                                                    Client {getSortIcon('name')}
                                                </th>
                                                <th 
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleSort('email')}
                                                >
                                                    Email {getSortIcon('email')}
                                                </th>
                                                <th 
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleSort('layanan_count')}
                                                >
                                                    Layanan {getSortIcon('layanan_count')}
                                                </th>
                                                <th 
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleSort('jadwal_count')}
                                                >
                                                    Jadwal {getSortIcon('jadwal_count')}
                                                </th>
                                                <th 
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleSort('created_at')}
                                                >
                                                    Terdaftar {getSortIcon('created_at')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {clients.data.map((client) => (
                                                <tr key={client.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                    <span className="text-sm font-medium text-blue-800">
                                                                        {client.name.charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {client.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    Client ID: #{client.id}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {client.email}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(client.layanan_count)}`}>
                                                            {client.layanan_count} layanan
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm text-gray-900">
                                                            {client.jadwal_count} jadwal
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(client.created_at).toLocaleDateString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route('client-users.show', client.id)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                Lihat Detail
                                                            </Link>
                                                            <Link
                                                                href={route('client-users.layanan', client.id)}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Layanan
                                                            </Link>
                                                            <Link
                                                                href={route('client-users.jadwal', client.id)}
                                                                className="text-purple-600 hover:text-purple-900"
                                                            >
                                                                Jadwal
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
                            {clients.data.length > 0 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Menampilkan {clients.from} - {clients.to} dari {clients.total} client
                                    </div>
                                    <div className="flex space-x-2">
                                        {clients.links && clients.links.map((link, index) => {
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
