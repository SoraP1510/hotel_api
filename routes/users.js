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

// users.js
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
        if (err) return res.status(500).send(err.message);
        if (results.length === 0) return res.status(401).send('Invalid credentials');
        res.send(results[0]); // ส่งข้อมูล user (รวม user_id)
    }
    );
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

        if (results.length === 0) {
        return res.status(401).send('Invalid email or password');
        }

        // ✅ คืนค่าข้อมูลผู้ใช้ที่แท้จริง รวมถึง user_id ที่ถูกต้อง
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
    db.query('DELETE FROM users WHERE user_id=?', [userId], (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send({ message: `User ${userId} deleted` });
    });
});

module.exports = router;
