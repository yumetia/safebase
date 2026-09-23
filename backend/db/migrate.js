const mysql = require('./mysql')
const pg = require('./postgres')

const migrateMysql = async () => {
  await mysql.query(`
    CREATE TABLE IF NOT EXISTS \`database\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type ENUM('mysql', 'postgres') NOT NULL,
      host VARCHAR(255) NOT NULL,
      port INT NOT NULL,
      db_name VARCHAR(255) NOT NULL,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await mysql.query(`
    CREATE TABLE IF NOT EXISTS backup (
      id INT AUTO_INCREMENT PRIMARY KEY,
      database_id INT NOT NULL,
      file_path VARCHAR(255) NOT NULL,
      file_size_kb INT,
      status ENUM('success', 'failed') NOT NULL,
      triggered_by ENUM('manual', 'schedule') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (database_id) REFERENCES \`database\`(id)
    )
  `)

  await mysql.query(`
    CREATE TABLE IF NOT EXISTS schedule (
      id INT AUTO_INCREMENT PRIMARY KEY,
      database_id INT NOT NULL,
      cron_expression VARCHAR(255) NOT NULL,
      is_active BOOLEAN DEFAULT true,
      next_run_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (database_id) REFERENCES \`database\`(id)
    )
  `)

  await mysql.query(`
    CREATE TABLE IF NOT EXISTS log (
      id INT AUTO_INCREMENT PRIMARY KEY,
      backup_id INT NOT NULL,
      action ENUM('backup', 'restore') NOT NULL,
      level ENUM('info', 'warning', 'error') NOT NULL,
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (backup_id) REFERENCES backup(id)
    )
  `)

  console.log('MySQL tables ready')
}

const migratePg = async () => {
  await pg.query(`
    CREATE TABLE IF NOT EXISTS "database" (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      host VARCHAR(255) NOT NULL,
      port INT NOT NULL,
      db_name VARCHAR(255) NOT NULL,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await pg.query(`
    CREATE TABLE IF NOT EXISTS backup (
      id SERIAL PRIMARY KEY,
      database_id INT NOT NULL REFERENCES "database"(id),
      file_path VARCHAR(255) NOT NULL,
      file_size_kb INT,
      status VARCHAR(50) NOT NULL,
      triggered_by VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await pg.query(`
    CREATE TABLE IF NOT EXISTS schedule (
      id SERIAL PRIMARY KEY,
      database_id INT NOT NULL REFERENCES "database"(id),
      cron_expression VARCHAR(255) NOT NULL,
      is_active BOOLEAN DEFAULT true,
      next_run_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await pg.query(`
    CREATE TABLE IF NOT EXISTS log (
      id SERIAL PRIMARY KEY,
      backup_id INT NOT NULL REFERENCES backup(id),
      action VARCHAR(50) NOT NULL,
      level VARCHAR(50) NOT NULL,
      message TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  console.log('PostgreSQL tables ready')
}

const migrate = async () => {
  await migrateMysql()
  await migratePg()
}

module.exports = migrate
