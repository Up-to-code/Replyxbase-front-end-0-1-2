import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, Trash2, Calendar, User, Clock, ArrowUpDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SortField, SortDirection } from '../../types';
import { serviceTypes } from '../../constants';
import { DynamicFilter } from '../../hooks/useFilters';
import { Select } from '../../components/ui/Select';

/**
 * Props for the Filters component.
 */
interface FiltersProps {
  /** Current search term */
  searchTerm: string;
  /** Callback to update search term */
  setSearchTerm: (term: string) => void;
  /** Current status filter */
  statusFilter: string;
  /** Callback to update status filter */
  setStatusFilter: (filter: string) => void;
  /** Current service type filter */
  serviceFilter: string;
  /** Callback to update service type filter */
  setServiceFilter: (filter: string) => void;
  /** Current sort field */
  sortField: SortField;
  /** Current sort direction */
  sortDirection: SortDirection;
  /** Callback to update sort */
  onSortChange: (field: SortField, direction: SortDirection) => void;
  /** Date range filter */
  dateRange?: { start: Date | null; end: Date | null };
  /** Callback to update date range */
  setDateRange?: (range: { start: Date | null; end: Date | null }) => void;
  /** List of active dynamic filters */
  dynamicFilters?: DynamicFilter[];
  /** Callback to add a dynamic filter */
  addDynamicFilter?: () => void;
  /** Callback to remove a dynamic filter */
  removeDynamicFilter?: (id: string) => void;
  /** Callback to update a dynamic filter */
  updateDynamicFilter?: (id: string, updates: Partial<DynamicFilter>) => void;
  /** Whether search is loading */
  isLoading?: boolean;
}

/**
 * Component for filtering, searching, and sorting bookings.
 */
export const Filters: React.FC<FiltersProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  serviceFilter, 
  setServiceFilter,
  sortField,
  sortDirection,
  onSortChange,
  dateRange = { start: null, end: null },
  setDateRange,
  dynamicFilters = [],
  addDynamicFilter,
  removeDynamicFilter,
  updateDynamicFilter,
  isLoading
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const t = useTranslations("Dashboard.CRM.Filters");
  const tStatus = useTranslations("Dashboard.CRM.Status");

  const sortOptions = [
    { value: 'date-desc', label: t("newestFirst"), icon: Calendar },
    { value: 'date-asc', label: t("oldestFirst"), icon: Calendar },
    { value: 'customer-asc', label: t("customerAZ"), icon: User },
    { value: 'customer-desc', label: t("customerZA"), icon: User },
    { value: 'priority-asc', label: t("priority"), icon: ArrowUpDown },
  ];

  const serviceOptions = [
    { value: 'all', label: t("allServices") },
    ...serviceTypes.map(s => ({ value: s, label: s }))
  ];

  return (
    <div className="mb-6">
      {/* Main Filter Row */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 rtl:left-auto rtl:right-3 group-focus-within:text-[#005bbc] transition-colors" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white border-2 border-slate-200 rounded-xl focus:border-[#005bbc] focus:ring-0 transition-all duration-200 rtl:pl-10 rtl:pr-10"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 rtl:right-auto rtl:left-3">
                <div className="w-4 h-4 border-2 border-[#005bbc]/30 border-t-[#005bbc] rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 border-2 ${
              showFilters 
                ? 'bg-[#005bbc]/10 text-[#005bbc] border-[#005bbc]/20' 
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            {t("filters")}
            {dynamicFilters.length > 0 && (
              <span className="bg-[#005bbc] text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-5 text-center">
                {dynamicFilters.length}
              </span>
            )}
          </button>
          
          <div className="w-48">
            <Select
              value={`${sortField}-${sortDirection}`}
              onChange={(val) => {
                const [field, direction] = val.split('-') as [SortField, SortDirection];
                onSortChange(field, direction);
              }}
              options={sortOptions}
            />
          </div>
        </div>
      </div>

      {/* Expandable Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                
                {/* Status Filter */}
                <div className="lg:col-span-5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    {t("statusFilter")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'no-show'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                          statusFilter === status
                            ? 'bg-[#005bbc] text-white border-[#005bbc]'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {status === 'all' ? t("allStatuses") : tStatus(status as any)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Service Type */}
                <div className="lg:col-span-3">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    {t("serviceType")}
                  </label>
                  <Select
                    value={serviceFilter}
                    onChange={setServiceFilter}
                    options={serviceOptions}
                  />
                </div>

                {/* Date Range */}
                <div className="lg:col-span-4">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    {t("dateRange")}
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="date"
                        value={dateRange.start ? dateRange.start.toISOString().split('T')[0] : ''}
                        onChange={(e) => setDateRange && setDateRange({ ...dateRange, start: e.target.value ? new Date(e.target.value) : null })}
                        className="w-full px-3 py-2.5 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#005bbc] focus:outline-none focus:ring-0 text-sm transition-all"
                      />
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="date"
                        value={dateRange.end ? dateRange.end.toISOString().split('T')[0] : ''}
                        onChange={(e) => setDateRange && setDateRange({ ...dateRange, end: e.target.value ? new Date(e.target.value) : null })}
                        className="w-full px-3 py-2.5 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#005bbc] focus:outline-none focus:ring-0 text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {addDynamicFilter && (
                <div className="border-t-2 border-slate-200 mt-5 pt-5">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium text-slate-900">{t("advancedFilters")}</h4>
                    <button
                      onClick={addDynamicFilter}
                      className="text-xs font-medium text-[#005bbc] hover:text-[#004a9f] flex items-center gap-1 bg-[#005bbc]/10 px-2 py-1 rounded-lg border-2 border-transparent hover:border-[#005bbc]/20 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      {t("addFilterRule")}
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {dynamicFilters.map((filter) => (
                      <motion.div
                        key={filter.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex flex-wrap gap-3 items-center bg-slate-50/50 p-3 rounded-xl border-2 border-slate-200"
                      >
                        <div className="w-32">
                          <Select
                            value={filter.field}
                            onChange={(val) => updateDynamicFilter?.(filter.id, { field: val })}
                            options={[
                              { value: 'price', label: t("Dynamic.price") },
                              { value: 'people', label: t("Dynamic.people") },
                              { value: 'duration', label: t("Dynamic.duration") }
                            ]}
                            className="text-sm"
                          />
                        </div>
                        
                        <div className="w-32">
                          <Select
                            value={filter.operator}
                            onChange={(val) => updateDynamicFilter?.(filter.id, { operator: val as any })}
                            options={[
                              { value: 'equals', label: t("Dynamic.equals") },
                              { value: 'gt', label: t("Dynamic.gt") },
                              { value: 'lt', label: t("Dynamic.lt") }
                            ]}
                            className="text-sm"
                          />
                        </div>
                        
                        <input
                          type="text"
                          value={filter.value}
                          onChange={(e) => updateDynamicFilter?.(filter.id, { value: e.target.value })}
                          placeholder={t("Dynamic.valuePlaceholder")}
                          className="flex-1 min-w-[150px] px-3 py-2.5 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-0 focus:border-[#005bbc] text-sm transition-all"
                        />
                        
                        <button
                          onClick={() => removeDynamicFilter?.(filter.id)}
                          className="p-2 text-slate-400 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors border-2 border-transparent hover:border-[#EF4444]/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                    {dynamicFilters.length === 0 && (
                      <p className="text-sm text-slate-400 italic">{t("noAdvancedFilters")}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};