import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKey?: keyof T;
  searchPlaceholder?: string;
}

export function DataTable<T>({ data, columns, searchKey, searchPlaceholder = "Rechercher..." }: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter((item) => {
    if (!searchKey || !searchTerm) return true;
    const value = item[searchKey];
    if (typeof value === 'string') {
      return value.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {searchKey && (
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-gray-500" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}
      
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, index) => (
                <TableHead key={index}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex}>
                      {col.cell 
                        ? col.cell(row) 
                        : col.accessorKey 
                          ? String(row[col.accessorKey] || '') 
                          : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucune donnée trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
