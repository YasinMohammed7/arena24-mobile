export interface sliderProps {
    min: number;
    max: number;
    rangeArr: [number, number];
    um: string;
    value?: [number, number]; // For controlled component
    onValueChange?: (value: [number, number]) => void; // For controlled component
}