BEGIN TRANSACTION;

INSERT INTO users (name, email, entries, joined ) VALUES ('test', 'test@gmail.com', 2, '2018-01-01');
INSERT INTO login (hash, email) VALUES ('$2a$10$3JarUrFXEgwTfjr1d.unMeWgrP9QK.3ZMYanNOO1.sxYjfZl45bGq', 'test@gmail.com');

COMMIT;