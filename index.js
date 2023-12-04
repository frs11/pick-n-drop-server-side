const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const corsConfig = {
  origin: [
    "https://pick-n-drop-service.netlify.app",
    "https://api.imgbb.com/1/upload",
    "http://localhost:5173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};
app.use(cors(corsConfig));
app.options("", cors(corsConfig));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jmuxmrg.mongodb.net/?retryWrites=true&w=majority`;

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
    const usersCollection = client.db("Pick-n-DropDB").collection("users");

    // Store Users to the database
    app.post("/newUsers", async (req, res) => {
      const newUser = req?.body;
      // console.log(newUser);
      const verify = { email: newUser?.email };
      const userExists = await usersCollection.findOne(verify);
      // console.log(userExists);
      if (!userExists) {
        const result = await usersCollection.insertOne(newUser);
        res.send(result);
      } else {
        res.send({ message: "user exists" });
      }
      // console.log(result);
    });

    // Get user role from mongodb
    app.get("/userrole", async (req, res) => {
      const result = await usersCollection.find().toArray();
      // console.log(result);
      res.send(result);
    });

    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});
app.get("/test", (req, res) => {
  res.send("server testing");
  console.log("testing successfully");
});

app.listen(port, () => console.log(`server is running on port: ${port}`));
