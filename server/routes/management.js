const express = require('express');
const pool = require("../config/db_config");
const router = express.Router();
const bcrypt = require('bcryptjs')

//get a seller

router.get("/sellers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await pool.query("SELECT * FROM seller WHERE id = $1", [
      id
    ]);

    res.json(seller.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
// Get all sellers
router.get('/sellers/', async (req, res) => {
  try {
    const allSellers = await pool.query("SELECT * FROM seller");
    res.json(allSellers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Add a seller
router.post('/sellers/', async (req, res) => {
  try {
    const { username, password, loc, fname, surname } = req.body;
    // Encypt the password: 
    const hashed_password = await bcrypt.hash(password, 10);
    const newSeller = await pool.query(
      "SELECT * FROM add_user($1, $2, $3 , $4, $5)", 
      [username.toLowerCase(), hashed_password, loc, fname.toLowerCase() , surname.toLowerCase()]
    );
    res.json(newSeller.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Delete Seller
router.delete('/sellers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteSeller = await pool.query(" SELECT * FROM remove_user ($1) ", [
      id
    ]);
    res.json(deleteSeller);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;