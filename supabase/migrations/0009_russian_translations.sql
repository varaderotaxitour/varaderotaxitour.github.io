-- ============================================================
-- Varadero Taxi Tour — i18n: agregar ruso (ru)
-- Fusiona la clave "ru" en la columna translations existente
-- de settings, routes y cars sin tocar en/fr/de/it.
-- ============================================================

-- ---------- Seed: settings (id = 1) ----------
update public.settings
set translations = coalesce(translations, '{}'::jsonb) || $${"ru": {
    "seo_title": "Varadero Taxi Tour — Частное такси, трансферы и экскурсии в Варадеро",
    "seo_description": "Частное такси в Варадеро, Куба. Трансферы из аэропорта, экскурсии в Гавану и индивидуальные поездки по полуострову на винтажных кабриолетах.",
    "whatsapp_message": "Здравствуйте! Хотел(а) бы забронировать трансфер или экскурсию с Varadero Taxi Tour.",
    "hero_eyebrow": "Частное такси · Варадеро, Куба",
    "hero_title": "Ваше кубинское приключение начинается в винтажном кабриолете.",
    "hero_lead": "Комфортные и безопасные трансферы из аэропорта, поездки в Гавану и лучшие индивидуальные экскурсии по полуострову и его окрестностям. Мы не просто довозим вас до места: мы показываем секреты острова.",
    "hero_note": "100% индивидуальный сервис · Быстрый ответ в WhatsApp",
    "about_quote": "Мы не просто довозим вас до места — мы показываем секреты острова.",
    "about_text": "Нужно такси для экскурсии в Гавану? Трансфер из аэропорта? Или, может быть, поездка по самым волшебным уголкам полуострова? Мы берём всё на себя, чтобы вы наслаждались сервисом, созданным специально для вас.",
    "trust_items": [
      {"icon": "clock", "title": "Пунктуальность", "text": "Бронируйте заранее и забудьте об ожидании."},
      {"icon": "car", "title": "Безупречные автомобили", "text": "Наслаждайтесь поездкой под открытым небом в наших винтажных кабриолетах."},
      {"icon": "check", "title": "Прозрачные цены", "text": "Справедливые цены, без сюрпризов и скрытых сборов."}
    ],
    "cta_eyebrow": "Готовы к уникальному впечатлению",
    "cta_title": "Свяжитесь с нами, бронируйте и отдыхайте: ваше кубинское приключение начинается здесь.",
    "cta_lead": "Бронируйте сейчас и обеспечьте себе трансферы и поездки в Варадеро по лучшей цене и с максимальным комфортом.",
    "footer_tagline": "Частное такси и экскурсии в Варадеро, Куба.",
    "footer_copyright": "Varadero Taxi Tour. Сделано с любовью на полуострове."
  }
}$$::jsonb
where id = 1;

-- ---------- Seed: rutas ----------
update public.routes set translations = coalesce(translations, '{}'::jsonb) || $${"ru": {"title": "Трансфер Аэропорт Варадеро", "description": "Мы встретим вас или отвезём в аэропорт точно в срок — без ожиданий и сюрпризов."}}$$::jsonb
where id = 1;

update public.routes set translations = coalesce(translations, '{}'::jsonb) || $${"ru": {"title": "Пещеры Сатурно + снорклинг или дайвинг", "description": "Купание в сеноте пещер Сатурно и снорклинг или дайвинг в водах Плая-Корал."}}$$::jsonb
where id = 2;

update public.routes set translations = coalesce(translations, '{}'::jsonb) || $${"ru": {"title": "Экскурсия в Матансас", "description": "Пещеры Бельямар, исторический центр, Бульвар, Фармацевтический музей, театр Сауто, музей Пожарных и парк Либертад."}}$$::jsonb
where id = 3;

update public.routes set translations = coalesce(translations, '{}'::jsonb) || $${"ru": {"title": "Экскурсия в Гавану", "description": "Площадь Революции, прогулка по Малекону, тур по Старой Гаване, табачная фабрика и посещение Эль-Морро-Кабанья."}}$$::jsonb
where id = 4;

update public.routes set translations = coalesce(translations, '{}'::jsonb) || $${"ru": {"title": "Экскурсия по Варадеро", "description": "Дом Дюпон и гольф-клуб, Пеньон-дель-Фрайле, Бульвар, бар «Битлз», парк Хосоне, бар «Флоридита», пивоварня, смотровая площадка улицы 30 и ярмарка ремёсел."}}$$::jsonb
where id = 5;

update public.routes set translations = coalesce(translations, '{}'::jsonb) || $${"ru": {"title": "Дельфинарий", "description": "Посещение с включённым ожиданием: шоу дельфинов, фотографии и катание на верблюдах."}}$$::jsonb
where id = 6;

update public.routes set translations = coalesce(translations, '{}'::jsonb) || $${"ru": {"title": "Бульвар Марина", "description": "Прогулка и пребывание от 1 до 3 часов: боулинг, бильярд, магазины и рестораны."}}$$::jsonb
where id = 7;

update public.routes set translations = coalesce(translations, '{}'::jsonb) || $${"ru": {"title": "Бары и рестораны", "description": "Мы посоветуем вам лучшие места, с пребыванием 2–3 часа и включённым ожиданием."}}$$::jsonb
where id = 8;

-- ---------- Seed: carros ----------
update public.cars set translations = coalesce(translations, '{}'::jsonb) || $${"ru": {"name": "Chevrolet Impala 1958 кабриолет", "description": "Безупречная классика для прогулок вдоль побережья. Откидной верх, салон из натуральной кожи.", "details": "4 чел. · Кабриолет · Кондиционер · 1958"}}$$::jsonb
where id = 2;
