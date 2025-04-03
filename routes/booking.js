const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM booking', (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

router.get('/:id', (req, res) => {
    db.query('SELECT * FROM booking WHERE book_id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

router.post('/', (req, res) => {
    const { check_in, check_out, num_guest, num_rooms, total_price, hotel_id, room_id, user_id } = req.body;
    db.query(
        'INSERT INTO booking (check_in, check_out, num_guest, num_rooms, total_price, hotel_id, room_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [check_in, check_out, num_guest, num_rooms, total_price, hotel_id, room_id, user_id],
        (err, results) => {
            if (err) return res.status(500).send(err.message);
            res.send(results);
        }
    );
});

router.put('/', (req, res) => {
    const { book_id, check_in, check_out, num_guest, num_rooms, total_price, hotel_id, room_id, user_id } = req.body;
    db.query(
        'UPDATE booking SET check_in=?, check_out=?, num_guest=?, num_rooms=?, total_price=?, hotel_id=?, room_id=?, user_id=? WHERE book_id=?',
        [check_in, check_out, num_guest, num_rooms, total_price, hotel_id, room_id, user_id, book_id],
        (err, results) => {
            if (err) return res.status(500).send(err.message);
            res.send(results);
        }
    );
});

router.delete('/', (req, res) => {
    db.query('DELETE FROM booking WHERE book_id=?', [req.body.book_id], (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

router.get('/check-availability', (req, res) => {
    const { room_id, date } = req.query;

    if (!room_id || !date) {
        return res.status(400).send('Missing room_id or date');
    }

    const query = `
        SELECT SUM(num_rooms) AS booked
        FROM booking
        WHERE room_id = ?
        AND ? < check_out AND ? >= check_in
    `;

    db.query(query, [room_id, date, date], (err, results) => {
        if (err) return res.status(500).send(err.message);

        const booked = results[0].booked || 0;

        db.query('SELECT room_qty FROM rooms WHERE room_id = ?', [room_id], (err2, roomResult) => {
            if (err2) return res.status(500).send(err2.message);

            const totalQty = roomResult[0]?.room_qty || 0;
            const available = totalQty - booked;

            res.send({ room_id, date, totalQty, booked, available });
        });
    });
});

module.exports = router;
