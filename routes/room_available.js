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
    const { room_id, date, available_qty } = req.body;

    // ลอง UPDATE ก่อน
    db.query(
        'UPDATE room_available SET available_qty = ? WHERE room_id = ? AND date = ?',
        [available_qty, room_id, date],
        (err, result) => {
            if (err) return res.status(500).send(err.message);

            if (result.affectedRows > 0) {
                // มี row อยู่แล้ว → แค่ update
                return res.send({ updated: true });
            }

            // ถ้าไม่มี row → insert ใหม่
            db.query(
                'INSERT INTO room_available (room_id, date, available_qty) VALUES (?, ?, ?)',
                [room_id, date, available_qty],
                (err2, result2) => {
                    if (err2) return res.status(500).send(err2.message);
                    res.send({ inserted: true });
                }
            );
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
    db.query('DELETE FROM room_available WHERE room_available_id=?', [req.body.room_available_id], (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

router.get('/search', (req, res) => {
    const { room_id, date } = req.query;
    db.query(
        'SELECT * FROM room_available WHERE room_id = ? AND date = ?',
        [room_id, date],
        (err, results) => {
            if (err) return res.status(500).send(err.message);
            res.send(results); // ส่งเป็น array ([] หรือ [{}])
        }
    );
});

module.exports = router;
