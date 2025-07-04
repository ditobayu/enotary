import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import NotificationBell from '@/Components/NotificationBell';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const userRoles = usePage().props.auth.user.roles || [];
    const isAdmin = userRoles.some(role => role.name === 'admin' || role.name === 'superadmin');
    const isSuperAdmin = userRoles.some(role => role.name === 'superadmin');
    const isClient = userRoles.some(role => role.name === 'client');

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    href={route('layanan.index')}
                                    active={route().current('layanan.*')}
                                >
                                    {isAdmin ? 'Layanan' : 'Permohonan Layanan'}
                                </NavLink>
                                {isClient && (
                                    <NavLink
                                        href={route('jadwal.index')}
                                        active={route().current('jadwal.*')}
                                    >
                                        Jadwal Janji Temu
                                    </NavLink>
                                )}
                                {isAdmin && (
                                    <NavLink
                                        href={route('jadwal.pending')}
                                        active={route().current('jadwal.pending')}
                                    >
                                        Jadwal Pending
                                    </NavLink>
                                )}
                                {isClient && (
                                    <NavLink
                                        href={route('notifikasi.index')}
                                        active={route().current('notifikasi.*')}
                                    >
                                        Notifikasi
                                    </NavLink>
                                )}
                                {isAdmin && (
                                    <NavLink
                                        href={route('kategori-layanan.index')}
                                        active={route().current('kategori-layanan.*')}
                                    >
                                        Kategori Layanan
                                    </NavLink>
                                )}
                                {isAdmin && (
                                    <NavLink
                                        href={route('client-users.index')}
                                        active={route().current('client-users.*')}
                                    >
                                        Manajemen Client
                                    </NavLink>
                                )}
                                {isAdmin && (
                                    <NavLink
                                        href={route('rekap-data.index')}
                                        active={route().current('rekap-data.*')}
                                    >
                                        Rekap Data
                                    </NavLink>
                                )}
                                {isSuperAdmin && (
                                    <NavLink
                                        href={route('admin-users.index')}
                                        active={route().current('admin-users.*')}
                                    >
                                        Manajemen Admin
                                    </NavLink>
                                )}
                                {isSuperAdmin && (
                                    <NavLink
                                        href={route('log-aktivitas.index')}
                                        active={route().current('log-aktivitas.*')}
                                    >
                                        Log Aktivitas
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            {/* Notification Bell for Clients */}
                            <NotificationBell userRoles={userRoles} />
                            
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('layanan.index')}
                            active={route().current('layanan.*')}
                        >
                            {isAdmin ? 'Layanan' : 'Permohonan Layanan'}
                        </ResponsiveNavLink>
                        {isClient && (
                            <ResponsiveNavLink
                                href={route('jadwal.index')}
                                active={route().current('jadwal.*')}
                            >
                                Jadwal Janji Temu
                            </ResponsiveNavLink>
                        )}
                        {isAdmin && (
                            <ResponsiveNavLink
                                href={route('jadwal.pending')}
                                active={route().current('jadwal.pending')}
                            >
                                Jadwal Pending
                            </ResponsiveNavLink>
                        )}
                        {isClient && (
                            <ResponsiveNavLink
                                href={route('notifikasi.index')}
                                active={route().current('notifikasi.*')}
                            >
                                Notifikasi
                            </ResponsiveNavLink>
                        )}
                        {isAdmin && (
                            <ResponsiveNavLink
                                href={route('kategori-layanan.index')}
                                active={route().current('kategori-layanan.*')}
                            >
                                Kategori Layanan
                            </ResponsiveNavLink>
                        )}
                        {isAdmin && (
                            <ResponsiveNavLink
                                href={route('client-users.index')}
                                active={route().current('client-users.*')}
                            >
                                Manajemen Client
                            </ResponsiveNavLink>
                        )}
                        {isAdmin && (
                            <ResponsiveNavLink
                                href={route('rekap-data.index')}
                                active={route().current('rekap-data.*')}
                            >
                                Rekap Data
                            </ResponsiveNavLink>
                        )}
                        {isSuperAdmin && (
                            <ResponsiveNavLink
                                href={route('admin-users.index')}
                                active={route().current('admin-users.*')}
                            >
                                Manajemen Admin
                            </ResponsiveNavLink>
                        )}
                        {isSuperAdmin && (
                            <ResponsiveNavLink
                                href={route('log-aktivitas.index')}
                                active={route().current('log-aktivitas.*')}
                            >
                                Log Aktivitas
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
