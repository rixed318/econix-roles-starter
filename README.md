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
pnpm tauri dev   # desktop (требуется Rust и tauri-cli)
pnpm tauri build # desktop сборка в src-tauri/target
pnpm test     # vitest
```

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
