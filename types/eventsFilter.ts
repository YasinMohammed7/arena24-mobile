export interface EventsFilterProps {
    isSticky?: boolean;
}

export interface EventsFilterState {
    // EventsFilter dropdown state
    isEventsFilterDropdownVisible: boolean;
    isEventsFilterAnimating: boolean;
    selectedDateText: string;
    selectedLocations: string[];
    selectedPersonNumber: string[];

    // Filter actions
    toggleEventsFilterDropdown: () => void;
    setEventsFilterAnimating: (isAnimating: boolean) => void;
    setSelectedDateText: (dateText: string) => void;
    setSelectedLocations: (locations: string[]) => void;
    setSelectedPersonNumber: (personNumber: string[]) => void;
    clearAllFilters: () => void;
    resetFilters: () => void;
}