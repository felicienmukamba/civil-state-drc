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
import { Plus, Printer, Edit, Trash2 } from 'lucide-react';
import { Citizen } from '../citizens/page';

interface Marriage {
  id: number;
  numero_acte: string;
  date_celebration: string;
  lieu_celebration: string;
  regime_matrimonial: string;
  epoux: Citizen;
  epouse: Citizen;
  divorce: any;
  epoux_id: number;
  epouse_id: number;
}

export default function MarriagesPage() {
  const [marriages, setMarriages] = useState<Marriage[]>([]);
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    numero_acte: '',
    date_celebration: '',
    lieu_celebration: '',
    regime_matrimonial: 'Communauté des biens',
    epoux_id: '',
    epouse_id: ''
  });

  useEffect(() => {
    fetchMarriages();
    fetchCitizens();
  }, []);

  const fetchMarriages = async () => {
    try {
      const data = await apiFetch('/marriages');
      setMarriages(data);
    } catch (error: unknown) {
      Toast.error((error instanceof Error ? error.message : String(error)));
    }
  };

  const fetchCitizens = async () => {
    try {
      const data = await apiFetch('/citizens');
      setCitizens(data);
    } catch (error: unknown) {
      Toast.error("Erreur lors du chargement des citoyens");
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      numero_acte: '', date_celebration: '', lieu_celebration: '',
      regime_matrimonial: 'Communauté des biens', epoux_id: '', epouse_id: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (marriage: Marriage) => {
    setEditingId(marriage.id);
    setFormData({
      numero_acte: marriage.numero_acte,
      date_celebration: new Date(marriage.date_celebration).toISOString().split('T')[0],
      lieu_celebration: marriage.lieu_celebration,
      regime_matrimonial: marriage.regime_matrimonial,
      epoux_id: marriage.epoux_id.toString(),
      epouse_id: marriage.epouse_id.toString()
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
        await apiFetch(`/marriages/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        Toast.success('Mariage mis à jour avec succès');
      } else {
        await apiFetch('/marriages', {
          method: 'POST',
          body: JSON.stringify({
            ...formData,
            epoux_id: parseInt(formData.epoux_id),
            epouse_id: parseInt(formData.epouse_id)
          })
        });
        Toast.success('Mariage enregistré avec succès');
      }
      setIsModalOpen(false);
      fetchMarriages();
    } catch (error: unknown) {
      Toast.error((error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cet acte de mariage ?')) return;
    try {
      await apiFetch(`/marriages/${id}`, { method: 'DELETE' });
      Toast.success('Mariage supprimé');
      fetchMarriages();
    } catch (error: unknown) {
      Toast.error((error instanceof Error ? error.message : String(error)));
    }
  };

  const columns: Column<Marriage>[] = [
    { header: 'N° Acte', accessorKey: 'numero_acte' },
    { 
      header: 'Époux', 
      cell: (m) => `${m.epoux?.nom} ${m.epoux?.prenom}` 
    },
    { 
      header: 'Épouse', 
      cell: (m) => `${m.epouse?.nom} ${m.epouse?.prenom}` 
    },
    { 
      header: 'Date Célébration', 
      cell: (m) => new Date(m.date_celebration).toLocaleDateString() 
    },
    { 
      header: 'Statut', 
      cell: (m) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${m.divorce ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {m.divorce ? 'Divorcé' : 'Actif'}
        </span>
      )
    },
    {
      header: 'Actions',
      cell: (m) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => openEditModal(m)}>
            <Edit className="h-4 w-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-1" /> Imprimer
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion des Mariages</h2>
          <p className="text-gray-500">Déclarations et suivi des actes de mariage.</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" /> Déclarer un mariage
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={marriages} 
        searchKey="numero_acte" 
        searchPlaceholder="Rechercher par N° Acte..." 
      />

      <Modal 
        title={editingId ? "Modifier les informations de l'acte de mariage" : "Déclarer un mariage"} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numero_acte">Numéro d'Acte</Label>
            <Input id="numero_acte" value={formData.numero_acte} onChange={handleChange} required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="epoux_id">Époux (Homme)</Label>
              <Select value={formData.epoux_id} onValueChange={(val) => setFormData(prev => ({...prev, epoux_id: val || ''}))} disabled={!!editingId}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {citizens.filter(c => c.sexe === 'M').map(c => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.nom} {c.prenom} ({c.numero_national})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="epouse_id">Épouse (Femme)</Label>
              <Select value={formData.epouse_id} onValueChange={(val) => setFormData(prev => ({...prev, epouse_id: val || ''}))} disabled={!!editingId}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {citizens.filter(c => c.sexe === 'F').map(c => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.nom} {c.prenom} ({c.numero_national})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_celebration">Date de célébration</Label>
            <Input id="date_celebration" type="date" value={formData.date_celebration} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lieu_celebration">Lieu de célébration</Label>
            <Input id="lieu_celebration" value={formData.lieu_celebration} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="regime_matrimonial">Régime Matrimonial</Label>
            <Select value={formData.regime_matrimonial} onValueChange={(val) => setFormData(prev => ({...prev, regime_matrimonial: val || ''}))}>
              <SelectTrigger><SelectValue placeholder="Régime" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Communauté universelle">Communauté universelle</SelectItem>
                <SelectItem value="Communauté des biens">Communauté des biens réduite aux acquêts</SelectItem>
                <SelectItem value="Séparation des biens">Séparation des biens</SelectItem>
              </SelectContent>
            </Select>
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
