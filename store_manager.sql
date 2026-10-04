-- PostgreSQL version: this project uses the `pg` driver.
--Q14): create a role named `store_manager` with no login, and grant it access to the public schema.

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_roles
        WHERE rolname = 'store_manager'
    ) THEN
        CREATE ROLE store_manager NOLOGIN;
    END IF;
END
$$;

-- Permit access to existing tables and SERIAL-backed sequences in public.
GRANT USAGE ON SCHEMA public TO store_manager;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO store_manager;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO store_manager;

-- Apply the same permissions to tables and sequences created later by the
-- role that runs this ALTER DEFAULT PRIVILEGES statement.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE ON TABLES TO store_manager;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO store_manager;





--Q15): remove UPDATE from existing and future tables.
REVOKE UPDATE ON ALL TABLES IN SCHEMA public FROM store_manager;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    REVOKE UPDATE ON TABLES FROM store_manager;


--Q16): allow DELETE only on the Sales table (named `sales` in
-- PostgreSQL because the table was created without quoted capitalization).
REVOKE DELETE ON ALL TABLES IN SCHEMA public FROM store_manager;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    REVOKE DELETE ON TABLES FROM store_manager;
GRANT DELETE ON TABLE sales TO store_manager;

-- Enable login only when ready, then set the password interactively with psql:
--   ALTER ROLE store_manager LOGIN;
--   \password store_manager
