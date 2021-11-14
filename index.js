const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ooztb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




async function run() {
    try {
        await client.connect();
        const database = client.db('produst_two')
        const productsCollection = database.collection("items")
        const ordersCollection = client.db("produst_two").collection("orders");
        const usersCollection = client.db("produst_two").collection("users");
        const reviewCollection = client.db("produst_two").collection("review");
        //    post all data
        app.post('/additems', async (req, res) => {
            const item = req.body;
            const result = await productsCollection.insertOne(item)
            console.log(result);
            res.json(result
            )

        })


        // get all data
        app.get("/allitems", async (req, res) => {
            const result = await productsCollection.find({}).toArray();
            res.send(result);
        });



        // sigle item data load
        app.get("/singleItem/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await productsCollection
                .find({ _id: ObjectId(req.params.id) })
                .toArray();
            res.send(result[0]);
            console.log(result);
        });

        //  post  data in saver site
        app.post("/addOrders", async (req, res) => {
            const result = await ordersCollection.insertOne(req.body);
            res.send(result);
        });
        // get data from by email

        app.get("/myOrder/:email", async (req, res) => {
            console.log(req.params.email);
            const result = await ordersCollection
                .find({ email: req.params.email })
                .toArray();
            res.send(result);
        });

        // review postin the server site
        app.post("/addServiceReview", async (req, res) => {
            const result = await reviewCollection.insertOne(req.body);
            res.send(result);
        });



        // get user register email and name

        app.post('/users', async (req, res) => {
            const result = await usersCollection.insertOne(req.body);
            res.send(result);

        })

        app.put('/users', async (req, res) => {
            const user = req.body;
            console.log('put', user);
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })





        //  make admin

        app.put("/users/makeAdmin", async (req, res) => {
            const user = req.body;
            console.log("put".user);
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } }

            const result = await usersCollection.updateOne(filter, updateDoc);
            // if (result) {
            //     const bosss = await usersCollection.updateOne(filter, {
            //         $set: { role: "admin" },
            //     });
            //     console.log(bosss);
            // }
            // else {
            //     const role = "admin";
            //     const result3 = await usersCollection.insertOne(req.body.email, {
            //         role: role,
            //     });
            // }
            // console.log(result);
        });














    }
    finally {

    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('hello user!');
})

app.listen(port, () => {
    console.log(`Listening at :${port}`)
})