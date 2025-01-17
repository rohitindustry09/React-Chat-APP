const mongoose = require('mongoose');
const Message = require('../models/messages.js');

const uri = "mongodb+srv://rohitindustry09:qwert63838ryul09@reactmessagecluster.9fem2.mongodb.net/?retryWrites=true&w=majority&appName=reactMessageCluster";

// Connect to MongoDB
main()
  .then(() => {
    console.log('Connected to database!');
    return initMessage(); // Initialize message after connecting to the database
  })
  .catch((err) => {
    console.log('Error from init/index.js:', err);
  });

// Main connection function
async function main() {
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
}

// Initialize a new message
async function initMessage() {
  try {
    const msg = new Message({
      sender: 'ryul999i',
      receiver: '2ndryul',
      content: ['yaya', 'waaaah'],
      messageAt: Date.now(),
    });

    await msg.save(); // Save the document to the database
    console.log('Message saved:', msg);
  } catch (error) {
    console.log('Error while saving message:', error);
  }
}
