// Server reservation response types
export interface ServerReservation {
  id: number;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  peopleCount: number;
  status: "CONFIRMED" | "PENDING" | "CANCELLED" | "FINISHED";
  details?: string | null;
  eventId?: number | null;
  locationId?: number | null;
  createdAt: string;
  updatedAt: string;
  event: {
    id: number;
    name: string;
    date: string;
    startHour: string;
    endHour: string;
  } | null;
  location: {
    id: number;
    name: string;
    type: string;
    address: string;
  } | null;
}
