import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function NotificationBell({ userRoles }) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    // Only show notifications for clients
    const isClient = userRoles?.some(role => role.name === 'client');
    
    useEffect(() => {
        if (!isClient) return;
        
        const fetchUnreadCount = async () => {
            try {
                const response = await fetch(route('notifikasi.unread-count'));
                const data = await response.json();
                setUnreadCount(data.count);
            } catch (error) {
                console.error('Failed to fetch unread count:', error);
            }
        };

        fetchUnreadCount();
        
        // Poll for updates every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000);
        
        return () => clearInterval(interval);
    }, [isClient]);

    if (!isClient) return null;

    return (
        <div className="relative">
            <Link
                href={route('notifikasi.index')}
                className="relative inline-flex items-center p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition duration-150 ease-in-out"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-5-5V9.5a6.5 6.5 0 10-13 0V12l-5 5h5a3 3 0 106 0z"
                    />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </Link>
        </div>
    );
}
