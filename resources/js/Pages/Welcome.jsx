import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title="eNotary - Platform Notaris Digital Terpercaya" />
            <div className="min-h-screen bg-white">
                {/* Navigation Header */}
                <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
                }`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            {/* Logo */}
                            <div className="flex items-center space-x-2">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className={`text-2xl font-bold transition-colors ${
                                    isScrolled ? 'text-gray-900' : 'text-white'
                                }`}>eNotary</span>
                            </div>

                            {/* Navigation Menu */}
                            <nav className="hidden md:flex items-center space-x-8">
                                <a href="#beranda" className={`font-medium transition-colors hover:text-blue-600 ${
                                    isScrolled ? 'text-gray-700' : 'text-white/90'
                                }`}>Beranda</a>
                                <a href="#layanan" className={`font-medium transition-colors hover:text-blue-600 ${
                                    isScrolled ? 'text-gray-700' : 'text-white/90'
                                }`}>Layanan</a>
                                <a href="#keunggulan" className={`font-medium transition-colors hover:text-blue-600 ${
                                    isScrolled ? 'text-gray-700' : 'text-white/90'
                                }`}>Keunggulan</a>
                                <a href="#tentang" className={`font-medium transition-colors hover:text-blue-600 ${
                                    isScrolled ? 'text-gray-700' : 'text-white/90'
                                }`}>Tentang</a>
                            </nav>

                            {/* Auth Buttons */}
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className={`font-medium px-4 py-2 rounded-lg transition-all ${
                                                isScrolled 
                                                    ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                                                    : 'text-white/90 hover:text-white hover:bg-white/10'
                                            }`}
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                                        >
                                            Daftar
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section id="beranda" className="relative min-h-screen flex items-center justify-center pt-16">
                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
                        <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="max-w-4xl mx-auto">
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                                Layanan <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Notaris Digital</span> Terpercaya
                            </h1>
                            <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
                                Proses dokumen legal Anda dengan mudah, aman, dan terpercaya. 
                                Notaris bersertifikat siap melayani kebutuhan hukum Anda 24/7.
                            </p>
                            
                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                                <Link
                                    href={auth.user ? route('layanan.create') : route('register')}
                                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                                >
                                    {auth.user ? 'Ajukan Layanan' : 'Mulai Sekarang'}
                                </Link>
                                <button 
                                    onClick={() => document.getElementById('layanan').scrollIntoView({ behavior: 'smooth' })}
                                    className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                                >
                                    Pelajari Lebih Lanjut
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
                                <div className="flex items-center justify-center space-x-3">
                                    <div className="bg-white/20 p-3 rounded-full">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold">100% Aman</div>
                                        <div className="text-sm text-white/80">Keamanan Data Terjamin</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center space-x-3">
                                    <div className="bg-white/20 p-3 rounded-full">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold">24/7 Layanan</div>
                                        <div className="text-sm text-white/80">Siap Melayani Kapan Saja</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center space-x-3">
                                    <div className="bg-white/20 p-3 rounded-full">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold">Bersertifikat</div>
                                        <div className="text-sm text-white/80">Notaris Resmi & Terpercaya</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="layanan" className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Layanan <span className="text-blue-600">Notaris Kami</span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Kami menyediakan berbagai layanan notaris untuk memenuhi kebutuhan hukum Anda
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Service Card 1 */}
                            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-xl w-fit mb-6">
                                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Akta Jual Beli</h3>
                                <p className="text-gray-600 mb-6">Pembuatan akta jual beli untuk transaksi properti, tanah, dan aset berharga lainnya dengan proses yang aman dan legal.</p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center">
                                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Proses cepat dan efisien
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Sesuai ketentuan hukum
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Konsultasi gratis
                                    </li>
                                </ul>
                            </div>

                            {/* Service Card 2 */}
                            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                                <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 rounded-xl w-fit mb-6">
                                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Pendirian Perusahaan</h3>
                                <p className="text-gray-600 mb-6">Bantuan lengkap untuk pendirian PT, CV, dan badan usaha lainnya termasuk pembuatan akta pendirian yang sah.</p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center">
                                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Pengurusan lengkap
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Akta resmi dan legal
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Pendampingan ahli
                                    </li>
                                </ul>
                            </div>

                            {/* Service Card 3 */}
                            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-xl w-fit mb-6">
                                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Akta Perjanjian</h3>
                                <p className="text-gray-600 mb-6">Pembuatan berbagai jenis akta perjanjian seperti kontrak kerja, perjanjian kerjasama, dan dokumen legal lainnya.</p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center">
                                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Berbagai jenis perjanjian
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Kekuatan hukum penuh
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Review kontrak gratis
                                    </li>
                                </ul>
                            </div>

                            {/* Service Card 4 */}
                            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-xl w-fit mb-6">
                                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Akta Kuasa</h3>
                                <p className="text-gray-600 mb-6">Pembuatan surat kuasa untuk berbagai keperluan hukum dengan otentifikasi notaris yang sah dan mengikat.</p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center">
                                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Surat kuasa khusus & umum
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Otentifikasi resmi
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Berlaku di seluruh Indonesia
                                    </li>
                                </ul>
                            </div>

                            {/* Service Card 5 */}
                            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                                <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-4 rounded-xl w-fit mb-6">
                                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Legalisasi Dokumen</h3>
                                <p className="text-gray-600 mb-6">Layanan legalisasi berbagai dokumen penting untuk keperluan resmi dengan cap dan tanda tangan notaris.</p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center">
                                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Legalisasi fotokopi
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Waarmerking dokumen
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Proses hari yang sama
                                    </li>
                                </ul>
                            </div>

                            {/* Service Card 6 */}
                            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                                <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-4 rounded-xl w-fit mb-6">
                                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Akta Wasiat</h3>
                                <p className="text-gray-600 mb-6">Pembuatan akta wasiat yang sah untuk mengatur pembagian harta warisan sesuai dengan keinginan pewaris.</p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center">
                                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Wasiat terbuka & tertutup
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Kerahasiaan terjamin
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Konsultasi waris gratis
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="text-center mt-12">
                            <Link
                                href={auth.user ? route('layanan.create') : route('register')}
                                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
                            >
                                {auth.user ? 'Ajukan Layanan Sekarang' : 'Mulai Layanan Anda'}
                                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features/Benefits Section */}
                <section id="keunggulan" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Mengapa Memilih <span className="text-blue-600">eNotary?</span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Platform digital yang menggabungkan keahlian notaris berpengalaman dengan teknologi modern
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Feature 1 */}
                            <div className="text-center group">
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-2xl mx-auto w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Proses Cepat</h3>
                                <p className="text-gray-600">Dokumentasi selesai dalam hitungan jam, bukan hari. Sistem otomatis mempercepat proses administrasi.</p>
                            </div>

                            {/* Feature 2 */}
                            <div className="text-center group">
                                <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-2xl mx-auto w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Keamanan Tinggi</h3>
                                <p className="text-gray-600">Enkripsi end-to-end dan sistem keamanan berlapis melindungi data pribadi dan dokumen penting Anda.</p>
                            </div>

                            {/* Feature 3 */}
                            <div className="text-center group">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-2xl mx-auto w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Biaya Transparan</h3>
                                <p className="text-gray-600">Tidak ada biaya tersembunyi. Harga yang jelas dan kompetitif untuk setiap jenis layanan notaris.</p>
                            </div>

                            {/* Feature 4 */}
                            <div className="text-center group">
                                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-2xl mx-auto w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Support 24/7</h3>
                                <p className="text-gray-600">Tim customer service siap membantu Anda kapan saja. Konsultasi gratis untuk semua klien.</p>
                            </div>
                        </div>

                        {/* Process Steps */}
                        <div className="mt-20">
                            <div className="text-center mb-12">
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">Cara Kerja Platform</h3>
                                <p className="text-lg text-gray-600">Hanya 4 langkah mudah untuk mendapatkan layanan notaris terbaik</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {/* Step 1 */}
                                <div className="relative">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">1</div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Daftar & Login</h4>
                                        <p className="text-gray-600">Buat akun dengan mudah dan masuk ke platform eNotary</p>
                                    </div>
                                    {/* Arrow */}
                                    <div className="hidden lg:block absolute top-8 -right-4 text-gray-300">
                                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="relative">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">2</div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Pilih Layanan</h4>
                                        <p className="text-gray-600">Pilih jenis layanan notaris yang Anda butuhkan</p>
                                    </div>
                                    {/* Arrow */}
                                    <div className="hidden lg:block absolute top-8 -right-4 text-gray-300">
                                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="relative">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">3</div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Upload Dokumen</h4>
                                        <p className="text-gray-600">Upload dokumen yang diperlukan dengan aman</p>
                                    </div>
                                    {/* Arrow */}
                                    <div className="hidden lg:block absolute top-8 -right-4 text-gray-300">
                                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Step 4 */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="bg-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">4</div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Terima Dokumen</h4>
                                    <p className="text-gray-600">Dokumen legal siap dan dapat diunduh</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About/Trust Section */}
                <section id="tentang" className="py-20 bg-gradient-to-r from-gray-900 to-blue-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Left Content */}
                            <div className="text-white">
                                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                    Tentang <span className="text-yellow-400">eNotary</span>
                                </h2>
                                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                    eNotary adalah platform digital terdepan yang menghubungkan Anda dengan notaris bersertifikat. 
                                    Kami berkomitmen memberikan layanan notaris yang mudah diakses, aman, dan terpercaya.
                                </p>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-yellow-400 p-2 rounded-lg">
                                            <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Notaris Bersertifikat</h3>
                                            <p className="text-gray-300">Seluruh notaris telah tersertifikasi dan memiliki pengalaman puluhan tahun</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-yellow-400 p-2 rounded-lg">
                                            <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Keamanan Data</h3>
                                            <p className="text-gray-300">Sistem enkripsi tingkat militer melindungi semua data dan dokumen Anda</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-yellow-400 p-2 rounded-lg">
                                            <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Proses Digital</h3>
                                            <p className="text-gray-300">Tanpa perlu datang ke kantor, semua proses dapat dilakukan secara online</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Stats */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center">
                                    <div className="text-4xl font-bold text-yellow-400 mb-2">5000+</div>
                                    <div className="text-white">Dokumen Diproses</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center">
                                    <div className="text-4xl font-bold text-yellow-400 mb-2">98%</div>
                                    <div className="text-white">Kepuasan Klien</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center">
                                    <div className="text-4xl font-bold text-yellow-400 mb-2">24/7</div>
                                    <div className="text-white">Layanan Support</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center">
                                    <div className="text-4xl font-bold text-yellow-400 mb-2">100%</div>
                                    <div className="text-white">Legal & Aman</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Siap Memulai Proses Notaris Anda?
                        </h2>
                        <p className="text-xl text-blue-100 mb-10">
                            Bergabunglah dengan ribuan klien yang telah mempercayai layanan notaris digital kami
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href={auth.user ? route('layanan.create') : route('register')}
                                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
                            >
                                {auth.user ? 'Ajukan Layanan Sekarang' : 'Daftar Gratis Sekarang'}
                            </Link>
                            
                            {!auth.user && (
                                <Link
                                    href={route('login')}
                                    className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                                >
                                    Sudah Punya Akun? Masuk
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Logo & Description */}
                            <div className="col-span-1 md:col-span-2">
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                                        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-2xl font-bold">eNotary</span>
                                </div>
                                <p className="text-gray-300 mb-6 max-w-md">
                                    Platform notaris digital terpercaya yang menghubungkan Anda dengan notaris bersertifikat untuk semua kebutuhan legal Anda.
                                </p>
                                <div className="flex space-x-4">
                                    <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                        </svg>
                                    </a>
                                    <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                                        </svg>
                                    </a>
                                    <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Layanan</h3>
                                <ul className="space-y-2 text-gray-300">
                                    <li><a href="#" className="hover:text-white transition-colors">Akta Jual Beli</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Pendirian Perusahaan</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Akta Perjanjian</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Legalisasi Dokumen</a></li>
                                </ul>
                            </div>

                            {/* Contact */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Kontak</h3>
                                <ul className="space-y-2 text-gray-300">
                                    <li className="flex items-center">
                                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        info@enotary.com
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        +62 21 1234 5678
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Jakarta, Indonesia
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                            <p>&copy; 2024 eNotary. Seluruh hak cipta dilindungi undang-undang.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
