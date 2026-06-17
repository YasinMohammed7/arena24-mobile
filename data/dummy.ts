import BookTableIcon from '@/assets/reservations-icons/bookTable.svg';
import RestaurantIcon from '@/assets/reservations-icons/restaurant-icon.svg';
import type { offersCategory, offersItem } from '@/types/offers';
import type { CardEvent } from '@/types/homepage';
import type { LocationProps } from '@/types/homepage';
import type {
  ReservationItem,
  ReservationCardItemProps,
} from '@/types/reservations';
import i18n from '@/i18n/config';

/* ------------------------------------------------------------------
 * DATA
 * ----------------------------------------------------------------*/

// Function to get translated menu options
export const getMenuOptions = () => [
  {
    id: 1,
    name: 'reservation',
    title: i18n.t('menu.bookTable'),
    icon: require('@/assets/images/rezerva_masa.png'),
  },
  {
    id: 2,
    name: 'menu',
    title: i18n.t('menu.menu'),
    icon: require('@/assets/images/vezi_meniul.webp'),
  },
  {
    id: 3,
    name: 'requests',
    title: i18n.t('menu.requestSomething'),
    icon: require('@/assets/images/ai_nevoie_de_ceva.webp'),
  },
  {
    id: 4,
    name: 'treat',
    title: i18n.t('menu.treat'),
    icon: require('@/assets/images/Fac_cinste_cuiva.webp'),
  },
  {
    id: 5,
    name: 'feedback',
    title: i18n.t('menu.feedback'),
    icon: require('@/assets/images/Lasa_feedback.webp'),
  },
  {
    id: 6,
    name: 'contact',
    title: i18n.t('menu.contact'),
    icon: require('@/assets/images/contact.png'),
  },
];

// Export for backward compatibility
export const MENU_OPTIONS = getMenuOptions();

// export const OFFERS_CATEGORIES: offersCategory[] = [
//   {
//     id: 1,
//     title: "Breakfast",
//     icon: BreakfastIcon,
//   },
//   {
//     id: 2,
//     title: "Breakfast",
//     icon: BreakfastIcon,
//   },
//   {
//     id: 3,
//     title: "Breakfast",
//     icon: BreakfastIcon,
//   },
//   {
//     id: 4,
//     title: "Breakfast",
//     icon: BreakfastIcon,
//   },
//   {
//     id: 5,
//     title: "Breakfast",
//     icon: BreakfastIcon,
//   },
//   {
//     id: 6,
//     title: "Breakfast",
//     icon: BreakfastIcon,
//   },
// ];

// export const OFFERS: offersItem[] = [
//   {
//     id: 1,
//     title: "Reducere 10% la toti burgerii",
//     image: require("@/assets/images/burgerOffer.png"),
//     location: "Studio 80",
//     rating: 4.5,
//     dateInterval: "12-22 iulie",
//   },
//   {
//     id: 2,
//     title: "Reducere 10% la toti burgerii",
//     image: require("@/assets/images/burgerOffer.png"),
//     location: "Studio 80",
//     rating: 4.5,
//     dateInterval: "12-22 iulie",
//   },
//   {
//     id: 3,
//     title: "Reducere 10% la toti burgerii",
//     image: require("@/assets/images/burgerOffer.png"),
//     location: "Studio 80",
//     rating: 4.5,
//     dateInterval: "12-22 iulie",
//   },
// ];

export const cardEvents: CardEvent[] = [
  {
    id: 1,
    title: 'Eveniment 1',
    image: require('@/assets/images/eventImg.png'),
    location: 'Studio 80',
    eventDate: '16 Martie',
    eventTime: '20:00',
    eventParticipants: 50,
    description:
      'Alătură-te unui eveniment special la Studio 80! O experiență unică te așteaptă într-o atmosferă plăcută și relaxantă. Bucură-te de momente memorable alături de prieteni și familie. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.',
  },
  {
    id: 2,
    title: 'Eveniment 2',
    image: require('@/assets/images/eventImg.png'),
    location: 'Studio 80',
    eventDate: '16 Martie',
    eventTime: '20:00',
    eventParticipants: 50,
    description:
      'Descoperă o nouă experiență culinară și de divertisment la Studio 80! Evenimentul nostru special îți oferă șansa să te bucuri de preparate delicioase, muzică live și o atmosferă caldă și primitoare. Vino alături de prietenii tăi pentru o seară de neuitat. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.',
  },
  {
    id: 3,
    title: 'Eveniment 3',
    image: require('@/assets/images/eventImg.png'),
    location: 'Studio 80',
    eventDate: '16 Martie',
    eventTime: '20:00',
    eventParticipants: 50,
    description:
      'Un eveniment de excepție te așteaptă la Studio 80! Bucură-te de o seară plină de surprize, cu preparate rafinate, cocktailuri speciale și entertainment de calitate. Atmosfera elegantă și serviciul impecabil vor face din această seară una memorabilă. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.',
  },
];

