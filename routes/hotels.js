const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ GET all hotels with nested reviews
router.get('/', (req, res) => {
    const hotelQuery = 'SELECT * FROM hotels';
    const reviewQuery = 'SELECT * FROM reviews';

    db.query(hotelQuery, (err, hotels) => {
        if (err) return res.status(500).send('Error fetching hotels');

        db.query(reviewQuery, (err, reviews) => {
            if (err) return res.status(500).send('Error fetching reviews');

            const hotelsWithReviews = hotels.map(hotel => {
                const hotelReviews = reviews.filter(r => r.hotel_id === hotel.hotel_id);
                return {
                    ...hotel,
                    reviews: hotelReviews
                };
            });

            res.json(hotelsWithReviews);
        });
    });
});

// ✅ GET hotel by ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM hotels WHERE hotel_id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

// ✅ CREATE hotel
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

// ✅ UPDATE hotel
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

// ✅ DELETE hotel
router.delete('/', (req, res) => {
    db.query('DELETE FROM hotels WHERE hotel_id=?', [req.body.hotel_id], (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.send(results);
    });
});

module.exports = router;
