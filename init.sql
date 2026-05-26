CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TYPE project_type AS ENUM ('personal', 'group');

CREATE TABLE IF NOT EXISTS project (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type project_type NOT NULL,
  deadline TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW()
);

CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

CREATE TABLE IF NOT EXISTS task (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content VARCHAR(255),
  status task_status NOT NULL DEFAULT 'todo',
  priority task_priority NOT NULL DEFAULT 'medium',
  deadline TIMESTAMP NOT NULL,
  projectId BIGINT REFERENCES project(id)
);