export const locales = ['es', 'en', 'fr', 'de', 'it', 'ru'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  ru: 'Русский',
};

const es = {
  navRoutes: 'Rutas & precios',
  navCars: 'Carros',
  navAbout: 'Nosotros',
  navContact: 'Contacto',

  ariaMainNav: 'Navegación principal',
  ariaMobileNav: 'Navegación móvil',
  ariaOpenMenu: 'Abrir menú',
  ariaCloseMenu: 'Cerrar menú',

  heroCta: 'Ver rutas y precios',

  routesEyebrow: 'Nuestra ruta por Varadero',
  routesTitle: 'Cada parada, una experiencia distinta',
  routesIntro:
    'Los precios varían según tu zona de hospedaje: el primer número es la tarifa más cercana a Varadero centro y el segundo, la más alejada. Todo en USD o EUR.',

  carsEyebrow: 'Nuestra flota',
  carsTitle: 'Carros disponibles',
  carsIntro:
    'Elige tu favorito y vive Varadero a tu ritmo. Todos con chofer privado, aire acondicionado y el encanto de un clásico bien cuidado.',
  carBookBtn: 'Reservar este carro',
  carWaMessage: 'Hola! Me interesa reservar el carro "{name}" con Varadero Taxi Tour.',

  commentsEyebrow: 'Comentarios',
  commentsTitle: 'Lo que dicen nuestros pasajeros',
  whatsappFloatAria: 'Reservar por WhatsApp',

  ariaViewPhotosOne: 'Ver 1 foto de {title}',
  ariaViewPhotosMany: 'Ver {count} fotos de {title}',
  ariaOpenPhoto: 'Abrir foto {index} de {title}',

  cLoading: 'Cargando comentarios…',
  cEmpty: 'Sé el primero en dejar un comentario.',
  cCarouselRole: 'carrusel',
  cCarouselLabel: 'Comentarios de pasajeros',
  cUnavailable: 'Los comentarios no están disponibles ahora mismo.',
  cNameLength: 'Escribe tu nombre (entre 2 y 60 caracteres).',
  cMessageLength: 'Escribe un comentario (entre 2 y 1000 caracteres).',
  cSendError: 'No se pudo enviar el comentario. Inténtalo de nuevo.',
  cThanks: '¡Gracias! Tu comentario se publicará en cuanto lo revisemos.',
  cFormTitle: 'Deja tu comentario',
  cNameLabel: 'Nombre',
  cNamePlaceholder: 'Tu nombre',
  cMessageLabel: 'Mensaje',
  cMessagePlaceholder: 'Cuéntanos tu experiencia…',
  cSending: 'Enviando…',
  cSubmit: 'Enviar comentario',

  lbPhotosOfTitle: 'Fotos de {title}',
  lbGallery: 'Galería de fotos',
  lbClose: 'Cerrar',
  lbPrevPhoto: 'Foto anterior',
  lbNextPhoto: 'Foto siguiente',
};

export type UiStrings = typeof es;

const en: UiStrings = {
  navRoutes: 'Routes & prices',
  navCars: 'Cars',
  navAbout: 'About us',
  navContact: 'Contact',

  ariaMainNav: 'Main navigation',
  ariaMobileNav: 'Mobile navigation',
  ariaOpenMenu: 'Open menu',
  ariaCloseMenu: 'Close menu',

  heroCta: 'See routes and prices',

  routesEyebrow: 'Our route around Varadero',
  routesTitle: 'Every stop, a different experience',
  routesIntro:
    'Prices vary depending on where you are staying: the first number is the fare closest to downtown Varadero and the second, the farthest one. All in USD or EUR.',

  carsEyebrow: 'Our fleet',
  carsTitle: 'Cars available',
  carsIntro:
    'Pick your favourite and enjoy Varadero at your own pace. All of them come with a private driver, air conditioning and the charm of a well-kept classic.',
  carBookBtn: 'Book this car',
  carWaMessage: 'Hello! I would like to book the car "{name}" with Varadero Taxi Tour.',

  commentsEyebrow: 'Reviews',
  commentsTitle: 'What our passengers say',
  whatsappFloatAria: 'Book via WhatsApp',

  ariaViewPhotosOne: 'View 1 photo of {title}',
  ariaViewPhotosMany: 'View {count} photos of {title}',
  ariaOpenPhoto: 'Open photo {index} of {title}',

  cLoading: 'Loading comments…',
  cEmpty: 'Be the first to leave a comment.',
  cCarouselRole: 'carousel',
  cCarouselLabel: 'Passenger reviews',
  cUnavailable: 'Comments are not available right now.',
  cNameLength: 'Please enter your name (between 2 and 60 characters).',
  cMessageLength: 'Please write a comment (between 2 and 1000 characters).',
  cSendError: 'Could not send your comment. Please try again.',
  cThanks: 'Thank you! Your comment will be published once we review it.',
  cFormTitle: 'Leave a comment',
  cNameLabel: 'Name',
  cNamePlaceholder: 'Your name',
  cMessageLabel: 'Message',
  cMessagePlaceholder: 'Tell us about your experience…',
  cSending: 'Sending…',
  cSubmit: 'Send comment',

  lbPhotosOfTitle: 'Photos of {title}',
  lbGallery: 'Photo gallery',
  lbClose: 'Close',
  lbPrevPhoto: 'Previous photo',
  lbNextPhoto: 'Next photo',
};

