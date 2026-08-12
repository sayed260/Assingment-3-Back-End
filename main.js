/*
? Q1. What is the Node.js Event Loop?
The Event Loop is the mechanism that allows Node.js to handle asynchronous and non-blocking operations
while using a single main JavaScript thread.

? Q2. What is Libuv and What Role Does It Play in Node.js?
Libuv is a C library used by Node.js to provide asynchronous I/O operations and the Event Loop.
It handles operations such as:
- File System operations
- DNS operations
- Network operations
- Timers
- Thread Pool management

? Q3. How Does Node.js Handle Asynchronous Operations Under the Hood?
When Node.js starts an asynchronous operation, it does not block the main JavaScript thread.
The operation is handled by the appropriate system mechanism or Libuv's Thread Pool. When the operation finishes, its callback is placed in the appropriate queue.


? Q4. What is the Difference Between the Call Stack, Event Queue, and Event Loop in Node.js?
 the Call Stack executes synchronous code, the Event Queue stores asynchronous callbacks awaiting execution,
 and the Event Loop acts as the coordinator that moves tasks from the queue to the stack when the stack is completely empty.



? Q5. What is the Node.js Thread Pool and How to Set the Thread Pool Size?
The Node.js Thread Pool is a group of worker threads managed by Libuv. It is used for certain expensive operations that should not block the main JavaScript thread.

? Q6. How Does Node.js Handle Blocking and Non-Blocking Code Execution?
Blocking code stops the main JavaScript thread until the operation finishes. This prevents the Event Loop from handling other requests.
*/


// ************* part 2 *************

const fs = require('node:fs/promises');
const path = require('node:path');

const express = require('express')
const {use} = require("express/lib/application");
const app = express()
const port = 3000

const pathFile = path.resolve('users.json');

async function saveUser(content) {

        return await fs.writeFile(pathFile, JSON.stringify(content , null , 2), 'utf-8');

}

async function getUsers() {
        const data =  await fs.readFile(pathFile, 'utf-8');
        const users = JSON.parse(data)
        return users;
}

app.use(express.json())


// add user

app.post('/user', async (req , res)=>{
    const data = req.body;
    try {
        const users = await getUsers();
        const existEmail = users.find(user => user.email === data.email);
        if(existEmail) {
            return res.status(400).json({message: 'Email already exists'});
        }
        const newUser = {id: users.length? Math.max(...users.map(user => user.id)) + 1: 1  , ...data};

        await saveUser([...users , newUser]);

        return res.status(201).json({message: 'User created successfully'});
    } catch (error) {
        return res.status(500).json({message: 'Error creating user'});
    }
})


// update user bt id
app.patch('/user/:id', async (req , res)=>{
    const id = Number(req.params.id);
    const {name , age , email} = req.body;

    const users = await getUsers();
    const user = users.find(user => user.id == id);

    if(!user) return res.status(404).json({message: 'Users not found'});

    if(email){
        const existEmail = users.some(user => user.email === email && user.id !== id);
        if(existEmail) {
            return res.status(400).json({message: 'Email already exists'});
        }
        user.email = email
    }
    if (name) user.name = name;
    if (age) user.age = age;

    await saveUser(users);


    return res.status(200).json({message: 'User updated successfully'});

})

// delete user by id

app.delete('/user/:id', async (req , res)=>{
    const {id} = req.params;
    const users = await getUsers();

    const userIndex = users.findIndex(user => user.id == id);

    if(userIndex === -1) return res.status(404).json({message: 'Users not found'});

    users.splice(userIndex , 1);
    
    await saveUser(users);

    return res.status(200).json({message: 'User Delete successfully'});
})


//get user by name

app.get('/search/getByName', async (req , res)=>{

    const query = req.query;
    const users = await getUsers();

    const user = users.filter(user=>user.name == query.name);
    
    if(user.length === 0) return res.status(404).json({message: 'Users not found'});

    return res.json({message: "user is found" ,  user});
})



// get all users

app.get('/user', async (req , res)=>{
    
    try {
        const users = await getUsers();
    return res.json({users});
    } catch (error) {
        return res.status(404).json({message: 'Users not found'});
    }   
})


//get user by filter age

app.get('/search/getByAge', async (req , res)=>{

    const query = req.query;
    const users = await getUsers();

 const user = users.filter(user=>user.age >= query.age); 
    if(user.length === 0) return res.status(404).json({message: 'Users not found'});

    return res.json({message: "user is found" ,  user});
})


//get user by id

app.get('/user/:id', async (req , res)=>{

    const {id} = req.params;
    const users = await getUsers();

    const user = users.find(user=>user.id == id);
    
    if(!user) return res.status(404).json({message: 'Users not found'});

    return res.json({message: "user is found" , user});
})



app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})