import { create } from 'zustand'
import type { EventsFilterState } from '@/types/eventsFilter'


export const useEventsFilterStore = create<EventsFilterState>((set, get) => ({
    // EventsFilter dropdown state
    isEventsFilterDropdownVisible: false,
    isEventsFilterAnimating: false,
    selectedDateText: "",
    selectedLocations: [],
    selectedPersonNumber: [],

    toggleEventsFilterDropdown: () => {
        const state = get()
        if (state.isEventsFilterAnimating) return // Prevent multiple rapid clicks

        set({
            isEventsFilterDropdownVisible: !state.isEventsFilterDropdownVisible,
            isEventsFilterAnimating: true
        })
    },

    setEventsFilterAnimating: (isAnimating: boolean) => set({ isEventsFilterAnimating: isAnimating }),

    setSelectedDateText: (dateText: string) => set({ selectedDateText: dateText }),

    setSelectedLocations: (locations: string[]) => set({ selectedLocations: locations }),

    setSelectedPersonNumber: (personNumber: string[]) => set({ selectedPersonNumber: personNumber }),

    clearAllFilters: () => set({
        selectedDateText: "",
        selectedLocations: [],
        selectedPersonNumber: []
    }),

    resetFilters: () => set({
        isEventsFilterDropdownVisible: false,
        isEventsFilterAnimating: false,
        selectedDateText: "",
        selectedLocations: [],
        selectedPersonNumber: []
    })
})) 