const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM hotels', (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

router.get('/:id', (req, res) => {
    db.query('SELECT * FROM hotels WHERE hotel_id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

router.post('/', (req, res) => {
    const { hotel_name, city, province, description, hotel_image } = req.body;
    db.query(
        'INSERT INTO hotels (hotel_name, city, province, description, hotel_image) VALUES (?, ?, ?, ?, ?)',
        [hotel_name, city, province, description, hotel_image],
        (err, results) => {
            if (err) return res.status(500).send(err.message);
            res.send(results);
        }
    );
});

router.put('/', (req, res) => {
    const { hotel_id, hotel_name, city, province, description, hotel_image } = req.body;
    db.query(
        'UPDATE hotels SET hotel_name=?, city=?, province=?, description=?, hotel_image=? WHERE hotel_id=?',
        [hotel_name, city, province, description, hotel_image, hotel_id],
        (err, results) => {
            if (err) return res.status(500).send(err.message);
            res.send(results);
        }
    );
});

router.delete('/', (req, res) => {
    db.query('DELETE FROM hotels WHERE hotel_id=?', [req.body.hotel_id], (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

module.exports = router;
