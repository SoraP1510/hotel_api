const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/users');
const hotelRoutes = require('./routes/hotels');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/booking');
const reviewRoutes = require('./routes/reviews');
const roomAvailableRoutes = require('./routes/room_available');

app.use('/users', userRoutes);
app.use('/hotels', hotelRoutes);
app.use('/rooms', roomRoutes);
app.use('/booking', bookingRoutes);
app.use('/reviews', reviewRoutes);
app.use('/room_available', roomAvailableRoutes);

app.get('/', (req, res) => {
    res.send('Hello world!!2');
});

module.exports = app;