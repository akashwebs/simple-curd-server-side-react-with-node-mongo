const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
app.use(cors());
app.use(express.json());

//dbuser1
//mgGuh-D37b6Zgif


const uri = "mongodb+srv://dbuser1:mgGuh-D37b6Zgif@cluster0.fvbrr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userCollection = client.db('foodExpress').collection('user');

        //read/find multiple data from DB
        app.get('/mainuser', async (req, res) => {
            const query = {};    
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })
        //read/find signle data from database with any id
        app.get('/mainuser/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result = await userCollection.findOne(query);
            res.send(result);


        })

        // update/put user from DB, requst from client side
        app.put('/mainuser/:id',async(req,res)=>{
            const id=req.params.id;
            const updateUser=req.body;
            const filter={_id:ObjectId(id)}
            const options = { upsert: true };
            const updateDoc={
                $set:{
                    name:updateUser.name, email: updateUser.email
                }
            };
            const result= await userCollection.updateOne(filter,updateDoc,options);
            res.send(result)
        })

        //rcv one data from client side and insert one data in DB
        app.post('/users', async (req, res) => {
            const user = req.body;
            //  const result=await userCollection.insertOne(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        //delete single data uising id from DB 
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }

            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

    } finally {
        // await client.close();
    }

}
run().catch(console.dir);



const users = [
    { "id": 1, "name": "akash shil", "email": "Sincere@april.biz" },
    { "id": 2, "name": "aliyea begumm", "email": "Sincere@april.biz" },
    { "id": 3, "name": "suro rani", "email": "Sincere@april.biz" },
    { "id": 4, "name": "shati diya", "email": "Sincere@april.biz" },
    { "id": 5, "name": "prity biswas", "email": "Sincere@april.biz" },
    { "id": 6, "name": "smirty biswas", "email": "Sincere@april.biz" }
];

app.get('/', (req, res) => {
    res.send('hello world this is express');
})

app.get('/users', (req, res) => {

    const search = req.query.name;
    if (search) {
        const user = users.filter(user => user.name.toLocaleLowerCase().includes(search));
        res.send(user)
    } else {

        res.send(users);
    }

})

app.get('/users/:idName', (req, res) => {
    const idName = parseInt(req.params.idName);
    const user = users.find(user => user.id === idName);
    res.send(user);
})

app.post('/user', (req, res) => {
    console.log(req.body);
    const user = req.body;
    user.id = users.length + 1;
    users.push(user);
    res.send(user);
})


app.listen(port, () => {
    console.log(port);
})






