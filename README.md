# Hardware Maintenance Ledger -приложение

Това е web проект за проследяване на записи за поддръжка на хардуер.
Проектиран е така, че да покрива всички изисквания.

## Tech stack

- Backend: Node.js + Express + TypeScript
- Frontend: React + Vite + TypeScript
- Storage: local JSON file with `fs`
- Shared types: one shared `types.ts` file used by both frontend and backend

## Структура на проекта


hardware-maintenance-ledger-junior/
├── backend/
├── frontend/
├── shared/
└── README.md


## Покрити изисквания

- `GET /api/records`
- `POST /api/records`
- `POST /api/export`
- стрикна валидация на backend
- 3 frontend страници
- сортиране на суми и дати
- крайна цена (total cost)
- използваеми `StatusBadge` компоненти
- страница за статистика


## Как да подпалим приложението:

### 1. Стартиране на  backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:3001
```

### 2. Старртиране на frontend

Отваряме нов terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend върви на хост:

```
http://localhost:5173
```



## Създаване на продукти

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## Notes

- Датата на приложението се съхранява в :`backend/src/data/records.json`
- CSV export е запазен `backend/src/data/maintenance_export.csv`
- `maintenanceDate` е запазен в frontend-а в ISO формат

