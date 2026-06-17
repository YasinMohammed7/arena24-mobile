import { ImageSourcePropType } from "react-native";

export type CardEvent = {
    id: number;
    title: string;
    image: ImageSourcePropType;
    location: string;
    eventDate: string;
    eventTime: string;
    eventParticipants: number;
    description: string;
};

type hours = `${string} - ${string}`;
type phone = `0${string}`;

export interface LocationProps {
    id: number;
    name: string;
    category: string;
    distance: string;
    address: string;
    hours: hours;
    phone: phone;
    rating: number;
    tags: string[];
    imageSource: ImageSourcePropType;
}

export interface CardEventProps {
    event: CardEvent;
}