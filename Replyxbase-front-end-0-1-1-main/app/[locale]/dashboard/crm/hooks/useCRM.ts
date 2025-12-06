import { useFilters } from './useFilters';
import { useBookings } from './useBookings';

export const useCRM = () => {
  const filters = useFilters();
  const bookings = useBookings(filters);

  return {
    ...filters,
    ...bookings
  };
};
