const dotenv = require('dotenv');
dotenv.config();

const fs = require('node:fs/promises');
const path = require('node:path');

const pg = require('pg');

const express = require('express')
const {use} = require("express/lib/application");
const app = express()
const port = 3000

const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


app.use(express.json());

app.get('/test', async (req, res) => {

    const {id , name}= req.body

    const client = await pool.connect();

    try {
        const { rows } = await pool.query(
            'SELECT 1 + 1 AS result'
        );

        return res.json({
            message: 'Test route is working',
            data: rows
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Database connection failed',
            error: error.message
        });
    }
});



// Get all products
app.get("/products", async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM products');
    return res.status(200).json({message:'done', data: rows });
    } catch (error) {
        res.status(500).json({message:'error', error: error.message})
    }
});

// Get product by ID
app.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('SELECT * FROM products WHERE product_id = $1', [id]);
    return res.status(200).json({ data:rows });
    } catch (error) {
        json({message:'error', error: error.message})
    }
});

// Update product by ID
app.patch ("/products/:id", async (req , res)=>{

    const { id } = req.params;
    const {name , price, stock} = req.body

    try {
        const { rows } = await pool.query(
            'UPDATE products SET product_name = $1, price = $2, stock_quantity = $3 WHERE product_id = $4 RETURNING *',
            [name, price, stock, id]
        );
        return res.status(200).json({ message: 'Product updated', data: rows[0] });
    } catch (error) {
res.status(500).json({ message: 'Error creating product', error: error.message });    }

})

// Delete product by ID
app.delete ("/products/:id", async (req , res)=>{

    const { id } = req.params;
    

    try {
        const { rows } = await pool.query(
            'DELETE FROM products WHERE product_id = $1 RETURNING *',
            [id]
        );
        return res.status(200).json({ message: 'Product deleted', data: rows[0] });
    } catch (error) {
res.status(500).json({ message: 'Error deleting product', error: error.message });    }

})

// Create a new product
app.post ("/products", async (req , res)=>{

    const {name , price, stock} = req.body

    try {
        const { rows } = await pool.query(
            'INSERT INTO products (product_name, price, stock_quantity) VALUES ($1, $2, $3) RETURNING *',
            [name, price, stock]
        );
        return res.status(201).json({ message: 'Product created', data: rows[0] });
    } catch (error) {
res.status(500).json({ message: 'Error creating product', error: error.message });    }

})




// ********************* Suppliers
// Get all suppliers
app.get("/suppliers", async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM suppliers');
    return res.status(200).json({message:'done', data: rows });
    } catch (error) {
        res.status(500).json({message:'error', error: error.message})
    }
});

// Get supplier by ID
app.get("/suppliers/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('SELECT * FROM suppliers WHERE supplier_id = $1', [id]);
    return res.status(200).json({ data:rows });
    } catch (error) {
        json({message:'error', error: error.message})
    }
});

// Update supplier by ID
app.patch ("/suppliers/:id", async (req , res)=>{

    const { id } = req.params;
    const {name , number} = req.body

    try {
        const { rows } = await pool.query(
            'UPDATE suppliers SET supplier_name = $1, contact_number = $2 WHERE supplier_id = $3 RETURNING *',
            [name, number, id]
        );
        return res.status(200).json({ message: 'supplier updated', data: rows[0] });
    } catch (error) {
res.status(500).json({ message: 'Error creating supplier', error: error.message });    }

})

// Delete supplier by ID
app.delete ("/suppliers/:id", async (req , res)=>{

    const { id } = req.params;
    

    try {
        const { rows } = await pool.query(
            'DELETE FROM suppliers WHERE supplier_id = $1 RETURNING *',
            [id]
        );
        return res.status(200).json({ message: 'supplier deleted', data: rows[0] });
    } catch (error) {
res.status(500).json({ message: 'Error deleting supplier', error: error.message });    }

})

