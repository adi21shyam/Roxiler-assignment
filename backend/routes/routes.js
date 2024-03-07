const express = require("express");
const router = express.Router();
const { MongoClient } = require('mongodb');

// Define MongoDB connection URL and database name
const mongoUrl = process.env.MONGODB_URI;
const dbName = 'roxiler-assignment';

// Function to connect to MongoDB
const connectToMongo = async () => {
    const client = new MongoClient(mongoUrl);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db(dbName);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

// Middleware to ensure database connection is established before processing requests
router.use(async (req, res, next) => {
    if (!router.db) {
        try {
            
            router.db = await connectToMongo();
        } catch (error) {
            console.log("3")
            return res.status(500).send('Error connecting to database');
        }
    }
    next();
});

// Route for fetching transactions
router.get('/transactions', async (req, res) => {
    const { month, search, page = 1, perPage = 10 } = req.query;
    const query = {};

    if (month) {
        const regex = new RegExp(`-${month.padStart(2, '0')}-`);
        query.dateOfSale = { $regex: regex };
    }

    if (search) {
        query.$or = [
            { productionTitle: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: { $regex: search, $options: 'i' } }
        ];
    }

    try {
        const transactions = await router.db.collection('transactions')
            .find(query)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .toArray();
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching the data");
    }
});

// Route for fetching statistics
router.get('/statistics', async (req, res) => {
    
    const { month } = req.query;
    const monthRegex = new RegExp(`-${month.padStart(2, '0')}-`);

    try {
        const stats = await router.db.collection('transactions').aggregate([
            {
                $match: {
                    dateOfSale: { $regex: monthRegex }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSaleAmount: { $sum: '$price' },
                    totalSoldItems: {
                        $sum: {
                            $cond: [{ $eq: ["$sold", true] }, 1, 0]
                        }
                    },
                    totalNotSoldItems: {
                        $sum: {
                            $cond: [{ $eq: ["$sold", false] }, 1, 0]
                        }
                    }
                }
            }
        ]).toArray();

       

        res.json(stats[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching statistics');
    }
});

// Route for fetching bar chart data
router.get('/barchart', async (req, res) => {
    const { month } = req.query;
    const monthRegex = new RegExp(`-${month.padStart(2, '0')}-`);

    try {
        const ranges = [
            { $lt: 101 }, { $gte: 101, $lt: 201 }, { $gte: 201, $lt: 301 }, { $gte: 301, $lt: 401 },
            { $gte: 401, $lt: 501 }, { $gte: 501, $lt: 601 }, { $gte: 601, $lt: 701 },
            { $gte: 701, $lt: 801 }, { $gte: 801, $lt: 901 }, { $gte: 901 }
        ];

        const rangeQueries = ranges.map(range => ({
            $sum: {
                $cond: {
                    if: { $and: [{ $gte: ["$price", range.$gte || 0] }, { $lt: ["$price", range.$lt || Infinity] }] },
                    then: 1,
                    else: 0
                }
            }
        }));

        const barChartData = await router.db.collection('transactions').aggregate([
            {
                $match: {
                    dateOfSale: { $regex: monthRegex }
                }
            },
            {
                $group: {
                    _id: null,
                    ...Object.fromEntries(rangeQueries.map((range, i) => [`range_${i + 1}`, range['$sum']])),
                }
            }
        ]).toArray();

        console.log(barChartData)

        res.json(barChartData[0] || {});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching bar chart data');
    }
});

// Route for fetching pie chart data
router.get('/piechart', async (req, res) => {
    const { month } = req.query;
    const monthRegex = new RegExp(`-${month.padStart(2, '0')}-`);

    try {
        const pieChartData = await router.db.collection('transactions').aggregate([
            {
                $match: {
                    dateOfSale: { $regex: monthRegex }
                }
            },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]).toArray();

        res.json(pieChartData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching pie chart data');
    }
});




module.exports= router;