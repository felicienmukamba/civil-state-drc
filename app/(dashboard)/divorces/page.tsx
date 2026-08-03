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
  epoux: Citizen;
  epouse: Citizen;
  divorce: any;
}

interface Divorce {
  id: number;
  numero_acte: string;
  date_enregistrement: string;
  decision_justice_ref: string;
  motif: string;
  mariage_id: number;
  mariage: Marriage;
}

export default function DivorcesPage() {
  const [divorces, setDivorces] = useState<Divorce[]>([]);
  const [activeMarriages, setActiveMarriages] = useState<Marriage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    numero_acte: '',
    date_enregistrement: '',
    decision_justice_ref: '',
    motif: '',
    mariage_id: ''
  });

  useEffect(() => {
    fetchDivorces();
    fetchActiveMarriages();
  }, []);

  const fetchDivorces = async () => {
    try {
      const data = await apiFetch('/divorces');
      setDivorces(data);
    } catch (error: any) {
      Toast.error(error.message);
    }
  };

  const fetchActiveMarriages = async () => {
    try {
      const data = await apiFetch('/marriages');
      // Only marriages without a divorce
      setActiveMarriages(data.filter((m: Marriage) => !m.divorce));
    } catch (error: any) {
      Toast.error("Erreur lors du chargement des mariages");
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      numero_acte: '', date_enregistrement: '',
      decision_justice_ref: '', motif: '', mariage_id: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (divorce: Divorce) => {
    setEditingId(divorce.id);
    setFormData({
      numero_acte: divorce.numero_acte,
      date_enregistrement: new Date(divorce.date_enregistrement).toISOString().split('T')[0],
      decision_justice_ref: divorce.decision_justice_ref,
      motif: divorce.motif,
      mariage_id: divorce.mariage_id.toString()
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
        await apiFetch(`/divorces/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        Toast.success('Divorce mis à jour avec succès');
      } else {
        await apiFetch('/divorces', {
          method: 'POST',
          body: JSON.stringify({
            ...formData,
            mariage_id: parseInt(formData.mariage_id)
          })
        });
        Toast.success('Divorce enregistré avec succès');
      }
      setIsModalOpen(false);
      fetchDivorces();
      fetchActiveMarriages();
    } catch (error: any) {
      Toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cet acte de divorce ?')) return;
    try {
      await apiFetch(`/divorces/${id}`, { method: 'DELETE' });
      Toast.success('Divorce supprimé');
      fetchDivorces();
      fetchActiveMarriages();
    } catch (error: any) {
      Toast.error(error.message);
    }
  };

  const columns: Column<Divorce>[] = [
    { header: 'N° Acte', accessorKey: 'numero_acte' },
    { 
      header: 'Ex-Époux', 
      cell: (d) => `${d.mariage?.epoux?.nom} ${d.mariage?.epoux?.prenom}` 
    },
    { 
      header: 'Ex-Épouse', 
      cell: (d) => `${d.mariage?.epouse?.nom} ${d.mariage?.epouse?.prenom}` 
    },
    { 
      header: 'Date d\'enregistrement', 
      cell: (d) => new Date(d.date_enregistrement).toLocaleDateString() 
    },
    { header: 'Réf. Justice', accessorKey: 'decision_justice_ref' },
    {
      header: 'Actions',
      cell: (d) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => openEditModal(d)}>
            <Edit className="h-4 w-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(d.id)}>
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
          <h2 className="text-2xl font-bold tracking-tight">Gestion des Divorces</h2>
          <p className="text-gray-500">Enregistrement des dissolutions de mariage.</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" /> Déclarer un divorce
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={divorces} 
        searchKey="numero_acte" 
        searchPlaceholder="Rechercher par N° Acte..." 
      />

      <Modal 
        title={editingId ? "Modifier les informations de l'acte de divorce" : "Déclarer un divorce"} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mariage_id">Mariage concerné</Label>
            <Select value={formData.mariage_id} onValueChange={(val) => setFormData(prev => ({...prev, mariage_id: val || ''}))} disabled={!!editingId}>
              <SelectTrigger><SelectValue placeholder="Sélectionner le mariage actif" /></SelectTrigger>
              <SelectContent>
                {editingId && (
                  <SelectItem value={formData.mariage_id}>
                    Mariage (Sélectionné)
                  </SelectItem>
                )}
                {activeMarriages.map(m => (
                  <SelectItem key={m.id} value={m.id.toString()}>
                    {m.numero_acte} - {m.epoux.nom} & {m.epouse.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numero_acte">Numéro d'Acte de Divorce</Label>
            <Input id="numero_acte" value={formData.numero_acte} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_enregistrement">Date d'enregistrement</Label>
            <Input id="date_enregistrement" type="date" value={formData.date_enregistrement} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="decision_justice_ref">Référence Décision de Justice</Label>
            <Input id="decision_justice_ref" value={formData.decision_justice_ref} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="motif">Motif principal</Label>
            <Input id="motif" value={formData.motif} onChange={handleChange} />
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
