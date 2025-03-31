const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM rooms', (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

router.get('/:id', (req, res) => {
    db.query('SELECT * FROM rooms WHERE room_id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

router.post('/', (req, res) => {
    const { room_type, room_price, max_guest, description, room_available, hotel_id, room_image } = req.body;
    db.query(
        'INSERT INTO rooms (room_type, room_price, max_guest, description, room_available, hotel_id, room_image) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [room_type, room_price, max_guest, description, room_available, hotel_id, room_image],
        (err, results) => {
            if (err) return res.status(500).send(err.message);
            res.send(results);
        }
    );
});

router.put('/', (req, res) => {
    const { room_id, room_type, room_price, max_guest, description, room_available, hotel_id, room_image } = req.body;
    db.query(
        'UPDATE rooms SET room_type=?, room_price=?, max_guest=?, description=?, room_available=?, hotel_id=?, room_image=? WHERE room_id=?',
        [room_type, room_price, max_guest, description, room_available, hotel_id, room_image, room_id],
        (err, results) => {
            if (err) return res.status(500).send(err.message);
            res.send(results);
        }
    );
});

router.delete('/', (req, res) => {
    db.query('DELETE FROM rooms WHERE room_id=?', [req.body.room_id], (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

router.get('/hotel/:id', (req, res) => {
    db.query('SELECT * FROM rooms WHERE hotel_id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

module.exports = router;
