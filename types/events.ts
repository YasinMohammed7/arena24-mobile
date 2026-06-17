export interface EventCore {
    id: number;
    name: string;
    date: string;
    startHour: string;
    endHour: string;
    maxPeople: number;
    imageUrl: string;
    price: number;
    location: {
        id: number;
        name: string;
        address: string;
    }
}

type IncludedOption = {
    id: number;
    name: string;
    eventId: number;
}

type IncludedRequirement = {
    id: number;
    name: string;
    eventId: number;
}

export interface EventDetail extends EventCore {
    description: string;
    // facilities: string[];
    includedOptions: IncludedOption[];
    requirements: IncludedRequirement[];
}

export type EventType = EventCore;

export interface ApiResponse<T> {
    status: number;
    data: T;
}

export type HomePageEventsResponseType = ApiResponse<EventCore[]>;
export type EventDetailResponseType = ApiResponse<EventDetail>;

export interface EventsState {
    events: EventCore[];
    isLoading: boolean;
    error: string | null;
    eventDetail: EventDetail | null;
    isLoadingDetail: boolean;
    errorDetail: string | null;
}

export interface EventsActions {
    fetchEvents: () => Promise<void>;
    clearEvents: () => void;
    fetchEventById: (id: string) => Promise<void>;
    clearEventDetail: () => void;
}

export interface EventsStore extends EventsState, EventsActions { }