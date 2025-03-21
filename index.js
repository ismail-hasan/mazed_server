const { MongoClient, ServerApiVersion, Collection, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 3000

// Bike_Bazar
// ArrDzucc5w0k4nq3

// midleWare 
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gbi1i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri)

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
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // Collection database
        const bikeCollection = client.db('bikeBazar').collection('bikeCollection')
        const commentCollection = client.db('bikeBazar').collection('commentCollection')


        // add bike api 

        app.get('/bikes', async (req, res) => {
            const category = req.query.category
            const email = req.query.email
            let query = {}
            if (category) {
                query = { category: category }
            }

            if (email) {
                query = { email: email }
            }

            const result = await bikeCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/bikes/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await bikeCollection.findOne(query)
            res.send(result)
        })


        app.post('/bikes', async (req, res) => {
            const body = req.body
            console.log(body)
            const result = await bikeCollection.insertOne(body)
            res.send(result)
        })
        // app.post('/upload', async (req, res) => {
        //     const body = req.body
        //     console.log("upload bikes", body)
        //     const result = await bikeCollection.insertOne(body)
        //     res.send(result)
        // })

        // delete method 
        app.delete("/bikes/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await bikeCollection.deleteOne(query)
            res.send(result)
        })

        // comment collection

        app.get('/comment', async (req, res) => {
            const result = await commentCollection.find().toArray()
            res.send(result)
        })


        app.post('/comment', async (req, res) => {
            const body = req.body
            const result = await commentCollection.insertOne(body)
            res.send(result)
        })








    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send('bike bazer server is running')
})

app.listen(port, () => {
    console.log(`biker server port server running is ${port}`)
})