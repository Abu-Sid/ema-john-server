const express = require('express')
const cors= require('cors')
require('dotenv').config()
const app = express()
const port = 5000
console.log(process.env.DB_USER);

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.he6ho.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("emaJohn").collection("products");
  const orderCollection = client.db("emaJohn").collection("orders");

  // perform actions on the collection object
  app.post('/addProduct',(req, res)=>{
      const products=req.body;
      console.log(products);
      productCollection.insertOne(products)
      .then(result=>{
        console.log('result',result);
        res.send(result.insertedCount>0)
        
    })
  })
  app.post('/cartProduct',(req, res)=>{
      const productKeys=req.body;
      productCollection.find({key:{$in:productKeys}})
      .toArray((err,documents)=>{
        res.send(documents)
    })
  })
  app.get('/products', (req, res)=>{
      productCollection.find({})
      .toArray((err,documents)=>{
          res.send(documents)
      })
  })
  app.get('/products/:key', (req, res)=>{
    productCollection.find({key:req.params.key})
    .toArray((err,documents)=>{
        res.send(documents[0])
    })
})
   app.post("/addOrder", (req, res) => {
    const order = req.body;
    console.log(order);
    orderCollection.insertOne(order)
    .then((result) => {
        console.log("result", result);
        res.send(result.insertedCount > 0);
    });
});
  console.log('connected');
});



app.get('/', (req, res) => {
  res.send('Hello Ema John!')
})

app.listen(port)