CREATE TABLE IF NOT EXISTS users (
  id INT GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  active BOOL NOT NULL DEFAULT FALSE,
  first_name VARCHAR(64),
  last_name VARCHAR(64),
  email VARCHAR(64) NOT NULL,
  phone VARCHAR(32),
  password VARCHAR NOT NULL,
  token VARCHAR NOT NULL,
  token_expiration TIMESTAMP NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS posts (
  id INT GENERATED ALWAYS AS IDENTITY,
  owner_id INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  title VARCHAR(128),
  content VARCHAR,
  PRIMARY KEY(id),
  CONSTRAINT fk_owner
    FOREIGN KEY(owner_id)
      REFERENCES users(id)
      ON DELETE CASCADE
);

-- CREATE TABLE IF NOT EXISTS posts (
--   id INT GENERATED ALWAYS AS IDENTITY,
--   user_id INT NOT NULL,
--   created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
--   title VARCHAR(256),
--   content TEXT,
--   CONSTRAINT fk_user
--     FOREIGN KEY(user_id)
--       REFERENCES users(id)
--       ON DELETE CASCADE
-- );

INSERT INTO users (first_name, last_name, email, phone, password, token, token_expiration)
SELECT 'John', 'Doe', 'john.doe@gmail.com', '555-555-5555', 'test', '123', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users);

INSERT INTO posts (owner_id, title, content)
SELECT 1, 'First Note', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
WHERE NOT EXISTS (SELECT 1 FROM posts);
