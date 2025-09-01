# Econix Roles Starter (Vite + React + TS)

Демо-проект, полученный из твоего HTML. Содержит:
- `data/roles.json` — роли (title/subtitle/sections/category)
- `data/salaries.json` — зарплаты по регионам (USA/EU/Russia/China)
- `data/sources.md` — черновик списка источников из HTML
- Минимальный UI (`src/ui/App.tsx`) с поиском, переключением регионов и карточками

## Запуск локально
```bash
pnpm i   # или npm i / yarn
pnpm dev # http://localhost:5173
```

## Что дальше (короткий план)
1. Вынести схемы в `@core/schemas` (Zod), сделать валидацию на старте.
2. Добавить состояния/фильтры: направления (FE/BE/Data/Sec/ML/DevOps), уровни и т.п.
3. Подготовить ETL-скрипты (Node/Python) для загрузки официальных источников и выгрузки в `data/*.json` или SQLite.
4. Подключить Tauri (Rust) для офлайн-кеша и фоновых обновлений.
5. Сборки: Web (Vite), Desktop (Tauri), позже Mobile (Flutter) с теми же JSON/SQLite снапшотами.
