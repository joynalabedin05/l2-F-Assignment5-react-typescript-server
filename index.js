const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// const corsOptions = {
//   origin: 'http://localhost:5000/',
//   methods: ['GET', 'HEAD', 'PUT', 'POST', 'PATCH', 'DELETE'],
//   credeantials: true,
//   optionSuccessStatus: 204,
// }

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASS}@cluster0.ssvrn1a.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const eventCollection = client.db('Assignment5-frontend-server').collection('events');
    const recentEventCollection = client.db('Assignment5-frontend-server').collection('recentEvent');

    app.get('/events', async(req,res)=>{
        const result  = await eventCollection.find().toArray();
        res.send(result);
      });

    app.get('/recent-event', async(req,res)=>{
        const result  = await recentEventCollection.find().toArray();
        res.send(result);
      });

      app.get('/events/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await eventCollection.findOne(query);
        res.send(result) ;
        // console.log(id);
      });
      app.get('/recent-event/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await recentEventCollection.findOne(query);
        res.send(result) ;
        // console.log(id);
      });

      app.post('/create-event', async(req,res)=>{
        const newItem = req.body;
        const result = await eventCollection.insertOne(newItem);
        res.send(result);
      });
      app.post('/create-recent-event', async(req,res)=>{
        const newItem = req.body;
        const result = await recentEventCollection.insertOne(newItem);
        res.send(result);
      });

      app.delete('/events/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await eventCollection.deleteOne(query);
        res.send(result);
      })
      app.delete('/recent-event/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await recentEventCollection.deleteOne(query);
        res.send(result);
      })

      app.patch('/update-event/:id', async(req, res)=>{
        const id = req.params.id;
        const user = req.body;
        console.log(id,user);
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true}
        const updatedUser = {
          $set:{
            name: user.name,
            image: user.image,
          }
        }
        const result = await eventCollection.updateOne(filter, updatedUser,options);
        res.send(result);
      });

      app.patch('/update-recent-event/:id', async(req, res)=>{
        const id = req.params.id;
        const user = req.body;
        console.log(id,user);
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true}
        const updatedUser = {
          $set:{
            name: user.name,
            image: user.image,
          }
        }
        const result = await eventCollection.updateOne(filter, updatedUser,options);
        res.send(result);
      });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req, res)=>{
    res.send('assignment5-server is running')
});

app.listen(port, ()=>{
    console.log(`assignment5-server is running on port ${port}`);
})