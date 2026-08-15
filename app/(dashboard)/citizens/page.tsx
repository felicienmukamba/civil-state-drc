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

export interface Citizen {
  id: number;
  numero_national: string;
  nom: string;
  postnom: string;
  prenom: string;
  date_naissance: string;
  lieu_naissance: string;
  sexe: string;
  profession: string;
  adresse_actuelle: string;
}

export default function CitizensPage() {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    numero_national: '',
    nom: '',
    postnom: '',
    prenom: '',
    date_naissance: '',
    lieu_naissance: '',
    sexe: 'M',
    profession: '',
    adresse_actuelle: ''
  });

  useEffect(() => {
    fetchCitizens();
  }, []);

  const fetchCitizens = async () => {
    try {
      const data = await apiFetch('/citizens');
      setCitizens(data);
    } catch (error: unknown) {
      Toast.error((error instanceof Error ? error.message : String(error)));
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      numero_national: '', nom: '', postnom: '', prenom: '',
      date_naissance: '', lieu_naissance: '', sexe: 'M',
      profession: '', adresse_actuelle: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (citizen: Citizen) => {
    setEditingId(citizen.id);
    setFormData({
      numero_national: citizen.numero_national,
      nom: citizen.nom,
      postnom: citizen.postnom,
      prenom: citizen.prenom,
      // Format date for input type="date"
      date_naissance: new Date(citizen.date_naissance).toISOString().split('T')[0],
      lieu_naissance: citizen.lieu_naissance,
      sexe: citizen.sexe,
      profession: citizen.profession,
      adresse_actuelle: citizen.adresse_actuelle
    });
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await apiFetch(`/citizens/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        Toast.success('Citoyen mis à jour avec succès');
      } else {
        await apiFetch('/citizens', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        Toast.success('Citoyen enregistré avec succès');
      }
      setIsModalOpen(false);
      fetchCitizens();
    } catch (error: unknown) {
      Toast.error((error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer ce citoyen ?')) return;
    try {
      await apiFetch(`/citizens/${id}`, { method: 'DELETE' });
      Toast.success('Citoyen supprimé');
      fetchCitizens();
    } catch (error: unknown) {
      Toast.error((error instanceof Error ? error.message : String(error)));
    }
  };

  const columns: Column<Citizen>[] = [
    { header: 'N° National', accessorKey: 'numero_national' },
    { header: 'Nom', accessorKey: 'nom' },
    { header: 'Postnom', accessorKey: 'postnom' },
    { header: 'Prénom', accessorKey: 'prenom' },
    { header: 'Sexe', accessorKey: 'sexe' },
    { 
      header: 'Date Naissance', 
      cell: (citizen) => new Date(citizen.date_naissance).toLocaleDateString() 
    },
    { 
      header: 'Actions', 
      cell: (citizen) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => openEditModal(citizen)}>
            <Edit className="h-4 w-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(citizen.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Registre des Citoyens</h2>
          <p className="text-gray-500">Recensement de la population pour l'Etat Civil.</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" /> Enregistrer un citoyen
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={citizens} 
        searchKey="numero_national" 
        searchPlaceholder="Rechercher par N° National..." 
      />

      <Modal 
        title={editingId ? "Modifier les informations du citoyen" : "Enregistrer un citoyen"} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero_national">Numéro National</Label>
              <Input id="numero_national" value={formData.numero_national} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" value={formData.nom} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postnom">Postnom</Label>
              <Input id="postnom" value={formData.postnom} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" value={formData.prenom} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sexe">Sexe</Label>
              <Select value={formData.sexe} onValueChange={(val) => setFormData(prev => ({...prev, sexe: val as string}))}>
                <SelectTrigger><SelectValue placeholder="Sexe" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculin</SelectItem>
                  <SelectItem value="F">Féminin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_naissance">Date de naissance</Label>
              <Input id="date_naissance" type="date" value={formData.date_naissance} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lieu_naissance">Lieu de naissance</Label>
              <Input id="lieu_naissance" value={formData.lieu_naissance} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <Input id="profession" value={formData.profession} onChange={handleChange} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="adresse_actuelle">Adresse Actuelle</Label>
            <Input id="adresse_actuelle" value={formData.adresse_actuelle} onChange={handleChange} required />
          </div>
          
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
