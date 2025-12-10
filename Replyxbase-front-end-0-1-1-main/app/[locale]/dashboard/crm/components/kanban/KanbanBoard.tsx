import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Check, X, Plus, User, Tag, MoreHorizontal, Calendar, Eye, Trash2, Search, RotateCcw } from 'lucide-react';
import { useTranslations, useFormatter } from 'next-intl';
import { Booking } from '../../types';
import { PriorityBadge } from '../ui/Badges';
import { useKanbanBoard } from '../../hooks/useKanbanBoard';
import { DeleteColumnModal } from './DeleteColumnModal';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import { getStringColor } from '../../utils';

/**
 * Props for the KanbanBoard component.
 */
interface KanbanBoardProps {
  /** List of bookings to display */
  bookings: Booking[];
  /** Callback when a booking is viewed */
  onView: (booking: Booking) => void;
  /** Callback when a booking status changes */
  onStatusChange?: (bookingId: string, newStatus: Booking['status']) => void;
  /** Callback when a booking is updated */
  onUpdateBooking?: (booking: Booking) => Promise<void>;
  /** Callback to reorder bookings */
  onReorder?: (items: { id: string; position: number; status: string }[]) => Promise<void>;
  /** Callback to update CRM settings */
  onUpdateSettings?: (settings: any) => Promise<void>;
  /** Callback to bulk update status on rename */
  onBulkStatusChange?: (oldStatus: string, newStatus: string) => Promise<void>;
  /** Search term */
  searchTerm?: string;
  /** Callback for search change */
  onSearchChange?: (term: string) => void;
  // activeTab and onTabChange removed as per request
  
  /** Callback to add a new booking */
  onAddBooking?: () => void;
  /** Initial settings for columns */
  initialSettings?: any;
  /** Whether data is loading */
  isLoading?: boolean;
}

/**
 * Displays bookings in a Kanban board format with drag-and-drop support.
 */
