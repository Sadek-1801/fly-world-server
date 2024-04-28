const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
require("dotenv").config();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qv5d3vd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const touristSpotCollection = client
      .db("touristSpotDB")
      .collection("touristSpot");
    const sEACountriesCollection = client
      .db("countryDB")
      .collection("country");

    app.get("/touristSpot", async (req, res) => {
      const cursor = touristSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/touristSpot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.findOne(query);
      res.send(result);
    });

    app.get("/touristSpots/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const result = await touristSpotCollection.find(query).toArray();
      res.send(result);
    });
    
    app.post("/touristSpot", async (req, res) => {
      const newSpot = req.body;
      const result = await touristSpotCollection.insertOne(newSpot);
      res.send(result);
    });

    app.patch("/updateTouristSpot/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedtouristSpot = req.body;
      const touristSpot = {
        $set: {
          image: updatedtouristSpot.image,
          tourist_spot: updatedtouristSpot.tourist_spot,
          country: updatedtouristSpot.country,
           location: updatedtouristSpot. location,
          average_cost: updatedtouristSpot.average_cost,
          travel_time: updatedtouristSpot.travel_time,
          season: updatedtouristSpot.season,
          total_visit: updatedtouristSpot.total_visit,
          description: updatedtouristSpot.description,
        },
      };

      const result = await touristSpotCollection.updateOne(filter, touristSpot);
      res.send(result);
    });

    app.delete("/touristSpot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.deleteOne(query);
      res.send(result);
    });

    // country related CRUD
    app.post("/country", async (req, res) => {
      const newCountry = req.body;
      console.log(newCountry)
      const result = await sEACountriesCollection.insertOne(newCountry);
      res.send(result);
    });

    app.get("/country", async (req, res) => {
      const cursor = sEACountriesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/country/:name", async (req, res) => {
      const name = req.params.name;
      // const nameInLowerCase = name.toLocaleLowerCase()
      const query = { country: name.toLocaleLowerCase() };
      const result = await touristSpotCollection.find(query).toArray();
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("tourism website server running");
});

app.listen(port, () => {
  console.log(`tourism website server running on ${port}`);
});