// Create a new supplier
app.post ("/suppliers", async (req , res)=>{

    const {name , number} = req.body

    try {
        const { rows } = await pool.query(
            'INSERT INTO suppliers (supplier_name, contact_number) VALUES ($1, $2) RETURNING *',
            [name, number]
        );
        return res.status(201).json({ message: 'supplier created', data: rows[0] });
    } catch (error) {
res.status(500).json({ message: 'Error creating supplier', error: error.message });    }

})




// ***************sales**********


// Get all Sales
app.get("/Sales", async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM Sales');
    return res.status(200).json({message:'done', data: rows });
    } catch (error) {
        res.status(500).json({message:'error', error: error.message})
    }
});

//Retrieve sales for a specific product.
app.get("/Sales/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('SELECT * FROM Sales WHERE product_id = $1', [id]);
    return res.status(200).json({ data:rows });
    } catch (error) {
        json({message:'error', error: error.message})
    }
});

// Create a new Sales
app.post ("/Sales", async (req , res)=>{

    const {product_id ,sold} = req.body

    try {
        const { rows } = await pool.query(
            'INSERT INTO Sales (product_id, quantity_sold) VALUES ($1, $2) RETURNING *',
            [product_id, sold]
        );
        return res.status(201).json({ message: 'Product created', data: rows[0] });
    } catch (error) {
res.status(500).json({ message: 'Error creating product', error: error.message });    }

})




//*************** Add a Category column to the Products table. */


