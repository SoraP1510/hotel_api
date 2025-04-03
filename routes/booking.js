const express = require('express');
const router = express.Router();
const db = require('../db');

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

            // Subtract room_qty if enough rooms are available
            db.query(
                'UPDATE rooms SET room_qty = room_qty - ? WHERE room_id = ? AND room_qty >= ?',
                [num_rooms, room_id, num_rooms],
                (err2, updateResult) => {
                    if (err2) return res.status(500).send(err2.message);

                    res.send({ booking: results, updated: updateResult });
                }
            );
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
    const { book_id } = req.body;

    db.query('SELECT * FROM booking WHERE book_id = ?', [book_id], (err, bookingResults) => {
        if (err) return res.status(500).send(err.message);
        if (bookingResults.length === 0) return res.status(404).send('Booking not found');

        const { room_id, num_rooms } = bookingResults[0];

        db.query('DELETE FROM booking WHERE book_id = ?', [book_id], (err2, results) => {
            if (err2) return res.status(500).send(err2.message);

            // Restore the room_qty
            db.query('UPDATE rooms SET room_qty = room_qty + ? WHERE room_id = ?', [num_rooms, room_id], (err3) => {
                if (err3) return res.status(500).send(err3.message);

                res.send(results);
            });
        });
    });
});

module.exports = router;
