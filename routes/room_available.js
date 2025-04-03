const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM room_available', (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

router.get('/:id', (req, res) => {
    db.query('SELECT * FROM room_available WHERE room_available_id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

router.post('/', (req, res) => {
    const { date, available_qty, room_id } = req.body;
    db.query(
        'INSERT INTO room_available (date, available_qty, room_id) VALUES (?, ?, ?)',
        [date, available_qty, room_id],
        (err, results) => {
            if (err) return res.status(500).send(err.message);
            res.send(results);
        }
    );
});

router.put('/', (req, res) => {
    const { date, available_qty, room_id, room_available_id } = req.body;
    db.query(
        'UPDATE room_available SET date=?, available_qty=?, room_id=? WHERE room_available_id=?',
        [date, available_qty, room_id, room_available_id],
        (err, results) => {
            if (err) return res.status(500).send(err.message);
            res.send(results);
        }
    );
});

router.delete('/', (req, res) => {
    db.query('DELETE FROM room_available WHERE room_available_id=?', [req.body.book_id], (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

module.exports = router;