const fr: UiStrings = {
  navRoutes: 'Routes & tarifs',
  navCars: 'Voitures',
  navAbout: 'À propos',
  navContact: 'Contact',

  ariaMainNav: 'Navigation principale',
  ariaMobileNav: 'Navigation mobile',
  ariaOpenMenu: 'Ouvrir le menu',
  ariaCloseMenu: 'Fermer le menu',

  heroCta: 'Voir les routes et les prix',

  routesEyebrow: 'Notre parcours à Varadero',
  routesTitle: 'Chaque arrêt, une expérience différente',
  routesIntro:
    "Les prix varient selon votre zone d'hébergement : le premier chiffre correspond au tarif le plus proche du centre de Varadero et le second, au plus éloigné. Tout en USD ou EUR.",

  carsEyebrow: 'Notre flotte',
  carsTitle: 'Voitures disponibles',
  carsIntro:
    "Choisissez votre préférée et vivez Varadero à votre rythme. Toutes avec chauffeur privé, climatisation et le charme d'une classique bien entretenue.",
  carBookBtn: 'Réserver cette voiture',
  carWaMessage: 'Bonjour ! Je souhaite réserver la voiture « {name} » avec Varadero Taxi Tour.',

  commentsEyebrow: 'Avis',
  commentsTitle: 'Ce que disent nos passagers',
  whatsappFloatAria: 'Réserver par WhatsApp',

  ariaViewPhotosOne: 'Voir 1 photo de {title}',
  ariaViewPhotosMany: 'Voir {count} photos de {title}',
  ariaOpenPhoto: 'Ouvrir la photo {index} de {title}',

  cLoading: 'Chargement des commentaires…',
  cEmpty: 'Soyez le premier à laisser un commentaire.',
  cCarouselRole: 'carrousel',
  cCarouselLabel: 'Avis des passagers',
  cUnavailable: "Les commentaires ne sont pas disponibles pour le moment.",
  cNameLength: 'Écrivez votre nom (entre 2 et 60 caractères).',
  cMessageLength: 'Écrivez un commentaire (entre 2 et 1000 caractères).',
  cSendError: "Impossible d'envoyer le commentaire. Réessayez.",
  cThanks: 'Merci ! Votre commentaire sera publié dès que nous l\'aurons révisé.',
  cFormTitle: 'Laissez un commentaire',
  cNameLabel: 'Nom',
  cNamePlaceholder: 'Votre nom',
  cMessageLabel: 'Message',
  cMessagePlaceholder: 'Racontez-nous votre expérience…',
  cSending: 'Envoi…',
  cSubmit: 'Envoyer le commentaire',

  lbPhotosOfTitle: 'Photos de {title}',
  lbGallery: 'Galerie de photos',
  lbClose: 'Fermer',
  lbPrevPhoto: 'Photo précédente',
  lbNextPhoto: 'Photo suivante',
};