export const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  bookings, 
  onView, 
  onStatusChange, 
  onUpdateBooking, 
  onReorder,
  onUpdateSettings,
  onBulkStatusChange,
  initialSettings,
  isLoading,
  searchTerm = "",
  onSearchChange,
  onAddBooking
}) => {
  const t = useTranslations("Dashboard.CRM.Kanban");
  const tStatus = useTranslations("Dashboard.CRM.Status");
  const format = useFormatter();
  
  const {
      columns,
      draggedBookingId,
      dragOverBookingId,
      addColumn,
      deleteColumn,
      renameColumn,
      handleDragStart,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      getBookingsByStatus,
      resetColumns,
      handleColumnDragStart,
      handleColumnDrop,
      draggedColumnId
  } = useKanbanBoard({
      initialBookings: bookings,
      initialSettings,
      onReorder,
      onUpdateSettings,
      onStatusChange,
      onBulkStatusChange
  });

  // Column Renaming State (UI only)
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [tempColumnTitle, setTempColumnTitle] = useState('');

  // Card Editing State
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ fullName: string }>({ fullName: '' });

  // Delete Column Modal State
  const [columnToDelete, setColumnToDelete] = useState<{ id: string; title: string } | null>(null);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  // -- Handlers --
  const handleAddColumnClick = async () => {
      const newId = await addColumn();
      setEditingColumnId(newId);
      setTempColumnTitle('New Column'); // Hook sets it too, but we want it in local state for input
  };

  const saveColumnTitle = async () => {
    if (editingColumnId && tempColumnTitle.trim()) {
      await renameColumn(editingColumnId, tempColumnTitle);
    }
    setEditingColumnId(null);
  };

  // Card Editing Handlers
  const startEditingCard = (booking: Booking) => {
    setEditingBookingId(booking.id);
    setEditForm({
      fullName: booking.customer.fullName
    });
  };

  const saveCardEdit = async (booking: Booking) => {
    if (onUpdateBooking) {
      await onUpdateBooking({
        ...booking,
        customer: {
          ...booking.customer,
          fullName: editForm.fullName
        }
      });
    }
    setEditingBookingId(null);
  };

  // Memoize booking distribution
  const distributedColumns = React.useMemo(() => {
      return columns.map((column) => {
          const statusKey = column.id.startsWith('custom-') ? column.title : column.id;
          const columnBookings = getBookingsByStatus(statusKey);
          return { column, bookings: columnBookings };
      });
  }, [columns, getBookingsByStatus]);

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 px-4 min-h-[600px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="min-w-[300px] bg-slate-50 rounded-lg p-4 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-32 bg-white rounded-lg"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (

    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Top Header with Title, Search, and Actions */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    placeholder={t('search')}
                    className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005bbc]/20 focus:border-[#005bbc] w-64"
                />
            </div>
            
            <button 
                onClick={() => setShowResetConfirmation(true)}
                className="text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors border border-slate-200 flex items-center gap-2"
                title={t('resetColumns')}
            >
                <RotateCcw className="w-4 h-4" />
            </button>
            
            <button 
                onClick={handleAddColumnClick}
                className="text-sm font-medium text-slate-600 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors border border-slate-200 flex items-center gap-2"
                title={t('addStage')}
            >
                <Plus className="w-4 h-4" />
                <span>{t('addStage')}</span>
            </button>

            {onAddBooking && (
                <button 
                    onClick={onAddBooking}
                    className="text-sm font-medium text-white bg-[#005bbc] hover:bg-[#004a9f] px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>{t('newBooking')}</span>
                </button>
            )}
        </div>
      </div>
      
      {/* Scrollable Canvas */}
      <div className="flex gap-4 overflow-x-auto p-6 h-full bg-slate-50/30 custom-scrollbar">
        {distributedColumns.map(({ column, bookings: columnBookings }) => {
            return (
          <div
            key={column.id}
            className={`min-w-[320px] max-w-[320px] flex flex-col rounded-xl bg-slate-50/50 border border-slate-200 h-full transition-colors duration-200 ${
               dragOverBookingId && columnBookings.some(b => b.id === dragOverBookingId) ? 'border-[#005bbc]/30 bg-blue-50/10' : ''
            } ${draggedColumnId === column.id ? 'opacity-50 border-dashed border-slate-400' : ''}`}
            onDragOver={(e) => {
                 handleDragOver(e);
            }}
            onDragLeave={(e) => {
                handleDragLeave();
            }}
            onDrop={(e) => {
                // Check if it's a column drop
                if (e.dataTransfer.types.includes('columnid')) { // Browsers lowercase custom types sometimes? Safe to rely on effect/state?
                     // Actually, just try both. Or use state `draggedColumnId`
                     if (draggedColumnId) {
                         handleColumnDrop(e, column.id);
                         return;
                     }
                }
                // Otherwise booking drop
                handleDrop(e, column.id, columnBookings);
            }}
          >
            {/* Column Header */}
            <div 
                className={`p-4 border-b border-slate-100/50 sticky top-0 z-10 bg-slate-50/50 rounded-t-xl group/header ${!editingColumnId ? 'cursor-grab active:cursor-grabbing hover:bg-slate-100/50' : ''}`}
                draggable={!editingColumnId}
                onDragStart={(e) => handleColumnDragStart(e, column.id)}
            >
              <div className="flex items-center justify-between">
                {editingColumnId === column.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      value={tempColumnTitle}
                      onChange={(e) => setTempColumnTitle(e.target.value)}
                      className="flex-1 text-sm bg-white border border-[#005bbc] rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#005bbc]/10"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveColumnTitle();
                        if (e.key === 'Escape') setEditingColumnId(null);
                      }}
                    />
                    <button onClick={saveColumnTitle} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div 
                    className="flex-1 font-semibold text-slate-700 flex items-center gap-2 cursor-pointer hover:text-[#005bbc] transition-colors"
                    onDoubleClick={() => {
                        setEditingColumnId(column.id);
                        setTempColumnTitle(column.title);
                    }}
                  >
                    <span>{column.title}</span>
                    <span className="text-xs font-medium text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100">
                      {columnBookings.length}
                    </span>
                    <button 
                        onClick={() => setColumnToDelete({ id: column.id, title: column.title })}
                        className="opacity-0 group-hover/header:opacity-100 p-1 text-slate-400 hover:text-rose-500 ml-auto transition-all"
                        title="Delete Column"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
              {columnBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  // layoutId={booking.id} // Removed for performance (lag reduction)
                  draggable={!editingBookingId}
                  onDragStart={(e) => handleDragStart(e as any, booking.id)}
                  className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all duration-200 group ${
                    draggedBookingId === booking.id ? 'opacity-50 scale-95 shadow-none' : 'hover:shadow-md hover:border-slate-300'
                  } ${dragOverBookingId === booking.id ? 'border-t-4 border-t-[#005bbc] mt-2' : ''} ${!editingBookingId ? 'cursor-grab active:cursor-grabbing' : ''}`}
                  whileHover={!editingBookingId ? { y: -2 } : {}}
                  onDragOver={(e) => {
                      if (draggedBookingId !== booking.id) {
                          handleDragOver(e as any, booking.id);
                          e.stopPropagation();
                      }
                  }}
                >
                  {editingBookingId === booking.id ? (
                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          value={editForm.fullName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                          className="w-full text-sm font-semibold bg-slate-50 border border-transparent focus:bg-white focus:border-[#005bbc] rounded-lg px-2 py-1.5 focus:outline-none transition-all"
                          autoFocus
                          placeholder={t('customerName')}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                         <button
                           onClick={() => setEditingBookingId(null)}
                           className="px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded"
                         >
                           {t('cancel')}
                         </button>
                         <button
                           onClick={() => saveCardEdit(booking)}
                           className="px-2 py-1 text-xs font-medium text-white bg-[#005bbc] hover:bg-[#004a9f] rounded"
                         >
                           {t('save')}
                         </button>
                      </div>
                    </div>
                  ) : (
                    <div onDoubleClick={() => startEditingCard(booking)} className="relative h-full flex flex-col">
                      {/* Top Row: Service Tag & Priority */}
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${(() => {
                            const c = getStringColor(booking.serviceType || 'General');
                            return `${c.bg} ${c.text}`;
                        })()}`}>
                            {booking.serviceType}
                        </span>
                        <div className="flex gap-1">
                            {booking.priority !== 'normal' && <PriorityBadge priority={booking.priority} />}
                        </div>
                      </div>

                      {/* Main Info */}
                      <div className="mb-3 cursor-pointer" onClick={() => onView(booking)}>
                        <h4 className="font-bold text-slate-900 text-sm mb-0.5 group-hover:text-[#005bbc] transition-colors">
                            {booking.customer.fullName}
                        </h4>
                        <p className="text-xs text-slate-500 truncate">
                            {booking.customer.company || `#${booking.id.slice(-6)}`}
                        </p>
                      </div>

                      {/* Meta: Date & Location */}
                      <div className="flex flex-col gap-1.5 mb-3">
                         <div className={`flex items-center gap-2 text-xs font-medium ${
                           new Date(booking.date) < new Date() && booking.status === 'pending' 
                             ? 'text-rose-600' 
                             : 'text-slate-500'
                         }`}>
                           <Calendar className="w-3.5 h-3.5 opacity-70" />
                           <span>
                             {format.dateTime(new Date(booking.date), { weekday: 'short', month: 'short', day: 'numeric' })}
                           </span>
                           <span className="text-slate-300 mx-1">•</span>
                           <span>{booking.startTime}</span>
                         </div>
                         {booking.location && (
                           <div className="flex items-center gap-2 text-xs text-slate-400">
                             <MapPin className="w-3.5 h-3.5 opacity-70" />
                             <span className="truncate max-w-[180px]">{booking.location}</span>
                           </div>
                         )}
                      </div>

                      {/* Footer: Avatar & Actions */}
                      <div className="pt-3 border-t border-slate-50 flex justify-between items-center mt-auto">
                          <div className="flex items-center gap-2">
                              {booking.staffAssigned ? (
                                  <div className="flex items-center gap-1.5 bg-slate-50/50 pr-2 rounded-full border border-slate-100">
                                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[9px] font-bold text-[#005bbc] border border-blue-100">
                                          {booking.staffAssigned.substring(0,2).toUpperCase()}
                                      </div>
                                      <span className="text-[10px] font-medium text-slate-500 truncate max-w-[60px]">
                                          {booking.staffAssigned}
                                      </span>
                                  </div>
                              ) : (
                                  <div className="text-[10px] text-slate-300 italic px-1">{t('unassigned')}</div>
                              )}
                          </div>

                          {/* Hover Action */}
                          <button 
                             onClick={(e) => { e.stopPropagation(); onView(booking); }}
                             className="p-1.5 text-slate-300 hover:text-[#005bbc] hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                             title={t("viewDetails")}
                          >
                             <Eye className="w-3.5 h-3.5" />
                          </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              
              {columnBookings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-300 text-sm border-2 border-dashed border-slate-100 rounded-xl">
                  <div className="p-2 bg-slate-50 rounded-full mb-2">
                      <Clock className="w-4 h-4 opacity-50" />
                  </div>
                  <span>{t('empty')}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
      </div>

      <DeleteColumnModal 
          isOpen={!!columnToDelete}
          onClose={() => setColumnToDelete(null)}
          onConfirm={async () => {
              if (columnToDelete) {
                  await deleteColumn(columnToDelete.id);
                  setColumnToDelete(null);
              }
          }}
          columnTitle={columnToDelete?.title || ''}
      />

      <ConfirmationModal
        isOpen={showResetConfirmation}
        onClose={() => setShowResetConfirmation(false)}
        onConfirm={resetColumns}
        title={t('resetConfirmTitle')}
        description={t('resetConfirmDesc')}
        confirmLabel={t('resetConfirmLabel')}
        isDangerous={true}
      />
    </div>
  );
};
