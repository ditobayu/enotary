import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ auth, layanan, statusLayanan = [] }) {
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    
    const { data, setData, patch, processing, errors, reset } = useForm({
        id_status: layanan.id_status,
        keterangan_admin: ''
    });

    const { 
        data: uploadData, 
        setData: setUploadData, 
        post: uploadPost, 
        processing: uploadProcessing, 
        errors: uploadErrors,
        reset: uploadReset 
    } = useForm({
        dokumen: []
    });

    const getStatusBadgeColor = (status) => {
        const colors = {
            'Pengajuan': 'bg-blue-100 text-blue-800',
            'Diproses': 'bg-yellow-100 text-yellow-800',
            'Menunggu Dokumen': 'bg-orange-100 text-orange-800',
            'Review': 'bg-purple-100 text-purple-800',
            'Selesai': 'bg-green-100 text-green-800',
            'Ditolak': 'bg-red-100 text-red-800',
            'Dibatalkan': 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const canEdit = layanan.status.nama_status === 'Pengajuan' && 
                   (auth.user.roles?.some(role => ['admin', 'superadmin'].includes(role.name)) || layanan.id_user === auth.user.id);

    const isAdmin = auth.user.roles?.some(role => ['admin', 'superadmin'].includes(role.name));
    const canUpload = isAdmin || (layanan.id_user === auth.user.id);
    const canDeleteDocs = isAdmin || (layanan.id_user === auth.user.id && layanan.status.nama_status === 'Pengajuan');

    const handleStatusUpdate = (e) => {
        e.preventDefault();
        
        patch(route('layanan.update-status', layanan.id_layanan), {
            onSuccess: () => {
                setShowStatusModal(false);
                reset('keterangan_admin');
            }
        });
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => {
            const maxSize = 10 * 1024 * 1024; // 10MB
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            
            if (file.size > maxSize) {
                alert(`File ${file.name} terlalu besar. Maksimal 10MB.`);
                return false;
            }
            
            if (!allowedTypes.includes(file.type)) {
                alert(`File ${file.name} tidak didukung. Hanya PDF, DOC, DOCX, JPG, PNG yang diizinkan.`);
                return false;
            }
            
            return true;
        });
        
        setSelectedFiles(validFiles);
        setUploadData('dokumen', validFiles);
    };

    const handleUpload = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        selectedFiles.forEach((file, index) => {
            formData.append(`dokumen[${index}]`, file);
        });
        
        uploadPost(route('layanan.upload-dokumen', layanan.id_layanan), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                setShowUploadModal(false);
                setSelectedFiles([]);
                uploadReset();
            }
        });
    };

    const handleDeleteDocument = (dokumen) => {
        if (confirm(`Apakah Anda yakin ingin menghapus dokumen "${dokumen.nama_dokumen}"?`)) {
            router.delete(route('dokumen.delete', dokumen.id_dokumen));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Detail Layanan #{layanan.id_layanan}
                    </h2>
                    <div className="flex space-x-2">
                        {canEdit && (
                            <Link
                                href={route('layanan.edit', layanan.id_layanan)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Edit
                            </Link>
                        )}
                        {/* Tombol Buat Janji Temu untuk Client */}
                        {auth.user.roles?.some(role => role.name === 'client') && layanan.id_user === auth.user.id && (
                            <Link
                                href={route('jadwal.create', layanan.id_layanan)}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Buat Janji Temu
                            </Link>
                        )}
                        {isAdmin && (
                            <button
                                onClick={() => setShowStatusModal(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Update Status
                            </button>
                        )}
                        <Link
                            href={route('layanan.index')}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Detail Layanan #${layanan.id_layanan}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Informasi Layanan */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Informasi Layanan
                                    </h3>
                                    <dl className="space-y-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                ID Layanan
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                #{layanan.id_layanan}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Kategori Layanan
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {layanan.kategori?.nama_kategori}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Status
                                            </dt>
                                            <dd className="mt-1">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(layanan.status?.nama_status)}`}>
                                                    {layanan.status?.nama_status}
                                                </span>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Tanggal Pengajuan
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {new Date(layanan.tanggal_pengajuan).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </dd>
                                        </div>
                                        {auth.user.roles?.some(role => ['admin', 'superadmin'].includes(role.name)) && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Client
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {layanan.user?.name} ({layanan.user?.email})
                                                </dd>
                                            </div>
                                        )}
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Dibuat
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {new Date(layanan.created_at).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Terakhir Diupdate
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {new Date(layanan.updated_at).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                {/* Keterangan */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Keterangan dan Detail Permintaan
                                    </h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                            {layanan.keterangan}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Dokumen Terkait */}
                            <div className="mt-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Dokumen Terkait
                                    </h3>
                                    {canUpload && (
                                        <button 
                                            onClick={() => setShowUploadModal(true)}
                                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-sm"
                                        >
                                            Upload Dokumen
                                        </button>
                                    )}
                                </div>
                                {layanan.dokumen && layanan.dokumen.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {layanan.dokumen.map((dokumen) => (
                                            <div key={dokumen.id_dokumen} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-gray-900 text-sm truncate">
                                                            {dokumen.nama_dokumen}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Diupload: {new Date(dokumen.tanggal_upload).toLocaleDateString('id-ID')}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col space-y-1 ml-2">
                                                        <a
                                                            href={route('dokumen.download', dokumen.id_dokumen)}
                                                            className="text-blue-600 hover:text-blue-900 text-xs"
                                                        >
                                                            Download
                                                        </a>
                                                        {canDeleteDocs && (
                                                            <button
                                                                onClick={() => handleDeleteDocument(dokumen)}
                                                                className="text-red-600 hover:text-red-900 text-xs"
                                                            >
                                                                Hapus
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="mt-2">Belum ada dokumen yang diupload.</p>
                                        <p className="text-sm text-gray-400">Upload dokumen pendukung untuk mempercepat proses layanan.</p>
                                    </div>
                                )}
                            </div>

                            {/* Jadwal */}
                            {layanan.jadwal && layanan.jadwal.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Jadwal Pertemuan
                                    </h3>
                                    <div className="space-y-4">
                                        {layanan.jadwal.map((jadwal) => (
                                            <div key={jadwal.id_jadwal} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">
                                                            Pertemuan #{jadwal.id_jadwal}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {new Date(jadwal.tanggal_janji).toLocaleDateString('id-ID', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })} - {jadwal.jam_janji}
                                                        </p>
                                                        {jadwal.tempat && (
                                                            <p className="text-sm text-gray-600">
                                                                Tempat: {jadwal.tempat}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        jadwal.status_jadwal === 'Aktif' ? 'bg-green-100 text-green-800' :
                                                        jadwal.status_jadwal === 'Cancel' ? 'bg-red-100 text-red-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {jadwal.status_jadwal}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Update Status Layanan
                            </h3>
                            <form onSubmit={handleStatusUpdate}>
                                <div className="mb-4">
                                    <label htmlFor="id_status" className="block text-sm font-medium text-gray-700">
                                        Status Baru
                                    </label>
                                    <select
                                        id="id_status"
                                        value={data.id_status}
                                        onChange={(e) => setData('id_status', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        {statusLayanan.map((status) => (
                                            <option key={status.id_status} value={status.id_status}>
                                                {status.nama_status}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.id_status && (
                                        <p className="mt-1 text-sm text-red-600">{errors.id_status}</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="keterangan_admin" className="block text-sm font-medium text-gray-700">
                                        Keterangan (Opsional)
                                    </label>
                                    <textarea
                                        id="keterangan_admin"
                                        value={data.keterangan_admin}
                                        onChange={(e) => setData('keterangan_admin', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        rows="3"
                                        placeholder="Tambahkan keterangan untuk perubahan status ini..."
                                    />
                                    {errors.keterangan_admin && (
                                        <p className="mt-1 text-sm text-red-600">{errors.keterangan_admin}</p>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowStatusModal(false);
                                            reset('keterangan_admin');
                                        }}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Update Status'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Document Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Upload Dokumen Pendukung
                            </h3>
                            <form onSubmit={handleUpload}>
                                <div className="mb-4">
                                    <label htmlFor="dokumen" className="block text-sm font-medium text-gray-700 mb-2">
                                        Pilih File
                                    </label>
                                    <input
                                        type="file"
                                        id="dokumen"
                                        multiple
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        onChange={handleFileSelect}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Format yang didukung: PDF, DOC, DOCX, JPG, PNG. Maksimal 10MB per file.
                                    </p>
                                    {uploadErrors.dokumen && (
                                        <p className="mt-1 text-sm text-red-600">{uploadErrors.dokumen}</p>
                                    )}
                                </div>

                                {selectedFiles.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">File yang dipilih:</h4>
                                        <ul className="space-y-1">
                                            {selectedFiles.map((file, index) => (
                                                <li key={index} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                                                    <span className="truncate">{file.name}</span>
                                                    <span className="text-gray-500 ml-2">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowUploadModal(false);
                                            setSelectedFiles([]);
                                            uploadReset();
                                        }}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploadProcessing || selectedFiles.length === 0}
                                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        {uploadProcessing ? 'Mengupload...' : 'Upload'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