const de: UiStrings = {
  navRoutes: 'Routen & Preise',
  navCars: 'Autos',
  navAbout: 'Über uns',
  navContact: 'Kontakt',

  ariaMainNav: 'Hauptnavigation',
  ariaMobileNav: 'Mobile Navigation',
  ariaOpenMenu: 'Menü öffnen',
  ariaCloseMenu: 'Menü schließen',

  heroCta: 'Routen und Preise ansehen',

  routesEyebrow: 'Unsere Route durch Varadero',
  routesTitle: 'Jeder Halt ein neues Erlebnis',
  routesIntro:
    'Die Preise variieren je nach Wohngegend: Die erste Zahl ist der Tarif näher am Zentrum von Varadero, die zweite der weiter entfernte. Alles in USD oder EUR.',

  carsEyebrow: 'Unsere Flotte',
  carsTitle: 'Verfügbare Autos',
  carsIntro:
    'Wählen Sie Ihren Favoriten und erleben Sie Varadero in Ihrem eigenen Tempo. Alle mit privatem Fahrer, Klimaanlage und dem Charme eines gepflegten Oldtimers.',
  carBookBtn: 'Dieses Auto buchen',
  carWaMessage: 'Hallo! Ich möchte das Auto „{name}" bei Varadero Taxi Tour buchen.',

  commentsEyebrow: 'Bewertungen',
  commentsTitle: 'Das sagen unsere Fahrgäste',
  whatsappFloatAria: 'Per WhatsApp buchen',

  ariaViewPhotosOne: '1 Foto von {title} ansehen',
  ariaViewPhotosMany: '{count} Fotos von {title} ansehen',
  ariaOpenPhoto: 'Foto {index} von {title} öffnen',

  cLoading: 'Kommentare werden geladen…',
  cEmpty: 'Schreiben Sie als Erster einen Kommentar.',
  cCarouselRole: 'Karussell',
  cCarouselLabel: 'Bewertungen der Fahrgäste',
  cUnavailable: 'Kommentare sind derzeit nicht verfügbar.',
  cNameLength: 'Bitte geben Sie Ihren Namen ein (2 bis 60 Zeichen).',
  cMessageLength: 'Bitte schreiben Sie einen Kommentar (2 bis 1000 Zeichen).',
  cSendError: 'Der Kommentar konnte nicht gesendet werden. Bitte versuchen Sie es erneut.',
  cThanks: 'Danke! Ihr Kommentar wird nach unserer Prüfung veröffentlicht.',
  cFormTitle: 'Hinterlassen Sie einen Kommentar',
  cNameLabel: 'Name',
  cNamePlaceholder: 'Ihr Name',
  cMessageLabel: 'Nachricht',
  cMessagePlaceholder: 'Erzählen Sie uns von Ihrem Erlebnis…',
  cSending: 'Wird gesendet…',
  cSubmit: 'Kommentar senden',

  lbPhotosOfTitle: 'Fotos von {title}',
  lbGallery: 'Fotogalerie',
  lbClose: 'Schließen',
  lbPrevPhoto: 'Vorheriges Foto',
  lbNextPhoto: 'Nächstes Foto',
};

const it: UiStrings = {
  navRoutes: 'Rotte & prezzi',
  navCars: 'Auto',
  navAbout: 'Chi siamo',
  navContact: 'Contatti',

  ariaMainNav: 'Navigazione principale',
  ariaMobileNav: 'Navigazione mobile',
  ariaOpenMenu: 'Apri menu',
  ariaCloseMenu: 'Chiudi menu',

  heroCta: 'Vedi rotte e prezzi',

  routesEyebrow: 'Il nostro giro di Varadero',
  routesTitle: "Ogni fermata, un'esperienza diversa",
  routesIntro:
    'I prezzi variano in base alla zona dove alloggi: il primo numero è la tariffa più vicina al centro di Varadero e il secondo quella più lontana. Tutto in USD o EUR.',

  carsEyebrow: 'La nostra flotta',
  carsTitle: 'Auto disponibili',
  carsIntro:
    'Scegli la tua preferita e vivi Varadero con i tuoi ritmi. Tutte con autista privato, aria condizionata e il fascino di una classica ben curata.',
  carBookBtn: 'Prenota questa auto',
  carWaMessage: 'Ciao! Vorrei prenotare l\'auto "{name}" con Varadero Taxi Tour.',

  commentsEyebrow: 'Recensioni',
  commentsTitle: 'Cosa dicono i nostri passeggeri',
  whatsappFloatAria: 'Prenota via WhatsApp',

  ariaViewPhotosOne: 'Vedi 1 foto di {title}',
  ariaViewPhotosMany: 'Vedi {count} foto di {title}',
  ariaOpenPhoto: 'Apri la foto {index} di {title}',

  cLoading: 'Caricamento dei commenti…',
  cEmpty: 'Lascia tu per primo un commento.',
  cCarouselRole: 'carosello',
  cCarouselLabel: 'Recensioni dei passeggeri',
  cUnavailable: 'I commenti non sono disponibili al momento.',
  cNameLength: 'Scrivi il tuo nome (tra 2 e 60 caratteri).',
  cMessageLength: 'Scrivi un commento (tra 2 e 1000 caratteri).',
  cSendError: 'Impossibile inviare il commento. Riprova.',
  cThanks: 'Grazie! Il tuo commento sarà pubblicato dopo la nostra revisione.',
  cFormTitle: 'Lascia un commento',
  cNameLabel: 'Nome',
  cNamePlaceholder: 'Il tuo nome',
  cMessageLabel: 'Messaggio',
  cMessagePlaceholder: 'Raccontaci la tua esperienza…',
  cSending: 'Invio…',
  cSubmit: 'Invia commento',

  lbPhotosOfTitle: 'Foto di {title}',
  lbGallery: 'Galleria di foto',
  lbClose: 'Chiudi',
  lbPrevPhoto: 'Foto precedente',
  lbNextPhoto: 'Foto successiva',
};

