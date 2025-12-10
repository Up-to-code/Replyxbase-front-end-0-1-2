import { useState, useEffect, useCallback } from 'react';
import { Booking } from '../types';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface KanbanBoardHookProps {
  initialBookings: Booking[];
  initialSettings?: any;
  onReorder?: (items: { id: string; position: number; status: string }[]) => Promise<void>;
  onUpdateSettings?: (settings: any) => Promise<void>;
  onStatusChange?: (bookingId: string, newStatus: Booking['status']) => void;
  onBulkStatusChange?: (oldStatus: string, newStatus: string) => Promise<void>;
}

const defaultColumns: { id: string; title: string }[] = [
  { id: 'draft', title: 'Draft' },
  { id: 'pending', title: 'Pending' },
  { id: 'confirmed', title: 'Confirmed' },
  { id: 'completed', title: 'Completed' },
  { id: 'cancelled', title: 'Cancelled' },
  { id: 'no-show', title: 'No Show' },
];

export const useKanbanBoard = ({
  initialBookings,
  initialSettings,
  onReorder,
  onUpdateSettings,
  onStatusChange,
  onBulkStatusChange
}: KanbanBoardHookProps) => {
  const tStatus = useTranslations("Dashboard.CRM.Status");
  
  // -- State --
  const [columns, setColumns] = useState<{ id: string; title: string }[]>(defaultColumns);
  const [draggedBookingId, setDraggedBookingId] = useState<string | null>(null);
  const [dragOverBookingId, setDragOverBookingId] = useState<string | null>(null);

  // -- Initialization --
  useEffect(() => {
    if (initialSettings?.columns && Array.isArray(initialSettings.columns)) {
        setColumns(initialSettings.columns);
    } else {
        const cols = defaultColumns.map(col => ({
            ...col,
            title: tStatus(col.id as any) || col.title
        }));
        setColumns(cols);
    }
  }, [tStatus, initialSettings]);


  // -- Column Management --
  const saveSettings = async (newColumns: {id: string, title: string}[]) => {
      if (onUpdateSettings) {
          try {
            await onUpdateSettings({
                ...initialSettings,
                columns: newColumns
            });
          } catch (error) {
              console.error('Failed to save settings:', error);
              toast.error('Failed to save column settings');
          }
      }
  };

  const addColumn = async () => {
    const newColumn = {
        id: `custom-${Date.now()}`,
        title: 'New Column'
    };
    const newColumns = [...columns, newColumn];
    setColumns(newColumns);
    await saveSettings(newColumns);
    toast.success('Column added');
    return newColumn.id; // Return ID to allow auto-focus
  };

  const deleteColumn = async (columnId: string) => {
      const newColumns = columns.filter(c => c.id !== columnId);
      setColumns(newColumns);
      await saveSettings(newColumns);
      toast.success('Column deleted');
  };

  const renameColumn = async (columnId: string, newTitle: string) => {
      if (!newTitle.trim()) return;
      
      const columnToRename = columns.find(c => c.id === columnId);
      const oldTitle = columnToRename?.title;

      const newColumns = columns.map(col => 
          col.id === columnId ? { ...col, title: newTitle } : col
      );
      setColumns(newColumns);
      await saveSettings(newColumns);
      
      // Trigger bulk update if it's a custom column (name-based status)
      if (columnId.startsWith('custom-') && oldTitle && onBulkStatusChange) {
          // Optimistic or waiting? Let's just trigger.
          // Since we use Title as ID for custom columns, we MUST migrate the data.
          await onBulkStatusChange(oldTitle, newTitle);
      }

      toast.success('Column renamed');
  };

  const resetColumns = async () => {
      const resetCols = defaultColumns.map(col => ({
          ...col,
          title: tStatus(col.id as any) || col.title
      }));
      setColumns(resetCols);
      await saveSettings(resetCols);
      toast.success('Columns reset to default');
  };

  // -- Column Drag & Drop --
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);

  const handleColumnDragStart = (e: React.DragEvent, columnId: string) => {
      setDraggedColumnId(columnId);
      e.dataTransfer.setData('columnId', columnId);
      e.dataTransfer.effectAllowed = 'move';
  };

  const handleColumnDrop = async (e: React.DragEvent, targetColumnId: string) => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData('columnId');
      if (!draggedId || draggedId === targetColumnId) return;

      const oldIndex = columns.findIndex(c => c.id === draggedId);
      const newIndex = columns.findIndex(c => c.id === targetColumnId);

      if (oldIndex === -1 || newIndex === -1) return;

      const newColumns = [...columns];
      const [removed] = newColumns.splice(oldIndex, 1);
      newColumns.splice(newIndex, 0, removed);

      setColumns(newColumns);
      await saveSettings(newColumns);
      setDraggedColumnId(null);
  };


  // -- Drag & Drop Logic --
  const handleDragStart = (e: React.DragEvent, bookingId: string) => {
    setDraggedBookingId(bookingId);
    e.dataTransfer.setData('bookingId', bookingId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, bookingId?: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      
      if (bookingId && draggedBookingId !== bookingId) {
          setDragOverBookingId(bookingId);
      }
  };

  const handleDragLeave = () => {
      setDragOverBookingId(null);
  };

  const handleDrop = async (e: React.DragEvent, columnId: string, bookingsInColumn: Booking[]) => {
    e.preventDefault();
    const bookingId = e.dataTransfer.getData('bookingId');
    
    // Clear highlight
    setDragOverBookingId(null);
    setDraggedBookingId(null);

    // Determine new status based on column type
    // User requested "based on column name" specifically.
    // For custom columns, the status stored in DB will be the readable Column Title.
    let newStatus = columnId;
    if (columnId.startsWith('custom-')) {
        const targetColumn = columns.find(c => c.id === columnId);
        if (targetColumn) {
            newStatus = targetColumn.title;
        }
    }

    // If we have a bookingId and reorder handler
    if (bookingId && onReorder) {
        const draggedBooking = initialBookings.find(b => b.id === bookingId);
        if (!draggedBooking) return;

        // Ensure we work with a clean list of bookings for the target column
        // Exclude the dragged booking from its old position if it was already in this column
        const otherBookings = bookingsInColumn.filter(b => b.id !== bookingId);
        let newBookingsList = [...otherBookings];

        // Determine insertion index
        if (dragOverBookingId) {
            const dragOverIndex = newBookingsList.findIndex(b => b.id === dragOverBookingId);
            
            // Fix sorting logic (simplified)
            // ... (keeping existing logic for insertion details)
            const originalSourceIndex = bookingsInColumn.findIndex(b => b.id === bookingId);
            const originalTargetIndex = bookingsInColumn.findIndex(b => b.id === dragOverBookingId);
            
            let insertionIndex = dragOverIndex;

            // Simplified dragging down check
            if (columnId === draggedBooking.status && originalSourceIndex !== -1 && originalTargetIndex !== -1) {
                if (originalSourceIndex < originalTargetIndex) {
                    insertionIndex = dragOverIndex + 1; 
                }
            }

            if (dragOverIndex !== -1) {
                 newBookingsList.splice(insertionIndex, 0, { ...draggedBooking, status: newStatus as any });
            } else {
                 newBookingsList.push({ ...draggedBooking, status: newStatus as any });
            }
        } else {
            // Append to end if dropped on empty space in column
            newBookingsList.push({ ...draggedBooking, status: newStatus as any });
        }

        // Create update payload
        const updates = newBookingsList.map((b, index) => ({
            id: b.id,
            position: index,
            status: newStatus
        }));
        
        await onReorder(updates);
    } else if (bookingId && onStatusChange) {
      // Fallback if no reorder logic (legacy support)
      onStatusChange(bookingId, newStatus as any);
    }
  };
  
  // -- Sorting Helper --
  const getBookingsByStatus = useCallback((status: string) => {
    return initialBookings
        .filter(b => b.status === status)
        .sort((a, b) => {
            if (a.position !== b.position) return a.position - b.position;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
  }, [initialBookings]);


  return {
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
  };
};
