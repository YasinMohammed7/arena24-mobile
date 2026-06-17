# Ghid de utilizare i18n în Food Arena

## Configurare completă

Aplicația folosește `i18next` și `react-i18next` pentru gestionarea traducerilor.

## Instalare

```bash
npm install i18next react-i18next
npm install expo-localization
npm install --save-dev @types/i18next
```

## Structura fișierelor

```
i18n/
├── config.ts          # Configurația i18next
└── locales/
    ├── en.json        # Traduceri în engleză
    └── ro.json        # Traduceri în română
```

## Utilizare în componente

### 1. Traduceri simple

```tsx
import { useLanguage } from '@/hooks/useLanguage';

function MyComponent() {
  const { t } = useLanguage();

  return (
    <View>
      <Text>{t('common.loading')}</Text>
      <Text>{t('auth.login')}</Text>
    </View>
  );
}
```

### 2. Traduceri cu variabile (interpolation)

În `locales/ro.json`:

```json
{
  "welcome": "Bun venit, {{name}}!",
  "itemsCount": "Ai {{count}} rezervări"
}
```

În componentă:

```tsx
function WelcomeScreen() {
  const { t } = useLanguage();
  const userName = 'Ion';
  const reservationCount = 5;

  return (
    <View>
      <Text>{t('welcome', { name: userName })}</Text>
      <Text>{t('itemsCount', { count: reservationCount })}</Text>
    </View>
  );
}
```

### 3. Traduceri cu plurale

În `locales/ro.json`:

```json
{
  "reservation_zero": "Nicio rezervare",
  "reservation_one": "O rezervare",
  "reservation_other": "{{count}} rezervări"
}
```

În componentă:

```tsx
function ReservationsCount({ count }: { count: number }) {
  const { t } = useLanguage();

  return <Text>{t('reservation', { count })}</Text>;
}
```

### 4. Schimbarea limbii

```tsx
import { useLanguage } from '@/hooks/useLanguage';

function SettingsScreen() {
  const { currentLanguage, switchLanguage, toggleLanguage } = useLanguage();

  return (
    <View>
      <Text>Limba curentă: {currentLanguage}</Text>

      <Button onPress={() => switchLanguage('ro')}>Română</Button>

      <Button onPress={() => switchLanguage('en')}>English</Button>

      <Button onPress={toggleLanguage}>Schimbă limba</Button>
    </View>
  );
}
```

### 5. Folosirea componentei LanguageSwitcher

```tsx
import {
  LanguageSwitcher,
  LanguageToggle,
} from '@/components/shared/LanguageSwitcher';

function ProfileScreen() {
  return (
    <View>
      <Text>Profil</Text>

      <LanguageSwitcher showLabels={true} />

      <LanguageToggle />
    </View>
  );
}
```

### 6. Traduceri în validări Yup/Zod

```tsx
import { useLanguage } from '@/hooks/useLanguage';
import * as yup from 'yup';

function LoginScreen() {
  const { t } = useLanguage();

  const loginSchema = yup.object({
    email: yup
      .string()
      .email(t('errors.invalidEmail'))
      .required(t('errors.emailRequired')),
    password: yup
      .string()
      .min(6, t('errors.passwordTooShort'))
      .required(t('errors.passwordRequired')),
  });

  return <YourForm />;
}
```

### 7. Traduceri în Toast messages

```tsx
import Toast from 'react-native-toast-message';
import { useLanguage } from '@/hooks/useLanguage';

function BookingComponent() {
  const { t } = useLanguage();

  const handleBooking = async () => {
    try {
      await createReservation();
      Toast.show({
        type: 'success',
        text1: t('success.reservationCreated'),
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('errors.networkError'),
      });
    }
  };

  return (
    <Button onPress={handleBooking}>
      {t('reservations.confirmReservation')}
    </Button>
  );
}
```

### 8. Verificarea limbii curente

```tsx
import { useLanguage } from '@/hooks/useLanguage';

function DateDisplay() {
  const { isRomanian, isEnglish, currentLanguage } = useLanguage();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(
      currentLanguage === 'ro' ? 'ro-RO' : 'en-US'
    );
  };

  return (
    <View>
      {isRomanian && <Text>Limba: Română</Text>}
      {isEnglish && <Text>Language: English</Text>}
      <Text>{formatDate(new Date())}</Text>
    </View>
  );
}
```

