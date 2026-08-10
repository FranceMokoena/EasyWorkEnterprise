require('dotenv').config();

const express = require('express');
const cors = require('cors');

const procurementRoutes = require('./routes/procurement');
const contactRoutes = require('./routes/contact');

const app = express();

const PORT = process.env.PORT || 5000;

/*
|--------------------------------------------------------------------------
| MIDDLEWARE
|--------------------------------------------------------------------------
*/

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/

app.get('/', (req, res) => {
    res.json({
        success: true,
        service: 'Easywork Enterprise API',
        status: 'online',
        version: '1.0.0'
    });
});

/*
|--------------------------------------------------------------------------
| API HEALTH CHECK
|--------------------------------------------------------------------------
*/

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Easywork Enterprise API is running.',
        timestamp: new Date().toISOString()
    });
});

/*
|--------------------------------------------------------------------------
| API ROUTES
|--------------------------------------------------------------------------
*/

app.use('/api/procurement', procurementRoutes);
app.use('/api/contact', contactRoutes);

/*
|--------------------------------------------------------------------------
| 404 HANDLER
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found.'
    });
});

/*
|--------------------------------------------------------------------------
| ERROR HANDLER
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {
    console.error('API Error:', err);

    res.status(500).json({
        success: false,
        message: 'An internal server error occurred.'
    });
});

/*
|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/

app.listen(PORT, () => {
    console.log('');
    console.log('==============================================');
    console.log('       EASYWORK ENTERPRISE API');
    console.log('==============================================');
    console.log(`Server running on port ${PORT}`);
    console.log(`Local URL: http://localhost:${PORT}`);
    console.log(`Health:    http://localhost:${PORT}/api/health`);
    console.log('==============================================');
    console.log('');
});