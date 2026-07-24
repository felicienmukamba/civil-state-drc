"use client";

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, Database, FileText, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReportsPage() {
  const [stats, setStats] = useState({
    citizens: 0,
    marriages: 0,
    divorces: 0,
    users: 0
  });

  useEffect(() => {
    // Ideally, a specific /api/reports endpoint would aggregate this
    // For now, we'll fetch everything to count it (or we could rely on the backend for counts)
    const fetchStats = async () => {
      try {
        const [citizens, marriages, divorces, users] = await Promise.all([
          apiFetch('/citizens').catch(() => []),
          apiFetch('/marriages').catch(() => []),
          apiFetch('/divorces').catch(() => []),
          apiFetch('/users').catch(() => [])
        ]);

        setStats({
          citizens: citizens.length,
          marriages: marriages.length,
          divorces: divorces.length,
          users: users.length
        });
      } catch (error) {
        console.error("Erreur de chargement des statistiques", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rapports & Statistiques</h2>
          <p className="text-gray-500">Vue d'ensemble de l'état civil de la commune.</p>
        </div>
        <Button onClick={() => window.print()} variant="outline">
          <Printer className="mr-2 h-4 w-4" /> Imprimer le rapport global
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Citoyens</CardTitle>
            <Database className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.citizens}</div>
            <p className="text-xs text-gray-500">Citoyens recensés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mariages</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.marriages}</div>
            <p className="text-xs text-gray-500">Actes enregistrés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Divorces</CardTitle>
            <FileText className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.divorces}</div>
            <p className="text-xs text-gray-500">Actes enregistrés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Système</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-gray-500">Admins & Officiers</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 border-t pt-8">
        <h3 className="text-lg font-semibold mb-4">Taux de séparation</h3>
        <p className="text-gray-600">
          Actuellement, il y a {stats.divorces} divorces pour {stats.marriages} mariages enregistrés.
          {stats.marriages > 0 && (
            <span className="block mt-2 font-medium text-gray-800">
              Ratio : {((stats.divorces / stats.marriages) * 100).toFixed(1)} %
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
