import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, logAktivitas }) {
    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getRoleBadgeColor = (roleName) => {
        return roleName === 'admin' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-green-100 text-green-800';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Detail Log Aktivitas
                    </h2>
                    <Link
                        href={route('log-aktivitas.index')}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Kembali
                    </Link>
                </div>
            }
        >
            <Head title="Detail Log Aktivitas" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* User Information */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Informasi User
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12">
                                                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-lg font-medium text-gray-700">
                                                        {logAktivitas.user?.name?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-lg font-medium text-gray-900">
                                                    {logAktivitas.user?.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {logAktivitas.user?.email}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Role</dt>
                                            <dd className="mt-1">
                                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getRoleBadgeColor(logAktivitas.user?.roles[0]?.name)}`}>
                                                    {logAktivitas.user?.roles[0]?.name === 'admin' ? 'Admin' : 'Client'}
                                                </span>
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">User ID</dt>
                                            <dd className="mt-1 text-sm text-gray-900">#{logAktivitas.user?.id}</dd>
                                        </div>
                                    </div>
                                </div>

                                {/* Activity Information */}
                                <div className="bg-blue-50 rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Informasi Aktivitas
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">ID Log</dt>
                                            <dd className="mt-1 text-sm text-gray-900">#{logAktivitas.id_log}</dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Tanggal & Waktu</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {formatDateTime(logAktivitas.tanggal_waktu)}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Waktu Relatif</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {new Date(logAktivitas.tanggal_waktu).toLocaleString('id-ID')}
                                            </dd>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Details */}
                            <div className="mt-8">
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Detail Aktivitas
                                    </h3>
                                    
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-900 leading-relaxed">
                                            {logAktivitas.aktivitas}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Timeline */}
                            <div className="mt-8">
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Timeline Aktivitas
                                    </h3>
                                    
                                    <div className="flow-root">
                                        <ul className="-mb-8">
                                            <li>
                                                <div className="relative pb-8">
                                                    <div className="relative flex space-x-3">
                                                        <div>
                                                            <span className="bg-blue-500 h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white">
                                                                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            </span>
                                                        </div>
                                                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                            <div>
                                                                <p className="text-sm text-gray-500">
                                                                    Aktivitas dilakukan oleh{' '}
                                                                    <span className="font-medium text-gray-900">
                                                                        {logAktivitas.user?.name}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                                <time dateTime={logAktivitas.tanggal_waktu}>
                                                                    {formatDateTime(logAktivitas.tanggal_waktu)}
                                                                </time>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 flex justify-between">
                                <Link
                                    href={route('log-aktivitas.index')}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    ← Kembali ke Daftar
                                </Link>
                                
                                {logAktivitas.user && (
                                    <div className="text-sm text-gray-500">
                                        Log ID: #{logAktivitas.id_log} | User ID: #{logAktivitas.user.id}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
