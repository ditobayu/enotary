import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ auth, kategoriLayanan }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        id_kategori: '',
        keterangan: '',
        dokumen: []
    });

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => {
            const maxSize = 10 * 1024 * 1024; // 10MB per file
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            
            if (file.size > maxSize) {
                alert(`File ${file.name} terlalu besar. Maksimal 10MB per file.`);
                return false;
            }
            
            if (!allowedTypes.includes(file.type)) {
                alert(`File ${file.name} tidak didukung. Hanya PDF, DOC, DOCX, JPG, PNG yang diizinkan.`);
                return false;
            }
            
            return true;
        });
        
        // Check total size after adding new files
        const currentTotalSize = selectedFiles.reduce((total, file) => total + file.size, 0);
        const newFilesTotalSize = validFiles.reduce((total, file) => total + file.size, 0);
        const totalSize = currentTotalSize + newFilesTotalSize;
        const maxTotalSize = 8 * 1024 * 1024; // 8MB server limit
        
        if (totalSize > maxTotalSize) {
            const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
            const maxSizeMB = (maxTotalSize / 1024 / 1024).toFixed(2);
            const currentSizeMB = (currentTotalSize / 1024 / 1024).toFixed(2);
            
            alert(`Tidak dapat menambahkan file. Total ukuran akan menjadi ${totalSizeMB} MB dan melebihi batas maksimal server (${maxSizeMB} MB). Ukuran saat ini: ${currentSizeMB} MB.`);
            
            // Reset the file input
            e.target.value = '';
            return;
        }
        
        const newSelectedFiles = [...selectedFiles, ...validFiles];
        setSelectedFiles(newSelectedFiles);
        setData('dokumen', newSelectedFiles);
        
        // Reset the file input to allow selecting the same files again if needed
        e.target.value = '';
    };

    const removeFile = (index) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        setData('dokumen', newFiles);
    };

    const submit = (e) => {
        e.preventDefault();
        
        // Calculate total file size
        const totalSize = selectedFiles.reduce((total, file) => total + file.size, 0);
        const maxTotalSize = 8 * 1024 * 1024; // 8MB server limit
        
        // Check if total size exceeds server limit
        if (totalSize > maxTotalSize) {
            const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
            const maxSizeMB = (maxTotalSize / 1024 / 1024).toFixed(2);
            
            alert(`Total ukuran file (${totalSizeMB} MB) melebihi batas maksimal server (${maxSizeMB} MB). Silakan kurangi jumlah atau ukuran file yang diupload.`);
            return;
        }
        
        const formData = new FormData();
        formData.append('id_kategori', data.id_kategori);
        formData.append('keterangan', data.keterangan);
        
        selectedFiles.forEach((file, index) => {
            formData.append(`dokumen[${index}]`, file);
        });
        
        post(route('layanan.store'), {
            data: formData,
            forceFormData: true
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Ajukan Layanan Baru
                    </h2>
                    <Link
                        href={route('layanan.index')}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Kembali
                    </Link>
                </div>
            }
        >
            <Head title="Ajukan Layanan Baru" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Informasi Permohonan Layanan
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Silakan isi formulir di bawah ini untuk mengajukan layanan notaris. 
                                    Pastikan informasi yang Anda berikan lengkap dan akurat.
                                </p>
                            </div>
                            
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="id_kategori" value="Kategori Layanan" />
                                    <select
                                        id="id_kategori"
                                        name="id_kategori"
                                        value={data.id_kategori}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('id_kategori', e.target.value)}
                                        required
                                    >
                                        <option value="">Pilih Kategori Layanan</option>
                                        {kategoriLayanan.map((kategori) => (
                                            <option key={kategori.id_kategori} value={kategori.id_kategori}>
                                                {kategori.nama_kategori}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.id_kategori} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="keterangan" value="Keterangan dan Detail Permintaan" />
                                    <textarea
                                        id="keterangan"
                                        name="keterangan"
                                        value={data.keterangan}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows="6"
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                        placeholder="Jelaskan detail permintaan layanan Anda, termasuk:&#10;- Dokumen yang perlu dinotaris&#10;- Tanggal yang diinginkan&#10;- Informasi tambahan yang relevan&#10;- Pertanyaan khusus (jika ada)"
                                        required
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Minimum 10 karakter. Berikan detail yang jelas untuk membantu kami memproses permintaan Anda.
                                    </p>
                                    <InputError message={errors.keterangan} className="mt-2" />
                                </div>

                                {/* Document Upload Section */}
                                <div>
                                    <InputLabel value="Upload Dokumen Pendukung (Opsional)" />
                                    <div className="mt-2 space-y-4">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <input
                                                type="file"
                                                multiple
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                onChange={handleFileSelect}
                                                className="hidden"
                                                id="file-upload"
                                            />
                                            <label htmlFor="file-upload" className="cursor-pointer">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <div className="mt-2">
                                                    <span className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                                        Klik untuk upload dokumen
                                                    </span>
                                                    <p className="text-sm text-gray-500">atau drag and drop</p>
                                                </div>
                                            </label>
                                        </div>
                                        
                                        <div className="text-xs text-gray-500">
                                            <p>• Format yang didukung: PDF, DOC, DOCX, JPG, PNG</p>
                                            <p>• Maksimal ukuran per file: 10MB</p>
                                            <p>• Maksimal total ukuran semua file: 8MB</p>
                                            <p>• Anda dapat mengupload beberapa file sekaligus</p>
                                        </div>

                                        {/* Selected Files List */}
                                        {selectedFiles.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-medium text-gray-700">File yang dipilih:</h4>
                                                    <div className={`text-xs ${
                                                        (() => {
                                                            const totalSize = selectedFiles.reduce((total, file) => total + file.size, 0);
                                                            const maxSize = 8 * 1024 * 1024;
                                                            const percentage = (totalSize / maxSize) * 100;
                                                            
                                                            if (percentage > 90) return 'text-red-600 font-medium';
                                                            if (percentage > 70) return 'text-yellow-600 font-medium';
                                                            return 'text-gray-500';
                                                        })()
                                                    }`}>
                                                        Total: {(selectedFiles.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(2)} MB / 8.00 MB
                                                        {(() => {
                                                            const totalSize = selectedFiles.reduce((total, file) => total + file.size, 0);
                                                            const percentage = (totalSize / (8 * 1024 * 1024)) * 100;
                                                            if (percentage > 90) return ' ⚠️';
                                                            if (percentage > 70) return ' ⚡';
                                                            return '';
                                                        })()}
                                                    </div>
                                                </div>
                                                {selectedFiles.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                                        <div className="flex items-center space-x-3">
                                                            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                            </svg>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(index)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <InputError message={errors.dokumen} className="mt-2" />
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-blue-800">
                                                Informasi Penting
                                            </h3>
                                            <div className="mt-2 text-sm text-blue-700">
                                                <ul className="list-disc list-inside space-y-1">
                                                    <li>Setelah mengajukan, status akan menjadi "Pengajuan"</li>
                                                    <li>Tim kami akan meninjau dan menghubungi Anda dalam 1-2 hari kerja</li>
                                                    <li>Anda dapat mengedit permohonan selama status masih "Pengajuan"</li>
                                                    <li>Pastikan nomor telepon dan email Anda aktif untuk komunikasi</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-4">
                                    <Link
                                        href={route('layanan.index')}
                                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Batal
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Mengajukan...' : 'Ajukan Layanan'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
