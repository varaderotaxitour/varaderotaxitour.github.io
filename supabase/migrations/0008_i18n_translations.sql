-- ============================================================
-- Varadero Taxi Tour — i18n (ES raíz + EN/FR/DE/IT)
-- Columna translations jsonb en settings, routes y cars.
-- Estructura: {"en": {...}, "fr": {...}, "de": {...}, "it": {...}}
-- El español se mantiene en las columnas originales.
-- Incluye seed inicial de traducciones del contenido actual.
-- ============================================================

alter table public.settings
  add column if not exists translations jsonb not null default '{}'::jsonb;

alter table public.routes
  add column if not exists translations jsonb not null default '{}'::jsonb;

alter table public.cars
  add column if not exists translations jsonb not null default '{}'::jsonb;

-- ---------- Seed: settings (id = 1) ----------
update public.settings
set translations = $${"en": {
    "seo_title": "Varadero Taxi Tour — Private taxi, transfers and excursions in Varadero",
    "seo_description": "Private taxi service in Varadero, Cuba. Airport transfers, excursions to Havana and personalized tours of the peninsula in vintage convertibles.",
    "whatsapp_message": "Hello! I would like to book a transfer or excursion with Varadero Taxi Tour.",
    "hero_eyebrow": "Private taxi · Varadero, Cuba",
    "hero_title": "Your Cuban adventure begins in a vintage convertible.",
    "hero_lead": "Comfortable and safe transfers from the airport, trips to Havana and the best personalized excursions around the peninsula and its surroundings. We do not just take you to your destination: we show you the secrets of the island.",
    "hero_note": "100% personalized service · Quick response on WhatsApp",
    "about_quote": "We do not just take you to your destination, we show you the secrets of the island.",
    "about_text": "Do you need a taxi for an excursion to Havana? A transfer from the airport? Or perhaps a tour of the most magical corners of the peninsula? We take care of everything, so you can enjoy a service tailored just for you.",
    "trust_items": [
      {"icon": "clock", "title": "Punctuality", "text": "Book in advance and forget about waiting."},
      {"icon": "car", "title": "Immaculate cars", "text": "Enjoy the open-air experience in our vintage convertibles."},
      {"icon": "check", "title": "Clear fares", "text": "Fair prices, no surprises or hidden charges."}
    ],
    "cta_eyebrow": "Ready for a unique experience",
    "cta_title": "Get in touch, book and relax: your Cuban adventure starts here.",
    "cta_lead": "Book now and secure your transfers and tours in Varadero at the best price and with maximum comfort.",
    "footer_tagline": "Private taxi and excursions in Varadero, Cuba.",
    "footer_copyright": "Varadero Taxi Tour. Made with love on the peninsula."
  },
  "fr": {
    "seo_title": "Varadero Taxi Tour — Taxi privé, transferts et excursions à Varadero",
    "seo_description": "Service de taxi privé à Varadero, Cuba. Transferts depuis l'aéroport, excursions à La Havane et promenades personnalisées sur la péninsule en décapotables d'époque.",
    "whatsapp_message": "Bonjour ! Je souhaite réserver un transfert ou une excursion avec Varadero Taxi Tour.",
    "hero_eyebrow": "Taxi privé · Varadero, Cuba",
    "hero_title": "Votre aventure cubaine commence dans une décapotable d'époque.",
    "hero_lead": "Des transferts confortables et sûrs depuis l'aéroport, des voyages à La Havane et les meilleures excursions personnalisées sur la péninsule et ses environs. Nous ne nous contentons pas de vous conduire à destination : nous vous montrons les secrets de l'île.",
    "hero_note": "Service 100 % personnalisé · Réponse rapide par WhatsApp",
    "about_quote": "Nous ne nous contentons pas de vous conduire à destination, nous vous montrons les secrets de l'île.",
    "about_text": "Besoin d'un taxi pour une excursion à La Havane ? Un transfert depuis l'aéroport ? Ou peut-être une balade dans les recoins les plus magiques de la péninsule ? Nous nous occupons de tout, pour que vous profitiez d'un service pensé sur mesure.",
    "trust_items": [
      {"icon": "clock", "title": "Ponctualité", "text": "Réservez à l'avance et oubliez l'attente."},
      {"icon": "car", "title": "Voitures impeccables", "text": "Vivez l'expérience en plein air dans nos décapotables d'époque."},
      {"icon": "check", "title": "Tarifs clairs", "text": "Des prix justes, sans surprises ni frais cachés."}
    ],
    "cta_eyebrow": "Prêt pour une expérience unique",
    "cta_title": "Contactez-nous, réservez et détendez-vous : votre aventure cubaine commence ici.",
    "cta_lead": "Réservez dès maintenant et assurez vos transferts et vos promenades à Varadero au meilleur prix et avec un maximum de confort.",
    "footer_tagline": "Taxi privé et excursions à Varadero, Cuba.",
    "footer_copyright": "Varadero Taxi Tour. Fait avec amour sur la péninsule."
  },
  "de": {
    "seo_title": "Varadero Taxi Tour — Privattaxi, Transfers und Ausflüge in Varadero",
    "seo_description": "Privater Taxiservice in Varadero, Kuba. Flughafentransfers, Ausflüge nach Havanna und individuelle Fahrten über die Halbinsel in Oldtimer-Cabrios.",
    "whatsapp_message": "Hallo! Ich möchte einen Transfer oder einen Ausflug mit Varadero Taxi Tour buchen.",
    "hero_eyebrow": "Privattaxi · Varadero, Kuba",
    "hero_title": "Ihr kubanisches Abenteuer beginnt in einem Oldtimer-Cabrio.",
    "hero_lead": "Komfortable und sichere Transfers vom Flughafen, Fahrten nach Havanna und die besten individuellen Ausflüge über die Halbinsel und Umgebung. Wir bringen Sie nicht nur ans Ziel: Wir zeigen Ihnen die Geheimnisse der Insel.",
    "hero_note": "100 % persönlicher Service · Schnelle Antwort per WhatsApp",
    "about_quote": "Wir bringen Sie nicht nur ans Ziel, wir zeigen Ihnen die Geheimnisse der Insel.",
    "about_text": "Benötigen Sie ein Taxi für einen Ausflug nach Havanna? Einen Transfer vom Flughafen? Oder vielleicht eine Fahrt zu den zauberhaftesten Ecken der Halbinsel? Wir kümmern uns um alles, damit Sie einen maßgeschneiderten Service genießen können.",
    "trust_items": [
      {"icon": "clock", "title": "Pünktlichkeit", "text": "Buchen Sie im Voraus und vergessen Sie das Warten."},
      {"icon": "car", "title": "Makellose Autos", "text": "Erleben Sie das Freiluft-Erlebnis in unseren Oldtimer-Cabrios."},
      {"icon": "check", "title": "Klare Preise", "text": "Faire Preise, ohne Überraschungen oder versteckte Kosten."}
    ],
    "cta_eyebrow": "Bereit für ein einzigartiges Erlebnis",
    "cta_title": "Kontaktieren Sie uns, buchen und entspannen Sie sich: Ihr kubanisches Abenteuer beginnt hier.",
    "cta_lead": "Buchen Sie jetzt und sichern Sie sich Ihre Transfers und Fahrten in Varadero zum besten Preis und mit maximalem Komfort.",
    "footer_tagline": "Privattaxi und Ausflüge in Varadero, Kuba.",
    "footer_copyright": "Varadero Taxi Tour. Mit Liebe auf der Halbinsel gemacht."
  },
  "it": {
    "seo_title": "Varadero Taxi Tour — Taxi privato, transfer ed escursioni a Varadero",
    "seo_description": "Servizio di taxi privato a Varadero, Cuba. Transfer dall'aeroporto, escursioni all'Avana e giri personalizzati per la penisola su cabrio d'epoca.",
    "whatsapp_message": "Ciao! Vorrei prenotare un transfer o un'escursione con Varadero Taxi Tour.",
    "hero_eyebrow": "Taxi privato · Varadero, Cuba",
    "hero_title": "La tua avventura cubana inizia su una cabrio d'epoca.",
    "hero_lead": "Transfer comodi e sicuri dall'aeroporto, viaggi all'Avana e le migliori escursioni personalizzate per la penisola e i suoi dintorni. Non ti portiamo solo a destinazione: ti mostriamo i segreti dell'isola.",
    "hero_note": "Servizio 100% personalizzato · Risposta rapida su WhatsApp",
    "about_quote": "Non ti portiamo solo a destinazione, ti mostriamo i segreti dell'isola.",
    "about_text": "Hai bisogno di un taxi per un'escursione all'Avana? Un transfer dall'aeroporto? Oppure un giro tra gli angoli più suggestivi della penisola? Pensiamo noi a tutto, così potrai goderti un servizio pensato su misura.",
    "trust_items": [
      {"icon": "clock", "title": "Puntualità", "text": "Prenota in anticipo e dimentica l'attesa."},
      {"icon": "car", "title": "Auto impeccabili", "text": "Vivi l'esperienza all'aria aperta sulle nostre cabrio d'epoca."},
      {"icon": "check", "title": "Tariffe chiare", "text": "Prezzi giusti, senza sorprese né costi nascosti."}
    ],
    "cta_eyebrow": "Pronto per un'esperienza unica",
    "cta_title": "Contattaci, prenota e rilassati: la tua avventura cubana inizia qui.",
    "cta_lead": "Prenota ora e assicurati i transfer e i giri a Varadero al miglior prezzo e con il massimo comfort.",
    "footer_tagline": "Taxi privato ed escursioni a Varadero, Cuba.",
    "footer_copyright": "Varadero Taxi Tour. Fatto con affetto nella penisola."
  }
}$$::jsonb
where id = 1;

