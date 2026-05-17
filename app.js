const express = require('express');
const path = require('path');

const request = require('request');
const axios = require('axios');
const http = require('http');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { error } = require('console');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

//mongo
var CONNECTION_STRING = "mongodb+srv://pp05133:CoolConverse1@cluster0.jvdohqi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
var DATABASENAME = "MSApp";
var database;
//mongo
const app = express();
app.use(express.json());
app.use(cors());
// app.use(express.static('frontenddd/dist/frontenddd/browser'));
app.use(express.urlencoded({extended:false}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});



//1. SearchBar
app.get('/stockSearchAutocompleteAPI', async (req, res) => {
    const apiResponse = await axios.get('https://finnhub.io/api/v1/stock/symbol?exchange=US&token=cn2pfehr01qt9t7v3dcgcn2pfehr01qt9t7v3dd0');
    res.json(apiResponse.data);

});
// const got = require('got');
let url, url2;
app.get('/insiderSentiment', async (req, res) => {
    var userInputQuery = req.query.userInputQuery;
    const apiResponse = await axios.get(`https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${userInputQuery}&from=2022-01-01&token=cn2pfehr01qt9t7v3dcgcn2pfehr01qt9t7v3dd0`);
    // cons
    res.json(apiResponse.data);

});

app.get('/het', async (req, res) => {
    var userInputQuery = req.query.userInputQuery;
    const apiResponse = await axios.get(`https://finnhub.io/api/v1/search?q=${userInputQuery}&exchange=US&token=cn2pfehr01qt9t7v3dcgcn2pfehr01qt9t7v3dd0`);
    res.json(apiResponse.data.result);
    // res.send(req);
    // res.send(url,url2)
});

app.get('/stockSearchAutocompleteAPItest', async (req, res) => {
    const apiResponse = await axios.get('https://finnhub.io/api/v1/stock/symbol?exchange=US&token=cn2pfehr01qt9t7v3dcgcn2pfehr01qt9t7v3dd0');
    res.json(apiResponse.data);
    // res.send(req);
    // res.send(url,url2)
});

app.get('/companyProfile', async (req, res) => {
    var userInputQuery = req.query.userInputQuery;
    const apiResponse = await axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${userInputQuery}&token=cn2pfehr01qt9t7v3dcgcn2pfehr01qt9t7v3dd0`);
    res.json(apiResponse.data);

});
app.get('/stockQuote', async (req, res) => {
    var userInputQuery = req.query.userInputQuery;
    const apiResponse = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${userInputQuery}&token=cn2pfehr01qt9t7v3dcgcn2pfehr01qt9t7v3dd0`);
    res.json(apiResponse.data);
    // res.send(req);
    // res.send(url,url2)
});

app.get('/companyPeers', async (req, res) => {
    var userInputQuery = req.query.userInputQuery;
    const apiResponse = await axios.get(`https://finnhub.io/api/v1/stock/peers?symbol=${userInputQuery}&token=cn2pfehr01qt9t7v3dcgcn2pfehr01qt9t7v3dd0`);
    res.json(apiResponse.data);
    // res.send(req);
    // res.send(url,url2)
});

app.get('/poly', async (req, res) => {
    var { userInputQuery, fromDate, toDate } = req.query;
    var userInputQuery = req.query.userInputQuery;
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;


// console.log(userInputQuery,"usi",fromDate,"fromdate",toDate);
    // var fromDate = '2023-12-03';
    // var toDate = '2024-03-20';
    console.log(userInputQuery,"usi",fromDate,"fromdate",toDate);
    const apiResponse = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${userInputQuery}/range/1/hour/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=f7upIoZhXQ8NDq7aZQ1PToLt2xpUV1HA`);
    // console.log(apiResponse);
    // console.log("==================================");
    res.json(apiResponse.data);

});
app.get('/companyNews', async (req, res) => {
    var userInputQuery = req.query.userInputQuery;
    const apiResponse = await axios.get(`https://finnhub.io/api/v1/company-news?symbol=${userInputQuery}&from=2023-08-15&to=2023-08-20&token=cn2pfehr01qt9t7v3dcgcn2pfehr01qt9t7v3dd0`);
    res.json(apiResponse.data);

});
app.get('/stockRecommendation', async (req, res) => {
    var userInputQuery = req.query.userInputQuery;
    const apiResponse = await axios.get(`https://finnhub.io/api/v1/stock/recommendation?symbol=${userInputQuery}&token=cn2pfehr01qt9t7v3dcgcn2pfehr01qt9t7v3dd0`);
    res.json(apiResponse.data);

});