const ru: UiStrings = {
  navRoutes: 'Маршруты и цены',
  navCars: 'Автомобили',
  navAbout: 'О нас',
  navContact: 'Контакты',

  ariaMainNav: 'Основная навигация',
  ariaMobileNav: 'Мобильная навигация',
  ariaOpenMenu: 'Открыть меню',
  ariaCloseMenu: 'Закрыть меню',

  heroCta: 'Смотреть маршруты и цены',

  routesEyebrow: 'Наш маршрут по Варадеро',
  routesTitle: 'Каждая остановка — новое впечатление',
  routesIntro:
    'Цены зависят от района проживания: первая цифра — тариф ближе к центру Варадеро, вторая — дальше от него. Всё в USD или EUR.',

  carsEyebrow: 'Наш автопарк',
  carsTitle: 'Доступные автомобили',
  carsIntro:
    'Выберите свой любимый и наслаждайтесь Варадеро в своём ритме. Все автомобили — с личным водителем, кондиционером и шармом ухоженной классики.',
  carBookBtn: 'Забронировать этот автомобиль',
  carWaMessage:
    'Здравствуйте! Я хотел(а) бы забронировать автомобиль «{name}» с Varadero Taxi Tour.',

  commentsEyebrow: 'Отзывы',
  commentsTitle: 'Что говорят наши пассажиры',
  whatsappFloatAria: 'Забронировать через WhatsApp',

  ariaViewPhotosOne: 'Посмотреть 1 фото маршрута «{title}»',
  ariaViewPhotosMany: 'Посмотреть {count} фото маршрута «{title}»',
  ariaOpenPhoto: 'Открыть фото {index} из {title}',

  cLoading: 'Загрузка отзывов…',
  cEmpty: 'Станьте первым, кто оставит отзыв.',
  cCarouselRole: 'карусель',
  cCarouselLabel: 'Отзывы пассажиров',
  cUnavailable: 'Отзывы сейчас недоступны.',
  cNameLength: 'Введите имя (от 2 до 60 символов).',
  cMessageLength: 'Напишите отзыв (от 2 до 1000 символов).',
  cSendError: 'Не удалось отправить отзыв. Попробуйте ещё раз.',
  cThanks: 'Спасибо! Ваш отзыв будет опубликован после проверки.',
  cFormTitle: 'Оставьте отзыв',
  cNameLabel: 'Имя',
  cNamePlaceholder: 'Ваше имя',
  cMessageLabel: 'Сообщение',
  cMessagePlaceholder: 'Расскажите о ваших впечатлениях…',
  cSending: 'Отправка…',
  cSubmit: 'Отправить отзыв',

  lbPhotosOfTitle: 'Фото: {title}',
  lbGallery: 'Фотогалерея',
  lbClose: 'Закрыть',
  lbPrevPhoto: 'Предыдущее фото',
  lbNextPhoto: 'Следующее фото',
};

export const ui: Record<Locale, UiStrings> = { es, en, fr, de, it, ru };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getUi(locale: Locale): UiStrings {
  return ui[locale] ?? ui[defaultLocale];
}

export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`
  );
}

export function localeHref(pathname: string, target: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  let rest = segments;
  if (segments.length > 0 && isLocale(segments[0])) {
    rest = segments.slice(1);
  }
  if (target === defaultLocale) {
    return rest.length > 0 ? `/${rest.join('/')}/` : '/';
  }
  return `/${target}/${rest.length > 0 ? `${rest.join('/')}/` : ''}`;
}

export function pathnameLocale(pathname: string): Locale {
  const first = pathname.split('/').filter(Boolean)[0];
  return first && isLocale(first) ? first : defaultLocale;
}
