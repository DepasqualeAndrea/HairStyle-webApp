import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

// Importa le traduzioni
import it from '@/locales/it-IT.json';
import en from '@/locales/en-US.json';

// Crea l'istanza i18n
const i18n = new I18n({
    'it-IT': it,
    'en-US': en,
});

// Imposta locale di default
i18n.locale = Localization.locale || 'it-IT';
i18n.enableFallback = true;
i18n.defaultLocale = 'it-IT';

export default i18n;

// Esporta funzione di traduzione
export const t = (key: string, options?: any) => i18n.t(key, options);

// Esporta funzione per cambiare lingua
export const changeLanguage = (locale: 'it-IT' | 'en-US') => {
    i18n.locale = locale;
};

// Esporta locale corrente
export const getCurrentLocale = () => i18n.locale;
