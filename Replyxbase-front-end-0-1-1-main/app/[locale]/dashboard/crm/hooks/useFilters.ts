import { useState } from 'react';
import { SortField, SortDirection } from '../types';

export interface DynamicFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt';
  value: string;
}

interface FilterState {
  search?: string;
  status?: string;
  service?: string;
  dateRange?: { start: Date | null; end: Date | null };
  sortField?: SortField;
  sortDirection?: SortDirection;
}

export const useFilters = (initialState?: FilterState) => {
  const [searchTerm, setSearchTerm] = useState(initialState?.search || '');
  const [statusFilter, setStatusFilter] = useState(initialState?.status || 'all');
  const [serviceFilter, setServiceFilter] = useState(initialState?.service || 'all');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>(initialState?.dateRange || {
    start: new Date(),
    end: new Date()
  });
  const [sortField, setSortField] = useState<SortField>(initialState?.sortField || 'date');
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialState?.sortDirection || 'asc');
  const [currentPage, setCurrentPage] = useState(1);

  const [dynamicFilters, setDynamicFilters] = useState<DynamicFilter[]>([]);

  const addDynamicFilter = () => {
    setDynamicFilters([
      ...dynamicFilters,
      { id: Date.now().toString(), field: 'price', operator: 'gt', value: '' }
    ]);
  };

  const removeDynamicFilter = (id: string) => {
    setDynamicFilters(dynamicFilters.filter(f => f.id !== id));
  };

  const updateDynamicFilter = (id: string, updates: Partial<DynamicFilter>) => {
    setDynamicFilters(dynamicFilters.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    serviceFilter,
    setServiceFilter,
    dateRange,
    setDateRange,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    currentPage,
    setCurrentPage,
    dynamicFilters,
    addDynamicFilter,
    removeDynamicFilter,
    updateDynamicFilter
  };
};
