import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, adminUser, roles }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: adminUser.name || '',
        nik: adminUser.nik || '',
        email: adminUser.email || '',
        password: '',
        password_confirmation: '',
        role: adminUser.roles[0]?.name || 'admin',
    });

    const handleNikChange = (e) => {
        const value = e.target.value;
        // Hanya izinkan angka dan maksimal 16 digit
        const filteredValue = value.replace(/[^0-9]/g, '').slice(0, 16);
        setData('nik', filteredValue);
    };

    const submit = (e) => {
        e.preventDefault();
        patch(route('admin-users.update', adminUser.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Admin: {adminUser.name}
                    </h2>
                    <Link
                        href={route('admin-users.index')}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Kembali
                    </Link>
                </div>
            }
        >
            <Head title={`Edit Admin: ${adminUser.name}`} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Edit Informasi Admin
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Perbarui informasi admin. Kosongkan password jika tidak ingin mengubahnya.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Nama Lengkap" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="nik" value="NIK (Nomor Induk Kependudukan)" />
                                    <TextInput
                                        id="nik"
                                        name="nik"
                                        value={data.nik}
                                        className="mt-1 block w-full"
                                        autoComplete="off"
                                        onChange={handleNikChange}
                                        maxLength="16"
                                        placeholder="Masukkan 16 digit NIK"
                                        required
                                    />
                                    <InputError message={errors.nik} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="role" value="Role" />
                                    <select
                                        id="role"
                                        name="role"
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        required
                                    >
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.name}>
                                                {role.name === 'superadmin' ? 'Super Admin' : 'Admin'}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.role} className="mt-2" />
                                    {data.role === 'superadmin' && (
                                        <p className="mt-2 text-sm text-yellow-600">
                                            ⚠️ Super Admin memiliki akses penuh ke sistem, termasuk mengelola admin lain.
                                        </p>
                                    )}
                                </div>

                                <div className="border-t pt-6">
                                    <h4 className="text-md font-medium text-gray-900 mb-4">
                                        Ubah Password (Opsional)
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Kosongkan field password jika tidak ingin mengubah password.
                                    </p>

                                    <div className="space-y-4">
                                        <div>
                                            <InputLabel htmlFor="password" value="Password Baru" />
                                            <TextInput
                                                id="password"
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                className="mt-1 block w-full"
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password', e.target.value)}
                                            />
                                            <InputError message={errors.password} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password Baru" />
                                            <TextInput
                                                id="password_confirmation"
                                                type="password"
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                className="mt-1 block w-full"
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                            />
                                            <InputError message={errors.password_confirmation} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end pt-6">
                                    <Link
                                        href={route('admin-users.index')}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-3"
                                    >
                                        Batal
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
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
