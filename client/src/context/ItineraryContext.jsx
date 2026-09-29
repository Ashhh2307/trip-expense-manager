import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useExpenses } from './ExpenseContext';

const ItineraryContext = createContext(null);

export const ItineraryProvider = ({ children }) => {
  const { user } = useAuth();
  const { addExpense, fetchExpenses, fetchStats, showToast } = useExpenses();

  const storageKey = user?.id || user?._id ? `travelwise_itineraries_${user.id || user._id}` : 'travelwise_itineraries_guest';

  const [savedItineraries, setSavedItineraries] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);

  // Sync with user's storage key on user change
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      setSavedItineraries(stored ? JSON.parse(stored) : []);
    } catch {
      setSavedItineraries([]);
    }
  }, [storageKey]);

  // Persist to localStorage whenever savedItineraries change
  const persistItineraries = useCallback(
    (itineraries) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(itineraries));
      } catch (err) {
        console.error('Failed to persist itineraries:', err);
      }
    },
    [storageKey]
  );

  /**
   * Save an itinerary object to the user's permanent list
   */
  const saveItinerary = useCallback(
    (itinerary) => {
      if (!itinerary || !itinerary.destination) return { success: false };

      const itineraryId = itinerary.id || `itin-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const newItinerary = {
        ...itinerary,
        id: itineraryId,
        savedAt: new Date().toISOString(),
        tripName: itinerary.destination || 'Custom Trip',
      };

      setSavedItineraries((prev) => {
        // Check if already exists by destination or id
        const exists = prev.some(
          (item) => item.id === itineraryId || item.destination.toLowerCase() === itinerary.destination.toLowerCase()
        );
        let updated;
        if (exists) {
          updated = prev.map((item) =>
            item.id === itineraryId || item.destination.toLowerCase() === itinerary.destination.toLowerCase()
              ? newItinerary
              : item
          );
        } else {
          updated = [newItinerary, ...prev];
        }
        persistItineraries(updated);
        return updated;
      });

      showToast(`"${itinerary.destination}" itinerary saved to My Trips!`, 'success');
      return { success: true, id: itineraryId };
    },
    [persistItineraries, showToast]
  );

  /**
   * Remove an itinerary
   */
  const deleteItinerary = useCallback(
    (id) => {
      setSavedItineraries((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        persistItineraries(updated);
        return updated;
      });
      showToast('Itinerary removed from your list', 'info');
    },
    [persistItineraries, showToast]
  );

  /**
   * Check if an itinerary is already saved
   */
  const isItinerarySaved = useCallback(
    (destinationOrId) => {
      if (!destinationOrId) return false;
      return savedItineraries.some(
        (item) =>
          item.id === destinationOrId ||
          item.destination?.toLowerCase() === destinationOrId.toLowerCase()
      );
    },
    [savedItineraries]
  );

  /**
   * Convert an itinerary's budget breakdown into individual expenses in the user's expense list
   */
  const convertItineraryToExpenses = useCallback(
    async (itinerary) => {
      if (!itinerary) return { success: false };

      const tripName = itinerary.destination || 'Trip Plan';
      const breakdown = itinerary.budgetBreakdown || [];

      if (breakdown.length === 0) {
        // Single lump sum expense if no breakdown
        const payload = new FormData();
        payload.append('title', `${itinerary.destination} Estimated Budget`);
        payload.append('amount', itinerary.totalBudget || 25000);
        payload.append('category', 'Other');
        payload.append('merchant', 'Planned Travel');
        payload.append('trip', tripName);
        payload.append('status', 'Pending');
        payload.append('notes', `Planned budget for ${itinerary.duration || 'Trip'}`);
        payload.append('date', new Date().toISOString().split('T')[0]);

        await addExpense(payload);
      } else {
        // Create expense for each category in breakdown
        for (const item of breakdown) {
          const payload = new FormData();
          payload.append('title', `${tripName} - ${item.category} Budget`);
          payload.append('amount', item.amount);
          payload.append('category', item.category || 'Other');
          payload.append('merchant', `${tripName} Planned`);
          payload.append('trip', tripName);
          payload.append('status', 'Pending');
          payload.append('notes', `Allocated ${item.percentage || ''} of trip budget for ${itinerary.duration || ''}`);
          payload.append('date', new Date().toISOString().split('T')[0]);

          await addExpense(payload);
        }
      }

      await fetchExpenses();
      await fetchStats();
      showToast(`Added ${breakdown.length || 1} planned expense items for "${tripName}" to your Expenses list!`, 'success');
      return { success: true };
    },
    [addExpense, fetchExpenses, fetchStats, showToast]
  );

  const openSavedModal = (itinerary = null) => {
    setSelectedItinerary(itinerary);
    setIsSavedModalOpen(true);
  };

  const closeSavedModal = () => {
    setIsSavedModalOpen(false);
    setSelectedItinerary(null);
  };

  const value = {
    savedItineraries,
    isSavedModalOpen,
    selectedItinerary,
    saveItinerary,
    deleteItinerary,
    isItinerarySaved,
    convertItineraryToExpenses,
    openSavedModal,
    closeSavedModal,
  };

  return <ItineraryContext.Provider value={value}>{children}</ItineraryContext.Provider>;
};

export const useItinerary = () => {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error('useItinerary must be used within an ItineraryProvider');
  }
  return context;
};
