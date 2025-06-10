import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, layanan, kategoriLayanan }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        id_kategori: layanan.kategori?.id_kategori || '',
        keterangan: layanan.keterangan || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('layanan.update', layanan.id_layanan));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Layanan #{layanan.id_layanan}
                    </h2>
                    <Link
                        href={route('layanan.show', layanan.id_layanan)}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Kembali
                    </Link>
                </div>
            }
        >
            <Head title={`Edit Layanan #${layanan.id_layanan}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Edit Permohonan Layanan
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Anda dapat mengedit permohonan layanan selama status masih "Pengajuan".
                                </p>
                                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-yellow-800">
                                                Status saat ini: <strong>{layanan.status?.nama_status}</strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>
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

                                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-blue-800">
                                                Catatan Penting
                                            </h3>
                                            <div className="mt-2 text-sm text-blue-700">
                                                <ul className="list-disc list-inside space-y-1">
                                                    <li>Perubahan akan disimpan dan menggantikan data sebelumnya</li>
                                                    <li>Status akan tetap "Pengajuan" setelah diedit</li>
                                                    <li>Tim akan meninjau ulang permohonan yang telah diedit</li>
                                                    <li>Pastikan semua informasi sudah benar sebelum menyimpan</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-4">
                                    <Link
                                        href={route('layanan.show', layanan.id_layanan)}
                                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Batal
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Update Layanan'}
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