app.get('/stockEarnings', async (req, res) => {
    var userInputQuery = req.query.userInputQuery;
    const apiResponse = await axios.get(`https://finnhub.io/api/v1/stock/earnings?symbol=${userInputQuery}&token=cn2pfehr01qt9t7v3dcgcn2pfehr01qt9t7v3dd0`);
    res.json(apiResponse.data);

});

//market open
app.get('/stockQuoteForChartsTab', async (req, res) => {
    var userInputQuery = req.query.userInputQuery.toUpperCase();
    // var userInputQuery='AAPL';
    // Get current date
    // console.log(userInputQuery,"UserInoutQuery from stock quote for charts tab")
    const currentDate = new Date();

    // Get year, month, and day components
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    const day = String(currentDate.getDate()).padStart(2, '0');

    // Construct formatted current date string
    const formattedCurrentDate = `${year}-${month}-${day}`;
    // console.log("Current date (YYYY-MM-DD):", formattedCurrentDate);

    currentDate.setFullYear(currentDate.getFullYear() - 2);

    const pastYear = currentDate.getFullYear();
    const pastMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const pastDay = String(currentDate.getDate()).padStart(2, '0');

    // Construct formatted past date string
    const formattedPastDate = `${pastYear}-${pastMonth}-${pastDay}`;
    // console.log("Past date 2 months back from current date (YYYY-MM-DD):", formattedPastDate);
// console.lo
    const apiResponse = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${userInputQuery}/range/1/day/${formattedPastDate}/${formattedCurrentDate}?adjusted=true&sort=asc&apiKey=f7upIoZhXQ8NDq7aZQ1PToLt2xpUV1HA`);
    console.log(apiResponse);
    
    res.json(apiResponse.data);


});


//market close sat
// app.get('/stockQuoteForChartsTab', async (req, res) => {
//     var userInputQuery = req.query.userInputQuery.toUpperCase();
//     // Get current date
//     // console.log(userInputQuery,"UserInoutQuery from stock quote for charts tab")
//     const currentDate = new Date();

//     // Get year, month, and day components
//     const year = currentDate.getFullYear();
//     const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//     const day = String(currentDate.getDate()).padStart(2, '0');

//     // Construct formatted current date string
//     const formattedCurrentDate = `${year}-${month}-${day}`;
//     // console.log("Current date (YYYY-MM-DD):", formattedCurrentDate);

//     currentDate.setFullYear(currentDate.getFullYear() - 2);

//     const pastYear = currentDate.getFullYear();
//     const pastMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//     const pastDay = String(currentDate.getDate()).padStart(2, '0');

//     // Construct formatted past date string
//     const formattedPastDate = `${pastYear}-${pastMonth}-${pastDay}`;
//     // console.log("Past date 2 months back from current date (YYYY-MM-DD):", formattedPastDate);
// // console.lo
//     const apiResponse = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${userInputQuery}/range/1/day/${formattedPastDate}/${formattedCurrentDate}?adjusted=true&sort=asc&apiKey=f7upIoZhXQ8NDq7aZQ1PToLt2xpUV1HA`);
//     res.json(apiResponse.data);


// });

//market closed sun
// app.get('/stockQuoteForChartsTab', async (req, res) => {
//     var userInputQuery = req.query.userInputQuery.toUpperCase();
//     // Get current date
//     // console.log(userInputQuery,"UserInoutQuery from stock quote for charts tab")
//     const currentDate = new Date();

//     // Get year, month, and day components
//     const year = currentDate.getFullYear();
//     const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//     const day = String(currentDate.getDate()).padStart(2, '0');

//     // Construct formatted current date string
//     const formattedCurrentDate = `${year}-${month}-${day}`;
//     // console.log("Current date (YYYY-MM-DD):", formattedCurrentDate);

//     currentDate.setFullYear(currentDate.getFullYear() - 2);

//     const pastYear = currentDate.getFullYear();
//     const pastMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); 
//     const pastDay = String(currentDate.getDate()).padStart(2, '0');

//     // Construct formatted past date string
//     const formattedPastDate = `${pastYear}-${pastMonth}-${pastDay}`;
//     // console.log("Past date 2 months back from current date (YYYY-MM-DD):", formattedPastDate);
// // console.lo
//     const apiResponse = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${userInputQuery}/range/1/day/${formattedPastDate}/${formattedCurrentDate}?adjusted=true&sort=asc&apiKey=f7upIoZhXQ8NDq7aZQ1PToLt2xpUV1HA`);
//     res.json(apiResponse.data);


// });




















async function connectToMongo() {
    try {
        const client = await MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB successfully");
        database = client.db(DATABASENAME);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

// Call the function to connect to MongoDB
connectToMongo();

// Define a route to fetch data from the "MSCollection" collection

//for watchlist
app.get('/api/MSCollection/getData', async (request, response) => {
    if (!database) {
        return response.status(500).send('Database not initialized');
    }

    try {
        const collection = database.collection("MSCollection");
        const result = await collection.find({}).toArray();
        response.json(result);
    } catch (error) {
        console.error("Error fetching data from MSCollection:", error);
        response.status(500).send(error);
    }
});


//forMoneyInWallet
//get
app.get('/api/miscCollection/getData', async (request, response) => {
    if (!database) {
        return response.status(500).send('Database not initialized');
    }

    try {
        const collection = database.collection("miscCollection");
        const result = await collection.find({}).toArray();
        response.json((result));
    } catch (error) {
        console.error("Error fetching data from miscCollection:", error);
        response.status(500).send(error);
    }
});

//update
app.put('/api/miscCollection/updateData/:id', async (request, response) => {
    if (!database) {
        return response.status(500).send('Database not initialized');
    }

    const documentId = request.params.id; // Extract the ID from the URL
    const newData = request.body; // Assuming the new data is sent in the request body

    try {
        const collection = database.collection("miscCollection");
        // MongoDB requires an ObjectId for querying by _id
        const result = await collection.updateOne({ _id: new ObjectId(documentId) }, { $set: newData });

        if (result.modifiedCount === 0) {
            return response.status(404).send('Document not found or no change made');
        }

        response.json({ message: 'Document updated successfully', _id: documentId });
    } catch (error) {
        console.error("Error updating document in miscCollection:", error);
        response.status(500).send(error);
    }
});

//end moneyinwallet apis


//portfolio display related details - update through modal display portfolio
app.get('/api/MSPortfolio/getData', async (request, response) => {
    if (!database) {
        return response.status(500).send('Database not initialized');
    }

    try {
        const collection = database.collection("MSPortfolio");
        const result = await collection.find({}).toArray();
        response.json((result));
    } catch (error) {
        console.error("Error fetching data from MSPortfolio:", error);
        response.status(500).send(error);
    }
});

//putdata
app.put('/api/MSPortfolio/updateData/:id', async (request, response) => {
    if (!database) {
        return response.status(500).send('Database not initialized');
    }

    const documentId = request.params.id; // Extract the ID from the URL
    const newData = request.body; // Assuming the new data is sent in the request body

    try {
        const collection = database.collection("MSPortfolio");
        // MongoDB requires an ObjectId for querying by _id
        // const result = await collection.updateOne({ _id: new ObjectId(documentId) }, { $set: newData });
        // const result = await collection.updateOne({ _id: new ObjectId(documentId) }, { $set: newData });
        const { _id, ...updatedData } = newData; // Exclude _id field from updated data

        const result = await collection.updateOne(
          { _id: new ObjectId(documentId) }, 
          { $set: updatedData }
        );
        
        if (result.modifiedCount === 0) {
            return response.status(404).send('Document not found or no change made');
        }

        response.json({ message: 'Document updated successfully', _id: documentId });
    } catch (error) {
        console.error("Error updating document in miscCollection:", error);
        response.status(500).send(error);
    }
});

app.post('/api/MSPortfolio/postData', async (request, response) => {
    if (!database) {
        return response.status(500).send('Database not initialized');
    }

    console.log("Inserting document:", request.body); // Debugging log

    try {
        const collection = database.collection("MSPortfolio");
        if (!request.body || typeof request.body !== 'object') {
            return response.status(400).send('Invalid data format');
        }
        const result = await collection.insertOne(request.body);
        response.status(201).json(result);
    } catch (error) {
        console.error("Error creating data in MSCollection:", error);
        response.status(500).send(error);
    }
});
const asyncHandler1 = fn => (req, res, next) =>
    Promise
        .resolve(fn(req, res, next))
        .catch(next);

app.delete('/api/MSPortfolio/deleteData/:id', asyncHandler1(async (req, res) => {
    const id = req.params.id;

    // Connect to MongoDB; note that MongoClient.connect returns the client instance directly, so calling .connect() again is not necessary.
    const client = await MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

    // Validate Object ID
    if (!ObjectId.isValid(id)) {
        await client.close();
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    const db = client.db(DATABASENAME);
    const collection = db.collection("MSPortfolio");

    // Use the 'new' keyword to create a new ObjectId instance
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        await client.close();
        return res.status(404).json({ message: 'Data not found' });
    }

    res.status(200).json({ message: 'Data deleted successfully' });
    await client.close();
}));

//ends here

//deletedata


// //test delete
// app.delete('/delete-symbol/:symbol', async (req, res) => {
//     const symbol = req.params.symbol;
//     try {
//         const client =  await MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

//         // await client.connect();
//         const database = client.db(DATABASENAME); // Replace with your database name
//         const collection = database.collection("MSCOLLECTION"); // Replace with your collection name
        
//         const result = await collection.deleteOne({ symbol: symbol });
//         if (result.deletedCount === 1) {
//             res.send("Successfully deleted one document.");
//         } else {
//             res.send("No documents matched the query. Deleted 0 documents.");
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("An error occurred while trying to delete the document.");
//     } finally {
        
//     }
// });



app.post('/api/MSCollection/postData', async (request, response) => {
    if (!database) {
        return response.status(500).send('Database not initialized');
    }

    console.log("Inserting document:", request.body); // Debugging log

    try {
        const collection = database.collection("MSCollection");
        if (!request.body || typeof request.body !== 'object') {
            return response.status(400).send('Invalid data format');
        }
        const result = await collection.insertOne(request.body);
        response.status(201).json(result);
    } catch (error) {
        console.error("Error creating data in MSCollection:", error);
        response.status(500).send(error);
    }
});



const asyncHandler = fn => (req, res, next) =>
    Promise
        .resolve(fn(req, res, next))
        .catch(next);

// app.delete('/api/MSCollection/deleteData/:id', asyncHandler(async (req, res) => {
//     const id = req.params.id;

//     // Connect to MongoDB; note that MongoClient.connect returns the client instance directly, so calling .connect() again is not necessary.
//     const client = await MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

//     // Validate Object ID
//     if (!ObjectId.isValid(id)) {
//         await client.close();
//         return res.status(400).json({ message: 'Invalid ID format' });
//     }

//     const db = client.db(DATABASENAME);
//     const collection = db.collection("MSCollection");

//     // Use the 'new' keyword to create a new ObjectId instance
//     const result = await collection.deleteOne({ _id: new ObjectId(id) });

//     if (result.deletedCount === 0) {
//         await client.close();
//         return res.status(404).json({ message: 'Data not found' });
//     }

//     res.status(200).json({ message: 'Data deleted successfully' });
//     await client.close();
// }));

app.delete('/api/MSCollection/deleteBySymbol/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    console.log(`Request received to delete symbol: ${symbol}`); // Ensure the symbol is received correctly

    try {
        const client = await MongoClient.connect(CONNECTION_STRING);
        const db = client.db(DATABASENAME);
        const collection = db.collection("MSCollection");
        
        console.log(`Connected to database. Attempting to delete document with symbol: ${symbol}`);
        
        const result = await collection.deleteOne({ symbol: symbol });

        console.log(`Delete operation result: ${JSON.stringify(result)}`); // Log the result of the delete operation

        if (result.deletedCount === 0) {
            console.log(`No document found with the symbol: ${symbol}`);
            return res.status(404).send({ message: 'No document found with the given symbol.' });
        } else {
            console.log(`Document with symbol: ${symbol} successfully deleted.`);
            return res.status(200).send({ message: 'Document successfully deleted.' });
        }
    } catch (error) {
        console.error('Error deleting the document:', error.message);
        console.error(error.stack); // This line logs the stack trace
        res.status(500).send({ message: 'Error deleting the document.', error: error.message });
    }
});

// Global error handler middleware
app.use((error, req, res, next) => {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`node is running on port : ${port} `);


});