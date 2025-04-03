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

app.post('/room_available', async (req, res) => {
    const { room_id, date, available_qty } = req.body;
  
    if (!room_id || !date || available_qty === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    const result = await db.collection('room_available').updateOne(
      { room_id: room_id, date: date },
      { $set: { available_qty: available_qty } },
      { upsert: true } // ถ้ายังไม่มี document นี้ → สร้างใหม่
    );
  
    res.status(200).json({ message: "Updated successfully", result });
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

app.get('/room_available', async (req, res) => {
    const { room_id, date } = req.query;
  
    if (!room_id || !date) {
      return res.status(400).json({ message: "room_id and date are required" });
    }
  
    const available = await db.collection('room_available').findOne({
      room_id: parseInt(room_id),
      date: date,
    });
  
    if (!available) {
      return res.status(404).json({ message: "Not found" });
    }
  
    res.json(available);
  });

module.exports = router;
