CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,

    supplier_id INTEGER,

    CONSTRAINT fk_supplier
        FOREIGN KEY (supplier_id)
        REFERENCES suppliers(supplier_id)
        ON DELETE SET NULL
);

-- Version 2: Add a Category column to the Products table.

ALTER TABLE products ADD column Category VARCHAR(30)

-- Version 3 : RemoveCategory

ALTER TABLE products DROP COLUMN Category