-- ---------- Seed: rutas ----------
update public.routes set translations = $${"en": {"title": "Varadero Airport Transfer", "description": "We pick you up or take you to the airport with guaranteed punctuality, no waits or surprises."}, "fr": {"title": "Transfert Aéroport Varadero", "description": "Nous venons vous chercher ou vous emmenons à l'aéroport avec ponctualité garantie, sans attente ni surprises."}, "de": {"title": "Flughafentransfer Varadero", "description": "Wir holen Sie ab oder bringen Sie zum Flughafen – pünktlich und garantiert ohne Wartezeiten oder Überraschungen."}, "it": {"title": "Transfer Aeroporto di Varadero", "description": "Ti veniamo a prendere o ti portiamo all'aeroporto con puntualità garantita, senza attese né sorprese."}}$$::jsonb
where id = 1;

update public.routes set translations = $${"en": {"title": "Saturno Caves + Snorkeling or Diving", "description": "A dip in the Saturno Caves cenote and snorkeling or diving in the waters of Playa Coral."}, "fr": {"title": "Grottes de Saturno + Snorkeling ou Plongée", "description": "Un plongeon dans le cenote des Grottes de Saturno et snorkeling ou plongée dans les eaux de Playa Coral."}, "de": {"title": "Saturno-Höhlen + Schnorcheln oder Tauchen", "description": "Ein Sprung in die Cenote der Saturno-Höhlen und Schnorcheln oder Tauchen im Wasser von Playa Coral."}, "it": {"title": "Grotte di Saturno + Snorkeling o Immersioni", "description": "Un tuffo nel cenote delle Grotte di Saturno e snorkeling o immersioni nelle acque di Playa Coral."}}$$::jsonb
where id = 2;

