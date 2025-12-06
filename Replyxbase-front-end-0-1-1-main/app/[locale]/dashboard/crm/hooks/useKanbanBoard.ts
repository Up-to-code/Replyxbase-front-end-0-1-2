import { useState, useEffect, useCallback } from 'react';
import { Booking } from '../types';
import { useTranslations } from 'next-intl';

interface KanbanBoardHookProps {
  initialBookings: Booking[];
  initialSettings?: any;
  onReorder?: (items: { id: string; position: number; status: string }[]) => Promise<void>;
  onUpdateSettings?: (settings: any) => Promise<void>;
  onStatusChange?: (bookingId: string, newStatus: Booking['status']) => void;
}

const defaultColumns: { id: string; title: string }[] = [
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
  onStatusChange
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
          await onUpdateSettings({
              ...initialSettings,
              columns: newColumns
          });
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
    return newColumn.id; // Return ID to allow auto-focus
  };

  const deleteColumn = async (columnId: string) => {
      const newColumns = columns.filter(c => c.id !== columnId);
      setColumns(newColumns);
      await saveSettings(newColumns);
  };

  const renameColumn = async (columnId: string, newTitle: string) => {
      if (!newTitle.trim()) return;
      
      const newColumns = columns.map(col => 
          col.id === columnId ? { ...col, title: newTitle } : col
      );
      setColumns(newColumns);
      await saveSettings(newColumns);
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
            
            // If dragging within same column, check if we're moving down (original index < target index)
            // Note: newBookingsList already has the item removed, so 'originalIndex' comparison requires logic
            // But simplify: If I drag A over B, and I want to swap, I usually want A after B.
            // Standard "Insert Before" logic:
            // List: [A, B, C]. Drag A. list w/o A: [B, C]. Target B(0). Splice(0, 0, A) -> [A, B, C]. No change.
            // Target C(1). Splice(1, 0, A) -> [B, A, C]. Correct.
            
            // To fix "dragging down on B doesn't swap":
            // We need to know if the user INTENDED to drop 'after'. 
            // In a strict list, this is hard without coordinate tracking.
            // However, a common heuristic: if dragOverBookingId matches the original *next* item, we might be moving down.
            
            // Better fix: check indices in the *original* list.
            const originalSourceIndex = bookingsInColumn.findIndex(b => b.id === bookingId);
            const originalTargetIndex = bookingsInColumn.findIndex(b => b.id === dragOverBookingId);
            
            let insertionIndex = dragOverIndex;

            if (columnId === draggedBooking.status && originalSourceIndex !== -1 && originalTargetIndex !== -1) {
                // Moving down in same column
                if (originalSourceIndex < originalTargetIndex) {
                    insertionIndex = dragOverIndex + 1; 
                }
            }

            if (dragOverIndex !== -1) {
                 newBookingsList.splice(insertionIndex, 0, { ...draggedBooking, status: columnId as any });
            } else {
                 newBookingsList.push({ ...draggedBooking, status: columnId as any });
            }
        } else {
            // Append to end if dropped on empty space in column
            newBookingsList.push({ ...draggedBooking, status: columnId as any });
        }

        // Create update payload
        const updates = newBookingsList.map((b, index) => ({
            id: b.id,
            position: index,
            status: columnId
        }));
        
        await onReorder(updates);
    } else if (bookingId && onStatusChange) {
      // Fallback if no reorder logic (legacy support)
      onStatusChange(bookingId, columnId as any);
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
      getBookingsByStatus
  };
};