export const locations: LocationProps[] = [
  {
    id: 1,
    name: 'Studio 80',
    category: 'Fine Dining & Cocktails',
    distance: '1.2 km',
    address: 'Strada Oituz 1, Otopeni, Ilfov, Romania',
    hours: '09:00 - 20:00',
    phone: '0740 123 456',
    rating: 4.8,
    tags: [
      'Terasa',
      'Parcare',
      'Muzica Live',
      'Private Dining',
      'Preparate Vegane',
    ],
    imageSource: require('@/assets/images/eventImg.png'),
  },
  {
    id: 2,
    name: 'Henri Coanda Restaurant',
    category: 'Airport Dining',
    distance: '0.5 km',
    address:
      'Aeroportul Henri Coandă, Calea Bucureștilor 224E, Otopeni, Ilfov, Romania',
    hours: '06:00 - 24:00',
    phone: '0721 987 654',
    rating: 4.5,
    tags: ['WiFi', 'Parcare', 'Airport Access', 'International Cuisine'],
    imageSource: require('@/assets/images/eventImg.png'),
  },
  {
    id: 3,
    name: 'Otopeni Station Cafe',
    category: 'Cafe & Light Meals',
    distance: '0.8 km',
    address: 'Gara Otopeni, Strada Gării, Otopeni, Ilfov, Romania',
    hours: '07:00 - 22:00',
    phone: '0721 555 333',
    rating: 4.2,
    tags: ['WiFi', 'Quick Service', 'Coffee', 'Breakfast'],
    imageSource: require('@/assets/images/eventImg.png'),
  },
  {
    id: 4,
    name: 'Business Hub Restaurant',
    category: 'Business Dining',
    distance: '1.0 km',
    address: 'Calea Bucureștilor 150, Otopeni, Ilfov, Romania',
    hours: '08:00 - 20:00',
    phone: '0721 444 555',
    rating: 4.3,
    tags: ['Business Lunch', 'Meeting Rooms', 'Parking', 'Modern Cuisine'],
    imageSource: require('@/assets/images/restaurant-photo.png'),
  },
  {
    id: 5,
    name: 'Airport Plaza Bistro',
    category: 'Casual Dining',
    distance: '0.6 km',
    address: 'Bulevardul Aeroportului 15, Otopeni, Ilfov, Romania',
    hours: '10:00 - 23:00',
    phone: '0721 666 777',
    rating: 4.4,
    tags: ['Family Friendly', 'Shopping Area', 'Terrace', 'Romanian Cuisine'],
    imageSource: require('@/assets/images/restaurant-photo.png'),
  },
  {
    id: 6,
    name: 'Terminal Lounge',
    category: 'Fine Dining',
    distance: '0.4 km',
    address: 'Calea Bucureștilor 200, Otopeni, Ilfov, Romania',
    hours: '12:00 - 01:00',
    phone: '0721 888 999',
    rating: 4.6,
    tags: ['Premium Dining', 'Cocktails', 'Late Night', 'VIP Service'],
    imageSource: require('@/assets/images/eventImg.png'),
  },
];

// Function to get translated reservations
export const getReservations = (): ReservationItem[] => [
  {
    id: 1,
    icon: BookTableIcon,
    type: 'location',
    title: i18n.t('reservations.bookTable'),
    description: i18n.t('dummy.bookTableDescription'),
  },
  {
    id: 2,
    icon: RestaurantIcon,
    type: 'event',
    title: i18n.t('reservations.myEvent'),
    description: i18n.t('dummy.myEventDescription'),
  },
];

// Export for backward compatibility
export const RESERVATIONS = getReservations();
