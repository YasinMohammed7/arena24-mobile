export interface PersonNumberSelectorProps {
    onSelectNumber?: (number: number) => void;
    selectedNumber?: number;
    maxNumber?: number;
    minNumber?: number;
}
