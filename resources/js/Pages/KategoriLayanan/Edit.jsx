import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, kategoriLayanan }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        nama_kategori: kategoriLayanan.nama_kategori,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('kategori-layanan.update', kategoriLayanan.id_kategori));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Kategori Layanan
                    </h2>
                    <Link
                        href={route('kategori-layanan.index')}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Kembali
                    </Link>
                </div>
            }
        >
            <Head title="Edit Kategori Layanan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="nama_kategori" value="Nama Kategori" />
                                    <TextInput
                                        id="nama_kategori"
                                        name="nama_kategori"
                                        value={data.nama_kategori}
                                        className="mt-1 block w-full"
                                        autoComplete="nama_kategori"
                                        isFocused={true}
                                        onChange={(e) => setData('nama_kategori', e.target.value)}
                                        placeholder="Masukkan nama kategori layanan"
                                    />
                                    <InputError message={errors.nama_kategori} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end">
                                    <Link
                                        href={route('kategori-layanan.index')}
                                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-4"
                                    >
                                        Batal
                                    </Link>
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Update'}
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