## Adăugarea de noi traduceri

### Pasul 1: Adaugă cheia în fișierele JSON

În `i18n/locales/ro.json`:

```json
{
  "newFeature": {
    "title": "Titlu nou",
    "description": "Descriere nouă"
  }
}
```

În `i18n/locales/en.json`:

```json
{
  "newFeature": {
    "title": "New title",
    "description": "New description"
  }
}
```

### Pasul 2: Folosește traducerea

```tsx
function NewFeature() {
  const { t } = useLanguage();

  return (
    <View>
      <Text>{t('newFeature.title')}</Text>
      <Text>{t('newFeature.description')}</Text>
    </View>
  );
}
```

## Exemple practice pentru Food Arena

### Exemplu: NavigationBar

```tsx
import { useLanguage } from '@/hooks/useLanguage';

function TabBar() {
  const { t } = useLanguage();

  return (
    <View>
      <Tab label={t('navigation.home')} />
      <Tab label={t('navigation.locations')} />
      <Tab label={t('navigation.offers')} />
      <Tab label={t('navigation.reservations')} />
      <Tab label={t('navigation.profile')} />
    </View>
  );
}
```

### Exemplu: Login Screen

```tsx
import { useLanguage } from '@/hooks/useLanguage';
import Button from '@/components/shared/Button';

function LoginScreen() {
  const { t } = useLanguage();

  return (
    <View className='flex-1 p-4'>
      <Text className='text-2xl font-poppins-bold mb-4'>{t('auth.login')}</Text>

      <TextInput placeholder={t('auth.email')} className='border p-2 mb-2' />

      <TextInput
        placeholder={t('auth.password')}
        secureTextEntry
        className='border p-2 mb-4'
      />

      <Button>
        <Text>{t('auth.loginButton')}</Text>
      </Button>

      <TouchableOpacity>
        <Text>{t('auth.forgotPassword')}</Text>
      </TouchableOpacity>

      <Text className='mt-4'>{t('auth.dontHaveAccount')}</Text>
    </View>
  );
}
```

### Exemplu: Profile Screen cu Language Switcher

```tsx
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';

function ProfileScreen() {
  const { t } = useLanguage();

  return (
    <ScrollView className='flex-1 p-4'>
      <Text className='text-2xl font-poppins-bold mb-4'>
        {t('profile.title')}
      </Text>

      <View className='mb-6'>
        <Text className='text-lg font-poppins-medium mb-2'>
          {t('profile.language')}
        </Text>
        <LanguageSwitcher />
      </View>

      <TouchableOpacity className='py-3 border-b'>
        <Text>{t('profile.personalInfo')}</Text>
      </TouchableOpacity>

      <TouchableOpacity className='py-3 border-b'>
        <Text>{t('profile.notifications')}</Text>
      </TouchableOpacity>

      <TouchableOpacity className='py-3 border-b'>
        <Text>{t('profile.privacy')}</Text>
      </TouchableOpacity>

      <TouchableOpacity className='py-3 border-b'>
        <Text>{t('auth.logout')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
```

## Best Practices

1. **Grupează traducerile logic**: Folosește structuri ierarhice (ex: `auth.login`, `errors.networkError`)

2. **Evită hardcodarea textelor**: Întotdeauna folosește `t()` pentru orice text vizibil

3. **Consistența cheilor**: Folosește camelCase pentru cheile de traducere

4. **Traduceri complete**: Asigură-te că toate cheile există în ambele fișiere de limbă

5. **Context**: Oferă context clar în numele cheilor (ex: `reservations.confirmReservation` nu doar `confirm`)

6. **Teste**: Testează aplicația în ambele limbi pentru a verifica că toate traducerile funcționează

## Detectarea automată a limbii

Aplicația detectează automat limba dispozitivului la prima deschidere:

- Dacă limba dispozitivului este română, aplicația va folosi română
- Altfel, va folosi engleza ca limbă implicită
- Limba aleasă de utilizator este salvată în AsyncStorage

## Debugging

Pentru a verifica limba curentă în consolă:

```tsx
import { getCurrentLanguage } from '@/i18n/config';

console.log('Current language:', getCurrentLanguage());
```
