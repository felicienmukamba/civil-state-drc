"use client";

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { DataTable, Column } from '@/components/shared/data-table';
import { toast } from 'sonner';

interface AuditLog {
  id: number;
  action: string;
  entity: string;
  summary: string;
  actor: string;
  createdAt: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await apiFetch('/audit?limit=200');
      setLogs(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const columns: Column<AuditLog>[] = [
    { 
      header: 'Date et Heure', 
      cell: (log) => new Date(log.createdAt).toLocaleString('fr-FR')
    },
    { header: 'Action', accessorKey: 'action' },
    { header: 'Entité', accessorKey: 'entity' },
    { header: 'Résumé', accessorKey: 'summary' },
    { header: 'Acteur', accessorKey: 'actor' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Journal d'Audit</h2>
          <p className="text-gray-500">Historique complet des opérations effectuées sur le système.</p>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={logs} 
        searchKey="summary" 
        searchPlaceholder="Rechercher dans le résumé..." 
      />
    </div>
  );
}
