const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.csfnsag.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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

    const db = client.db('Tech_bazar');
    const productCollection = db.collection('products');

    const ordersCollection = db.collection('orders');

    // 👉 Save product
    app.post('/products', async (req, res) => {
      try {
        const productData = req.body;
        const result = await productCollection.insertOne(productData);
        res
          .status(201)
          .json({ message: 'Product saved successfully!', result });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // get all product
    app.get('/get-products', async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });

    // get single product
    app.get('/single-products/:id', async (req, res) => {
      const id = req.params.id;
      const product = await productCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(product);
    });

    // save orders
    app.post('/orders', async (req, res) => {
      try {
        const order = req.body;
        order.createdAt = new Date();
        const result = await ordersCollection.insertOne(order);
        res
          .status(201)
          .json({ message: 'Order saved successfully', id: result.insertedId });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    });

    // test route
    app.get('/', (req, res) => {
      res.send('🚀 Server is running fine!');
    });
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //  await client.close();
  }
}
run().catch(console.dir);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
