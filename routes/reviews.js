const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM reviews', (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

router.get('/:id', (req, res) => {
    db.query('SELECT * FROM reviews WHERE review_id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

router.post('/', (req, res) => {
    const { rating, comment, hotel_id, user_id } = req.body;
    db.query(
        'INSERT INTO reviews (rating, comment, hotel_id, user_id) VALUES (?, ?, ?, ?)',
        [rating, comment, hotel_id, user_id],
        (err, results) => {
            if (err) return res.status(500).send(err.message);
            res.send(results);
        }
    );
});

router.put('/', (req, res) => {
    const { review_id, rating, comment, hotel_id, user_id } = req.body;
    db.query(
        'UPDATE reviews SET rating=?, comment=?, hotel_id=?, user_id=? WHERE review_id=?',
        [rating, comment, hotel_id, user_id, review_id],
        (err, results) => {
            if (err) return res.status(500).send(err.message);
            res.send(results);
        }
    );
});

router.delete('/', (req, res) => {
    db.query('DELETE FROM reviews WHERE review_id=?', [req.body.review_id], (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

module.exports = router;
