# Safebase

A self-hosted database backup manager for MySQL and PostgreSQL.

## What it does

- Register database connections
- Trigger manual backups
- Schedule automatic backups (CRON)
- Restore from any backup
- Upload and download backup files
- Send backups to remote SSH servers
- View action logs

## Stack

- **Frontend** — Angular 17 (served via nginx)
- **Backend** — Node.js + Express
- **Databases** — MySQL 8 + PostgreSQL 16
- **Scheduler** — node-cron
- **Containers** — Docker + Docker Compose

## Getting started

**Requirements:** Docker + Docker Compose

```bash
git clone https://github.com/yumetia/safebase
cd safebase
cp ~/.ssh/id_rsa ./keys/id_rsa   # optional — only needed for SSH destinations
docker compose up --build
```

Frontend → http://localhost:4200  
API → http://localhost:3000

## SSH destinations

Safebase can send backups to remote servers via SCP after creating them locally.

1. Copy your private key into the `keys/` folder:
   ```bash
   cp ~/.ssh/id_rsa ./keys/id_rsa
   ```
2. On the remote server, make sure your public key is in `~/.ssh/authorized_keys`
3. In the app, go to **Destinations** and register the remote machine
4. When triggering a backup, select the destination from the dropdown

The `keys/` folder is mounted read-only into the API container at `/app/keys/`.  
Enter `/app/keys/id_rsa` as the private key path in the form.

> `keys/` is git-ignored — never commit private keys.

## API routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| GET | /api/databases | List connections |
| POST | /api/databases | Register a connection |
| DELETE | /api/databases/:id | Remove a connection |
| GET | /api/backups | List backups |
| POST | /api/backups | Trigger a backup |
| POST | /api/backups/restore/:id | Restore a backup |
| GET | /api/backups/download/:id | Download a backup file |
| POST | /api/backups/upload | Upload a backup file |
| GET | /api/schedules | List schedules |
| POST | /api/schedules | Create a schedule |
| DELETE | /api/schedules/:id | Delete a schedule |
| GET | /api/logs | List logs |
| GET | /api/destinations | List SSH destinations |
| POST | /api/destinations | Register a destination |
| DELETE | /api/destinations/:id | Remove a destination |

## .gitignore

Make sure your `.gitignore` includes:


## Known limitations

- Database passwords are stored unencrypted — add encryption before production use
- Full dumps only — incremental backups not supported
- Databases must be reachable from the Docker network

## Future improvements

- Incremental backups via MySQL binlog
- Remote storage (S3 / Cloudflare R2)
- Email alerts on backup failure