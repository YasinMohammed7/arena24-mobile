import { ComponentType } from 'react';
import { SvgProps } from 'react-native-svg';

export interface ReservationCardProps {
    icon: ComponentType<SvgProps>;
    title: string;
    description: string;
    onPress?: () => void;
}

export interface ReservationItem {
    id: number;
    icon: ComponentType<SvgProps>;
    title: string;
    type: string;
    description: string;
}

export interface ReservationDropdownProps {
    icon: ComponentType<SvgProps>;
    text: string;
    onPress?: () => void;
    isExpanded?: boolean;
    children?: React.ReactNode;
}

export interface ReservationCardItemProps {
    id: number;
    location: string;
    type: 'location' | 'rental' | 'event';
    title: string;
    status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'FINISHED';
    date: string;
    time: string;
    people: number;
    note?: string;
}

export interface ReservationDetails {
    name: string;
    phone: string;
    specialRequirements: string;
}

export type reservationEventData = {
    eventId: number;
    peopleCount: number;
    details?: string;
}