update public.routes set translations = $${"en": {"title": "Matanzas Excursion", "description": "Bellamar Caves, historic center, Boulevard, Pharmaceutical Museum, Sauto Theater, Firefighters Museum and Libertad Park."}, "fr": {"title": "Excursion à Matanzas", "description": "Grottes de Bellamar, centre historique, Bulevar, Musée Pharmaceutique, Théâtre Sauto, Musée des Pompiers et Parque Libertad."}, "de": {"title": "Ausflug nach Matanzas", "description": "Bellamar-Höhlen, historisches Zentrum, Bulevar, Apothekenmuseum, Teatro Sauto, Feuerwehrmuseum und Parque Libertad."}, "it": {"title": "Escursione a Matanzas", "description": "Grotte di Bellamar, centro storico, Bulevar, Museo Farmaceutico, Teatro Sauto, Museo dei Vigili del Fuoco e Parque Libertad."}}$$::jsonb
where id = 3;

update public.routes set translations = $${"en": {"title": "Havana Excursion", "description": "Revolution Square, a stroll along the Malecón, a tour of Old Havana, the Cigar Factory and a visit to El Morro-Cabaña."}, "fr": {"title": "Excursion à La Havane", "description": "Place de la Révolution, promenade sur le Malecón, visite de La Havane Vieille, Fabrique de Tabacs et visite du Morro-Cabaña."}, "de": {"title": "Ausflug nach Havanna", "description": "Plaza de la Revolución, Spaziergang am Malecón, Rundgang durch Alt-Havanna, Tabakfabrik und Besuch von Morro-Cabaña."}, "it": {"title": "Escursione all'Avana", "description": "Piazza della Rivoluzione, passeggiata sul Malecón, tour dell'Avana Vecchia, Fabbrica di Sigari e visita al Morro-Cabaña."}}$$::jsonb
where id = 4;

