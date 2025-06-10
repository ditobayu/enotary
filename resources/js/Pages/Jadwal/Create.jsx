import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ auth, layanan }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        id_layanan: layanan.id_layanan,
        tanggal_janji: '',
        jam_janji: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('jadwal.store'));
    };

    // Get minimum date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Buat Janji Temu - Layanan #{layanan.id_layanan}
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
            <Head title={`Buat Janji Temu - Layanan #${layanan.id_layanan}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Informasi Layanan */}
                            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h3 className="text-lg font-medium text-blue-900 mb-2">
                                    Informasi Layanan
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-blue-800">ID Layanan:</span>
                                        <span className="ml-2 text-blue-900">#{layanan.id_layanan}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-blue-800">Kategori:</span>
                                        <span className="ml-2 text-blue-900">{layanan.kategori?.nama_kategori}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-blue-800">Status:</span>
                                        <span className="ml-2 text-blue-900">{layanan.status?.nama_status}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-blue-800">Tanggal Pengajuan:</span>
                                        <span className="ml-2 text-blue-900">
                                            {new Date(layanan.tanggal_pengajuan).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Ajukan Jadwal Janji Temu
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Silakan pilih tanggal dan waktu yang Anda inginkan untuk janji temu. 
                                    Admin akan meninjau dan memberikan konfirmasi.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="tanggal_janji" value="Tanggal Janji Temu" />
                                    <input
                                        id="tanggal_janji"
                                        name="tanggal_janji"
                                        type="date"
                                        value={data.tanggal_janji}
                                        min={minDate}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('tanggal_janji', e.target.value)}
                                        required
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Pilih tanggal minimal H+1 dari hari ini
                                    </p>
                                    <InputError message={errors.tanggal_janji} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="jam_janji" value="Waktu Janji Temu" />
                                    <input
                                        id="jam_janji"
                                        name="jam_janji"
                                        type="time"
                                        value={data.jam_janji}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('jam_janji', e.target.value)}
                                        required
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Pilih waktu yang sesuai dengan jam operasional kantor
                                    </p>
                                    <InputError message={errors.jam_janji} className="mt-2" />
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-yellow-800">
                                                Penting untuk diketahui:
                                            </h3>
                                            <div className="mt-2 text-sm text-yellow-700">
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Jadwal yang diajukan akan direview oleh admin</li>
                                                    <li>Anda akan menerima notifikasi konfirmasi</li>
                                                    <li>Jika ditolak, Anda dapat mengajukan jadwal baru</li>
                                                    <li>Pastikan Anda dapat hadir sesuai waktu yang dipilih</li>
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
                                        {processing ? 'Mengajukan...' : 'Ajukan Janji Temu'}
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
