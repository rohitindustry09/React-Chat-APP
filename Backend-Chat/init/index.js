const mongoose = require('mongoose');
const User = require('../models/user.js');
const initData = require('./data.js');

const uri = "mongodb+srv://rohitindustry09:qwert63838ryul09@reactmessagecluster.9fem2.mongodb.net/?retryWrites=true&w=majority&appName=reactMessageCluster";

main().then(()=>{
  console.log('Connected to database .!');
}).catch((err)=>{
  console.log('error from init/index.js', err);
});

async function main() {
  await mongoose.connect(uri);
}

async function initDb() {
  /*initData.data.map((user)=> {
    const data User.insertOne(user);
  });*/
  let manyDeleted = await User.deleteMany({});
  if (manyDeleted)
  console.log('empty database !')
  /*
  const data = await User.insertMany(initData.data);
  console.log(data)*/
}

initDb();