update public.routes set translations = $${"en": {"title": "Excursion around Varadero", "description": "Dupont House and golf course, Peñón del Fraile, Boulevard, Beatles Bar, Josoné Park, Floridita Bar, brewery, Calle 30 viewpoint and craft fair."}, "fr": {"title": "Excursion dans Varadero", "description": "Casa Dupont et terrain de golf, Peñón del Fraile, Bulevar, Bar Beatles, Parque Josoné, Bar Floridita, brasserie, mirador de la calle 30 et foire artisanale."}, "de": {"title": "Ausflug durch Varadero", "description": "Casa Dupont und Golfplatz, Peñón del Fraile, Bulevar, Bar Beatles, Parque Josoné, Bar Floridita, Brauerei, Aussichtspunkt Calle 30 und Kunsthandwerkermarkt."}, "it": {"title": "Escursione per Varadero", "description": "Casa Dupont e campo da golf, Peñón del Fraile, Bulevar, Bar Beatles, Parque Josoné, Bar Floridita, birreria, belvedere della calle 30 e fiera dell'artigianato."}}$$::jsonb
where id = 5;

update public.routes set translations = $${"en": {"title": "Dolphinarium", "description": "Visit with waiting time included: dolphin show, photos and camel ride."}, "fr": {"title": "Delphinarium", "description": "Visite avec attente incluse : spectacle de dauphins, photos et balade à dos de chameau."}, "de": {"title": "Delfinarium", "description": "Besuch mit inkludierter Wartezeit: Delfinshow, Fotos und Kamelfahrt."}, "it": {"title": "Delfinario", "description": "Visita con attesa inclusa: spettacolo dei delfini, foto e giro in cammello."}}$$::jsonb
where id = 6;

update public.routes set translations = $${"en": {"title": "Marina Boulevard", "description": "Tour and stay of 1 to 3 hours: bowling, billiards, shops and restaurants."}, "fr": {"title": "Bulevar de la Marina", "description": "Parcours et séjour de 1 à 3 heures : bowling, billard, boutiques et restaurants."}, "de": {"title": "Bulevar de la Marina", "description": "Rundgang und Aufenthalt von 1 bis 3 Stunden: Bowling, Billard, Geschäfte und Restaurants."}, "it": {"title": "Bulevar de la Marina", "description": "Giro e sosta da 1 a 3 ore: bowling, biliardo, negozi e ristoranti."}}$$::jsonb
where id = 7;

update public.routes set translations = $${"en": {"title": "Bars and restaurants", "description": "We suggest the best places, with a 2 to 3 hour stay and waiting time included."}, "fr": {"title": "Bars et restaurants", "description": "Nous vous suggérons les meilleurs endroits, avec un séjour de 2 à 3 heures et l'attente incluse."}, "de": {"title": "Bars und Restaurants", "description": "Wir empfehlen Ihnen die besten Orte, mit 2 bis 3 Stunden Aufenthalt und inkludierter Wartezeit."}, "it": {"title": "Bar e ristoranti", "description": "Ti suggeriamo i posti migliori, con una sosta da 2 a 3 ore e attesa inclusa."}}$$::jsonb
where id = 8;

-- ---------- Seed: carros ----------
update public.cars set translations = $${"en": {"name": "Chevrolet Impala 1958 Convertible", "description": "Immaculate classic for rides along the coast. Convertible top, original leather interior.", "details": "4 pax · Convertible · A/C · 1958"}, "fr": {"name": "Chevrolet Impala 1958 Cabriolet", "description": "Classique impeccable pour des balades le long de la côte. Capote décapotable, intérieur en cuir d'origine.", "details": "4 pax · Cabriolet · Clim · 1958"}, "de": {"name": "Chevrolet Impala 1958 Cabrio", "description": "Makelloser Klassiker für Fahrten entlang der Küste. Cabrioverdeck, Original-Lederinnenausstattung.", "details": "4 Pers. · Cabrio · Klimaanlage · 1958"}, "it": {"name": "Chevrolet Impala 1958 Cabrio", "description": "Classico impeccabile per passeggiate lungo la costa. Capote apribile, interni in pelle originale.", "details": "4 pax · Cabrio · A/C · 1958"}}$$::jsonb
where id = 2;
