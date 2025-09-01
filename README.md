# Econix Roles Starter

Агрегатор IT-ролей и зарплат. Основной стек — React + TypeScript + Vite.

## Структура
- `data/roles.json` — роли
- `data/salaries.json` — зарплаты по регионам
- `src/core/schemas.ts` — Zod-схемы и типы
- Компоненты UI: `src/components/*`
- Tauri-конфиг для desktop: `src-tauri/`

## Установка и запуск
```bash
pnpm i        # или npm i / yarn
pnpm dev      # веб-версия http://localhost:5173
pnpm build    # сборка web в dist/
pnpm tauri:dev   # desktop (требуется Rust и tauri-cli)
pnpm tauri:build # desktop сборка в src-tauri/target
pnpm test     # vitest
pnpm etl:fx   # курсы валют ECB → data/tmp/fx.json
pnpm etl:bls  # BLS OEWS таблица 1 → tmp/bls.json
pnpm etl:ons  # ONS ASHE table14 → tmp/ons.json
pnpm etl:eurostat # Eurostat earn_gr_isco → tmp/eurostat.json
pnpm etl:merge # объединение и нормализация
pnpm etl:db   # сборка econix.db и копирование в public/data/
pnpm etl:all  # выполнить все шаги выше
```

## Package manager
- По умолчанию: pnpm@9.7.0 (Node 22 + Corepack)
- При блокировках прокси используйте npm:
  npm i --no-audit --fund=false && npm run dev
CI автоматически падает на npm, если pnpm недоступен. Не запускайте `npm install --package-lock-only` — он требует доступ к registry и часто блокируется корпоративным прокси.

После `npm run etl:all` снапшот `data/econix.db` копируется в `public/data/`. Страница `/compare` покажет столбцы `—`, если файл отсутствует.

## Sources
- [BLS OEWS 2024 Table 1](https://www.bls.gov/news.release/ocwage.t01.htm)
- [ONS ASHE 2024 Table 14](https://www.ons.gov.uk/)
- [Eurostat earn_gr_isco / SES](https://ec.europa.eu/eurostat/)
- [ECB eurofxref](https://www.ecb.europa.eu/stats/eurofxref/)

Данные используются согласно публичным лицензиям соответствующих источников.

## Deployment
После пуша в `main` сайт автоматически публикуется на [GitHub Pages](https://rixed318.github.io/econix-roles-starter/). Vite использует базовый путь `/econix-roles-starter/`.

## Дорожная карта
- Состояние/валидация: Zustand + Zod
- UI: React + Tailwind, фокус на доступности
- Desktop: Tauri (офлайн-кэш и ETL позже)
- Mobile: Flutter-клиент поверх тех же снапшотов

## Дальше
- Реестр источников (официальные/частные) и бейджи «verified/official/community»
- Нормировка зарплат по странам и перцентили
- Кнопки ссылки на источник рядом с каждым числом
- ETL-пакет `@core/etl` для обновления JSON/SQLite
