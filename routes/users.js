const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

router.get('/:id', (req, res) => {
    db.query('SELECT * FROM users WHERE user_id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

router.post('/', (req, res) => {
    const { fname, lname, email, phone, password } = req.body;
    db.query(
        'INSERT INTO users (fname, lname, email, phone, password) VALUES (?, ?, ?, ?, ?)',
        [fname, lname, email, phone, password],
        (err, results) => {
            if (err) return res.status(500).send(err.message);
            res.send(results);
        }
    );
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (err, results) => {
            if (err) return res.status(500).send(err.message);
            if (results.length === 0) return res.status(401).send('Invalid email or password');

            // ✅ ส่ง user เดียวแบบ object พร้อม user_id
            res.send(results[0]);
        }
    );
});

router.put('/', (req, res) => {
    const { user_id, fname, lname, email, phone, password } = req.body;
    db.query(
        'UPDATE users SET fname=?, lname=?, email=?, phone=?, password=? WHERE user_id=?',
        [fname, lname, email, phone, password, user_id],
        (err, results) => {
            if (err) return res.status(500).send(err.message);
            res.send(results);
        }
    );
});

router.delete('/', (req, res) => {
    db.query('DELETE FROM users WHERE user_id=?', [req.body.user_id], (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

router.delete('/:id', (req, res) => {
    const userId = req.params.id;

    db.query('DELETE FROM booking WHERE user_id = ?', [userId], (err1, result1) => {
        if (err1) {
            return res.status(500).send('Error deleting bookings: ' + err1.message);
        }

        db.query('DELETE FROM users WHERE user_id = ?', [userId], (err2, result2) => {
            if (err2) {
                return res.status(500).send('Error deleting user: ' + err2.message);
            }

            res.send({ message: `User ${userId} and their bookings have been deleted.` });
        });
    });
});


module.exports = router;
