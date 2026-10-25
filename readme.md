# Safebase

A self-hosted database backup manager for MySQL and PostgreSQL.

## What it does

- Register database connections
- Trigger manual backups
- Schedule automatic backups (CRON)
- Restore from any backup
- Upload and download backup files
- View action logs

## Stack

- **Frontend** — Angular 17
- **Backend** — Node.js + Express
- **Databases** — MySQL 8 + PostgreSQL 16
- **Scheduler** — node-cron
- **Containers** — Docker + Docker Compose

## Getting started

**Requirements:** Docker + Docker Compose

```bash
git clone https://github.com/yumetia/safebase
cd safebase
docker-compose up --build
```

Frontend → http://localhost:4200
API → http://localhost:3000

## API routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/databases | List all connections |
| POST | /api/databases | Register a connection |
| DELETE | /api/databases/:id | Remove a connection |
| GET | /api/backups | List all backups |
| POST | /api/backups | Trigger a backup |
| POST | /api/backups/restore/:id | Restore a backup |
| GET | /api/backups/download/:id | Download a backup file |
| POST | /api/backups/upload | Upload a backup file |
| GET | /api/schedules | List schedules |
| POST | /api/schedules | Create a schedule |
| DELETE | /api/schedules/:id | Delete a schedule |
| GET | /api/logs | List logs |

## Known limitations

- Passwords are stored unencrypted — add encryption before production use
- No authentication yet — all routes are public
- Incremental backups not supported — full dumps only
- Local tool — databases must be reachable from the Docker network

## Future improvements

- JWT authentication
- Incremental backups via MySQL binlog
- Remote storage (S3 / Cloudflare R2)
- Email alerts on backup failure
