const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const port = process.env.port || 3000;

app.use(express.json());
app.use(cors());

app.listen(port, (err) => [console.log(`Server is running on : ${port}`)]);

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "newproductmaster",
  port: 3306,
});

pool.getConnection((err, Connection) => {
  if (err) throw err;
  console.log("Connected to Database Successfully!");
  Connection.release();
});

app.get("/products", (req, res) => {
  const sql = "SELECT * FROM product";
  pool.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.post("/products", (req, res) => {
  const sql = "INSERT INTO product(`name`,`category`,`brand`) VALUES (?)";
  const values = [req.body.name, req.body.category, req.body.brand];
  pool.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.patch("/products/:productid", (req, res) => {
  const prodId = Number(req.params.productid);
  const sql =
    "UPDATE product SET `name`=?,`category`=?,`brand`=? WHERE productid=?";
  pool.query(
    sql,
    [req.body.name, req.body.category, req.body.brand, prodId],
    (err, result) => {
      if (err) return res.json(err);
      return res.json(result);
    },
  );
});

app.delete("/products/:productid", (req, res) => {
  const prodId = Number(req.params.productid);
  const sql = "DELETE FROM product WHERE productid=?";
  pool.query(sql, prodId, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

