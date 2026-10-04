CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,

    product_id INTEGER NOT NULL,

    quantity_sold INTEGER NOT NULL,

    sale_date DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT fk_product
        FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE
);