app.post("/products/CreateCategory", async (req , res)=>{

   

    try {
         const query = `ALTER TABLE products ADD column Category VARCHAR(30)`;

         await pool.query(query);
        // const { rows } = await pool.query(query);
        return res.status(201).json({ message: 'Category column added' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding Category column', error: error.message });
    }


})


//*************** Remove the Category column.************/

app.post("/products/RemoveCategory", async (req , res)=>{

   

    try {
         const query = `ALTER TABLE products DROP COLUMN Category`;

         await pool.query(query);
        // const { rows } = await pool.query(query);
        return res.status(201).json({ message: 'Category column removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing Category column', error: error.message });
    }


})

//***********Change ContactNumber to VARCHAR(15). */



app.post("/suppliers/ChangeNumber", async (req , res)=>{
    try {
         const query = `ALTER TABLE suppliers
ALTER COLUMN contact_number TYPE VARCHAR(15) `;

         await pool.query(query);
        // const { rows } = await pool.query(query);
        return res.status(201).json({ message: 'Contact number type changed' });
    } catch (error) {
        res.status(500).json({ message: 'Error changing contact number type', error: error.message });
    }

})


//******************Add a NOT NULL constraint to ProductName.


app.post("/products/SetNotNull", async (req , res)=>{

   

    try {
         const query = `ALTER TABLE products ALTER COLUMN product_name SET NOT NULL`;

         await pool.query(query);
        // const { rows } = await pool.query(query);
        return res.status(201).json({ message: 'Product name constraint set' });
    } catch (error) {
        res.status(500).json({ message: 'Error setting product name constraint', error: error.message });
    }
})


//*************Create an API endpoint or initialization script to insert the following data:( 1.5 Grade)
//***********a. Add a supplier with the name 'FreshFoods' and contact number '01001234567'. */



app.post("/supplier", async (req, res) => {
    const { name, contact } = req.query;

    try {
        const { rows } = await pool.query(
            `INSERT INTO suppliers (supplier_name, contact_number)
             VALUES ($1, $2)
             RETURNING *`,
            [name, contact]
        );

        return res.status(201).json({
            message: "Supplier added successfully",
            data: rows[0]
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error adding supplier",
            error: error.message
        });
    }
});



//************b. Insert the following three products, all provided by 'FreshFoods': */

app.post("/Add_products", async (req, res) => {

    const { name, price, stock, supplier } = req.query;

    try {
        const { rows } = await pool.query(
            `INSERT INTO products
             (product_name, price, stock_quantity, supplier_id)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [name, price, stock, supplier]
        );

        return res.status(201).json({
            message: "Product created successfully",
            data: rows[0]
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error creating product",
            error: error.message
        });
    }
});

//**************c. Add a record for the sale of 2 units of 'Milk' made on '2025-05-20'. */

app.post("/Add_Sales", async (req, res) => {

    const { unit , time , product_id } = req.query;

    try {
        const { rows } = await pool.query(
            `INSERT INTO sales
             (quantity_sold, sale_date, product_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [unit, time, product_id]
        );

        return res.status(201).json({
            message: "Product created successfully",
            data: rows[0]
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error creating product",
            error: error.message
        });
    }
});

//**************7. Create an API endpoint to update the price of 'Bread' to 25.00.  */
app.patch ("/update_product", async (req , res)=>{

    const {name , price} = req.body

    try {
        const { rows } = await pool.query(
            'UPDATE products SET price = $1 WHERE product_name = $2 RETURNING *',
            [price, name]
        );
        return res.status(200).json({ message: 'Product updated', data: rows[0] });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating product', error: error.message });
    }

})

//******************Create an API endpoint to delete the product 'Eggs'. */

app.delete ("/Delete_product", async (req , res)=>{

    const {name} = req.body

    try {
        const { rows } = await pool.query(
            'DELETE FROM products WHERE product_name = $1 RETURNING *',
            [name]
        );
        return res.status(200).json({ message: 'Product deleted', data: rows[0] });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting product', error: error.message });
    }

})

//*****************Create a reporting endpoint to retrieve the total quantity sold for each product using SQL aggregate functions. */


app.get("/reports_products_sales", async (req, res) => {

    try {
        const { rows } = await pool.query(`
            SELECT
                p.product_id,
                p.product_name,
                SUM(s.quantity_sold) AS total_quantity_sold
            FROM products p
            JOIN sales s
                ON p.product_id = s.product_id
            GROUP BY
                p.product_id,
                p.product_name
            ORDER BY
                p.product_id
        `);

        return res.status(200).json({
            message: "Total quantity sold for each product",
            data: rows
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error generating sales report",
            error: error.message
        });
    }
});


//**************Create a reporting endpoint to retrieve the product with the highest stock quantity. */

app.get("/reports_products_highest_stock", async (req, res) => {

    try {
        const { rows } = await pool.query(`
            SELECT
                p.product_id,
                p.product_name,
                price,
                stock_quantity
            FROM products p
            ORDER BY stock_quantity DESC
            limit 1
        `);
           

        return res.status(200).json({
            message: "Total quantity sold for each product",
            data: rows
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error generating sales report",
            error: error.message
        });
    }
});

//*********************Create a reporting endpoint to retrieve suppliers whose names start with 'F'. */

app.get("/reports_suppliers_starting_with_f", async (req, res) => {

    try {
        const { rows } = await pool.query(`
            SELECT
                *
            FROM suppliers s
            where supplier_name like 'F%'
        `);
           

        return res.status(200).json({
            message: "Suppliers whose names start with 'F'",
            data: rows
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error generating sales report",
            error: error.message
        });
    }
});



//*****************Create a reporting endpoint to retrieve all products that have never been sold. */
app.get("/reports_products_never_sold", async (req, res) => {

    try {
        const { rows } = await pool.query(`
            SELECT
                *
            FROM products p
            WHERE Not EXISTS (
                SELECT 1
                FROM sales s
                WHERE s.product_id = p.product_id
            )
            ORDER BY p.product_id;
        `);
           

        return res.status(200).json({
            message: "Products that have never been sold",
            data: rows
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error generating sales report",
            error: error.message
        });
    }
});

//********************13. Create a reporting endpoint to retrieve all sales including
// * Product name
// * Quantity sold
// * Sale date using SQL JOIN operations. 

app.get("/reports_sales_including_details", async (req, res) => {

    try {
        const { rows } = await pool.query(`
            SELECT
                p.product_name,
                s.quantity_sold,
                s.sale_date
            FROM products p
            JOIN sales s ON p.product_id = s.product_id
        `);
           

        return res.status(200).json({
            message: "Sales with product details",
            data: rows
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error generating sales report",
            error: error.message
        });
    }
});

//**************14. Create a SQL script or secure administrative endpoint to create a MySQL user named store_manager and grant the
//****************  following permissions on all tables
// * SELECT
// * INSERT
// * UPDATE 





app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})