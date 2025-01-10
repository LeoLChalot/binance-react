import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { Eye, EyeOff, Save } from 'lucide-react';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const fileInputRef = useRef();
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user.accountData.firstName || '',
        lastName: user.accountData.lastName || '',
        email: user.accountData.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        phone: user.accountData.phone || '',
        address: user.accountData.address || '',
        city: user.accountData.city || '',
        country: user.accountData.country || '',
        notifications: user.accountData.notifications || {
            email: true,
            push: true,
            transactions: true
        }
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateUser({ 
                    ...user.accountData,
                    profilePic: reader.result 
                });
                setSuccess('Photo de profil mise à jour avec succès');
                setTimeout(() => setSuccess(null), 3000);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                notifications: {
                    ...prev.notifications,
                    [name]: checked
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (formData.newPassword) {
            if (formData.newPassword !== formData.confirmPassword) {
                setError('Les mots de passe ne correspondent pas');
                return;
            }
            if (formData.newPassword.length < 6) {
                setError('Le mot de passe doit contenir au moins 6 caractères');
                return;
            }
        }

        try {
            await updateUser({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                country: formData.country,
                notifications: formData.notifications,
                ...(formData.newPassword && { password: formData.newPassword })
            });
            
            setSuccess('Profil mis à jour avec succès');
            setIsEditing(false);
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            setError('Erreur lors de la mise à jour du profil');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar navbarConnected />
            <div className="ml-20 h-screen overflow-y-auto">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">Profil</h1>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-6 py-2.5 border border-zinc-300 text-white rounded-lg hover:bg-white hover:text-black transition-colors font-medium"
                        >
                            {isEditing ? 'Annuler' : 'Modifier'}
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500 text-green-500 rounded-lg">
                            {success}
                        </div>
                    )}

                    <div className="bg-zinc-900 rounded-xl p-8 shadow-lg">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8 pb-8 border-b border-zinc-800">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-zinc-700">
                                    <img 
                                        src={user.accountData.profilePic || 
                                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.accountData.email)}`}
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button 
                                    onClick={() => fileInputRef.current.click()}
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                                >
                                    <span className="text-sm font-medium">Changer</span>
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2 text-left">
                                    {user.accountData.firstName} {user.accountData.lastName}
                                </h2>
                                <p className="text-white/70 text-left">
                                    Membre depuis le {new Date(user.accountData.createdAt).toLocaleString('fr-FR', { 
                                        year: 'numeric', 
                                        month: '2-digit', 
                                        day: '2-digit' 
                                    })}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Prénom
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Nom
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Adresse
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Ville
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Pays
                                        </label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-medium border-b border-zinc-700 pb-4">
                                        Changer le mot de passe
                                    </h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Mot de passe actuel
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="currentPassword"
                                                value={formData.currentPassword}
                                                onChange={handleInputChange}
                                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Nouveau mot de passe
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Confirmer le nouveau mot de passe
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-6">
                                <h3 className="text-xl font-medium border-b border-zinc-700 pb-4">
                                    Préférences de notification
                                </h3>
                                <div className="space-y-4">
                                    <label className="flex items-center space-x-3 p-3 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-750 transition-colors">
                                        <input
                                            type="checkbox"
                                            name="email"
                                            checked={formData.notifications.email}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-5 h-5 rounded border-zinc-700 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium">Notifications par email</span>
                                    </label>
                                    <label className="flex items-center space-x-3 p-3 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-750 transition-colors">
                                        <input
                                            type="checkbox"
                                            name="push"
                                            checked={formData.notifications.push}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-5 h-5 rounded border-zinc-700 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium">Notifications push</span>
                                    </label>
                                    <label className="flex items-center space-x-3 p-3 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-750 transition-colors">
                                        <input
                                            type="checkbox"
                                            name="transactions"
                                            checked={formData.notifications.transactions}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-5 h-5 rounded border-zinc-700 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium">Alertes de transaction</span>
                                    </label>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex justify-end pt-8">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        <Save size={20} className="mr-2" />
                                        Enregistrer les modifications
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
