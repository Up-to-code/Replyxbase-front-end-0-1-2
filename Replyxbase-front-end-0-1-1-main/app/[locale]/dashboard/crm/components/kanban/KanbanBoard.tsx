import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Check, X, Plus } from 'lucide-react';
import { useTranslations, useFormatter } from 'next-intl';
import { Booking } from '../../types';
import { PriorityBadge } from '../ui/Badges';
import { useKanbanBoard } from '../../hooks/useKanbanBoard';
import { DeleteColumnModal } from './DeleteColumnModal';

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
  /** Initial settings */
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
  initialSettings,
  isLoading 
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
      getBookingsByStatus
  } = useKanbanBoard({
      initialBookings: bookings,
      initialSettings,
      onReorder,
      onUpdateSettings,
      onStatusChange
  });

  // Column Renaming State (UI only)
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [tempColumnTitle, setTempColumnTitle] = useState('');

  // Card Editing State
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ fullName: string }>({ fullName: '' });

  // Delete Column Modal State
  const [columnToDelete, setColumnToDelete] = useState<{ id: string; title: string } | null>(null);

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
    <div className="flex flex-col h-full bg-slate-50/50">
        <div className="flex justify-end px-6 py-2">
            <button 
                onClick={handleAddColumnClick}
                className="text-sm font-medium text-[#005bbc] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border-2 border-transparent hover:border-blue-100 flex items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Add Column
            </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 px-4 min-h-[calc(100vh-250px)]">
        {columns.map((column) => {
            const columnBookings = getBookingsByStatus(column.id);
            
            return (
          <div
            key={column.id}
            className={`min-w-[320px] max-w-[320px] flex flex-col rounded-xl border-2 transition-colors duration-200 ${
              columnBookings.length === 0 ? 'bg-slate-50/50 border-dashed' : 'bg-slate-50/30 border-solid'
            } border-slate-200 hover:border-slate-300 hover:bg-slate-50`}
            onDragOver={(e) => {
                 // Forward to hook with simplified logical check
                 handleDragOver(e);
                 e.currentTarget.classList.add('bg-blue-50/50', 'border-[#005bbc]/30');
            }}
            onDragLeave={(e) => {
                handleDragLeave();
                e.currentTarget.classList.remove('bg-blue-50/50', 'border-[#005bbc]/30');
            }}
            onDrop={(e) => {
                e.currentTarget.classList.remove('bg-blue-50/50', 'border-[#005bbc]/30');
                handleDrop(e, column.id, columnBookings);
            }}
          >
            {/* Column Header */}
            <div className="p-4 border-b-2 border-slate-200 bg-white rounded-t-xl sticky top-0 z-10">
              <div className="flex items-center justify-between">
                {editingColumnId === column.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      value={tempColumnTitle}
                      onChange={(e) => setTempColumnTitle(e.target.value)}
                      className="flex-1 text-sm bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] rounded-xl px-3 py-2 focus:outline-none focus:ring-0 transition-all"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveColumnTitle();
                        if (e.key === 'Escape') setEditingColumnId(null);
                      }}
                    />
                    <button onClick={saveColumnTitle} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingColumnId(null)} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors border-2 border-transparent hover:border-slate-200">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div 
                    className="font-semibold text-slate-900 flex items-center gap-2 cursor-pointer hover:text-[#005bbc] transition-colors group/title"
                    onDoubleClick={() => {
                        setEditingColumnId(column.id);
                        setTempColumnTitle(column.title);
                    }}
                  >
                    {column.title}
                    <span className="text-xs font-normal text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border-2 border-slate-200">
                      {columnBookings.length}
                    </span>
                    <button 
                        onClick={() => setColumnToDelete({ id: column.id, title: column.title })}
                        className="opacity-0 group-hover/title:opacity-100 p-1 text-slate-400 hover:text-rose-500 ml-2 transition-all"
                        title="Delete Column"
                    >
                        <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
              {columnBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  layoutId={booking.id}
                  draggable={!editingBookingId}
                  onDragStart={(e) => handleDragStart(e as any, booking.id)}
                  className={`bg-white p-4 rounded-xl border-2 border-slate-200 transition-all duration-200 group ${
                    draggedBookingId === booking.id ? 'opacity-50 scale-95' : ''
                  } ${dragOverBookingId === booking.id ? 'border-t-4 border-t-[#005bbc] mt-2' : ''} ${!editingBookingId ? 'cursor-grab active:cursor-grabbing hover:border-slate-300' : ''}`}
                  whileHover={!editingBookingId ? { y: -2 } : {}}
                  onDragOver={(e) => {
                      if (draggedBookingId !== booking.id) {
                          handleDragOver(e as any, booking.id);
                          e.stopPropagation();
                      }
                  }}
                  onDragLeave={(e) => {
                       // prevent parent onDragLeave from firing if we leave to a child? No, keep simple.
                       // Just let the hover effect handle itself.
                  }}
                >
                  {editingBookingId === booking.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-slate-500 block mb-2">Customer Name</label>
                        <input
                          type="text"
                          value={editForm.fullName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                          className="w-full text-sm bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] rounded-xl px-3 py-2 focus:outline-none focus:ring-0 transition-all"
                          autoFocus
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingBookingId(null)}
                          className="px-3 py-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium border-2 border-transparent hover:border-slate-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveCardEdit(booking)}
                          className="px-3 py-1.5 bg-[#005bbc] text-white hover:bg-[#004a9f] border-2 border-[#005bbc] rounded-lg transition-colors text-sm font-medium"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div onDoubleClick={() => startEditingCard(booking)}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-600 border-2 border-white">
                            {booking.customer.fullName.charAt(0)}
                          </div>
                          <div onClick={() => onView(booking)} className="cursor-pointer">
                            <p className="text-sm font-medium text-slate-900 line-clamp-1 hover:text-[#005bbc]">
                              {booking.customer.fullName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {booking.serviceType}
                            </p>
                          </div>
                        </div>
                        <PriorityBadge priority={booking.priority} />
                      </div>

                      <div className="space-y-2 cursor-pointer" onClick={() => onView(booking)}>
                        <div className={`flex items-center gap-2 text-xs ${
                          new Date(booking.date) < new Date() && booking.status === 'pending' 
                            ? 'text-rose-600 font-medium' 
                            : 'text-slate-600'
                        }`}>
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {format.dateTime(new Date(booking.date), { 
                              year: 'numeric', 
                              month: 'numeric', 
                              day: 'numeric' 
                            })} • {booking.startTime}
                          </span>
                          {new Date(booking.date) < new Date() && booking.status === 'pending' && (
                            <span className="bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded text-[10px]">{t("overdue")}</span>
                          )}
                        </div>
                        
                        {booking.location && (
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="line-clamp-1">{booking.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t-2 border-slate-200 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                           {/* Status dot for quick visual check */}
                           <div className={`w-2 h-2 rounded-full ${
                             booking.status === 'confirmed' ? 'bg-emerald-500' :
                             booking.status === 'pending' ? 'bg-amber-500' :
                             booking.status === 'completed' ? 'bg-blue-500' :
                             'bg-slate-300'
                           }`} />
                           <span className="text-xs text-slate-500 capitalize">{tStatus(booking.status)}</span>
                        </div>
                        <span 
                          onClick={() => onView(booking)}
                          className="text-xs text-slate-400 group-hover:text-[#005bbc] transition-colors cursor-pointer"
                        >
                          {t("viewDetails")} →
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              
              {columnBookings.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg">
                  {t("noBookings")}
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
    </div>
  );
};
