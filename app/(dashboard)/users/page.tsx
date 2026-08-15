"use client";

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { DataTable, Column } from '@/components/shared/data-table';
import { Modal } from '@/components/shared/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toast } from '@/lib/utils/toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'OFFICIER';
  actif: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'OFFICIER'>('OFFICIER');
  const [actif, setActif] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await apiFetch('/users');
      setUsers(data);
    } catch (error: unknown) {
      Toast.error((error instanceof Error ? error.message : String(error)));
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setUsername('');
    setPassword('');
    setRole('OFFICIER');
    setActif(true);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingId(user.id);
    setUsername(user.username);
    setPassword('');
    setRole(user.role);
    setActif(user.actif);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await apiFetch(`/users/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify({ username, role, actif })
        });
        Toast.success('Utilisateur mis a jour avec succes');
      } else {
        await apiFetch('/users', {
          method: 'POST',
          body: JSON.stringify({ username, password, role })
        });
        Toast.success('Utilisateur cree avec succes');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error: unknown) {
      Toast.error((error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment desactiver cet utilisateur ?')) return;
    try {
      await apiFetch(`/users/${id}`, { method: 'DELETE' });
      Toast.success('Utilisateur desactive');
      fetchUsers();
    } catch (error: unknown) {
      Toast.error((error instanceof Error ? error.message : String(error)));
    }
  };

  const columns: Column<User>[] = [
    { header: 'ID', accessorKey: 'id' },
    { header: "Nom d'utilisateur", accessorKey: 'username' },
    { 
      header: 'Role', 
      cell: (user) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
          {user.role}
        </span>
      )
    },
    { 
      header: 'Statut', 
      cell: (user) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {user.actif ? 'Actif' : 'Inactif'}
        </span>
      )
    },
    { 
      header: 'Actions', 
      cell: (user) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => openEditModal(user)}><Edit className="h-4 w-4 text-blue-500" /></Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion des Utilisateurs</h2>
          <p className="text-gray-500">Gerez les acces au systeme (Admins et Officiers).</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" /> Nouvel Utilisateur
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={users} 
        searchKey="username" 
        searchPlaceholder="Rechercher un utilisateur..." 
      />

      <Modal 
        title={editingId ? "Modifier l'utilisateur" : "Creer un utilisateur"} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input 
              id="username" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>
          {!editingId && (
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required={!editingId} 
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(val: any) => setRole(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Selectionner un role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OFFICIER">Officier de l'Etat Civil</SelectItem>
                <SelectItem value="ADMIN">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {editingId && (
            <div className="space-y-2 flex items-center space-x-2 mt-4">
               <input type="checkbox" id="actif" checked={actif} onChange={e => setActif(e.target.checked)} className="rounded" />
               <Label htmlFor="actif">Compte actif</Label>
            </div>
          )}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
