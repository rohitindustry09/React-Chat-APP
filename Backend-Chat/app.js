const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user.js');

const app = express();
const port = 8000;

app.use(cors({
  origin: '*',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));


app.use(express.json());

const uri = "mongodb+srv://rohitindustry09:qwert63838ryul09@reactmessagecluster.9fem2.mongodb.net/?retryWrites=true&w=majority&appName=reactMessageCluster";

main().then(()=>{
  console.log('Connected to database !');
}).catch((err)=>{
  console.log(err);
})

async function main() {
  await mongoose.connect(uri);
}
app.listen(port, ()=>{
  console.log(`listening on port http://localhost:${port}...`);
});

app.get('/', (req, res)=>{
  res.send('<h1>Message Ho raha hai bhai?</h1>');
  console.log('user is online on route -> /');
})

async function findUser(data) {
  const user = await User.findOne(data);
    if (user) {
      return user;
    } else {
      return false;
    }
}

app.get('/api/findSomeone', async (req, res) => {
  let { someone } = req.query;

  try {
    let users = await User.find({ 
      username: { $regex: `^${someone}`, $options: 'i' } 
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found!' });
    }
    const { password: _, ...restUserData } = users[0].toObject(); 
     //console.log(restUserData)
    res.status(200).json({ message: 'Found friend!', user: restUserData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error!' });
  }
});

app.get('/api/showUser/:id', async (req, res)=>{
  let { id } = req.params;
  let user = await User.findById(id);
  console.log('here now!!!', id)
  if (user) {
    const { password: _, ...restUserData } = user.toObject();
    res.status(201).json({ message: 'users found!', friend: restUserData })
  } else {
    res.status(500).json({ message: 'can not find users!' })
  }
});

app.get('/api/addFriend/:friendId/to/:id', async (req, res) => {
  
  const { friendId, id } = req.params;

  try {
    let user = await User.findByIdAndUpdate(id, 
   { $addToSet: { friends: friendId } }, { new: true });
    console.log(user)
    const { password: _, ...restUserData } = user.toObject();
    //re saving the localStorage when adding friend
    res.status(200).json({ message: 'friend added!', user: restUserData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error!' });
  }
  
});


app.post('/api/user', async (req, res)=>{
    const { username, email, password, confirmPassword } = req.body;
    if (!username && !confirmPassword) {
      //function above
      const user = await findUser(req.body); 
      if (user) {
      console.log(user);
        const { password: _, ...restUserData } = user.toObject();
        res.status(201).json({ message: 'user logged in !', user: restUserData });
      } else {
        res.status(500).json({ message: 'user not in the database !'});
      }
    }
  else if (username && confirmPassword) {
    
    let user = await findUser(req.body);
    if (!user) {
       let newUser = new User({
         username: username, 
         email: email,
         password: password
       });
      if (newUser) {
       await newUser.save();
       const { password: _, ...restUserData } = newUser.toObject();
       res.status(201).json({ message: 'user signup successfully ', user: restUserData });
       console.log('user set to db from SIGNUP ', newUser);
      }
    }
    else {
     res.status(500).json({ message: 'user already exist' });
    }
  }
});