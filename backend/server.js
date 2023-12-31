const express = require('express');
const dotenv = require('dotenv');
const { mongoose } = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');

const chats = [
  {
    isGroupChat: false,
    users: [
      {
        name: 'John Doe',
        email: 'john@example.com',
      },
      {
        name: 'Piyush',
        email: 'piyush@example.com',
      },
    ],
    _id: '617a077e18c25468bc7c4dd4',
    chatName: 'John Doe',
  },
  {
    isGroupChat: false,
    users: [
      {
        name: 'Guest User',
        email: 'guest@example.com',
      },
      {
        name: 'Piyush',
        email: 'piyush@example.com',
      },
    ],
    _id: '617a077e18c25468b27c4dd4',
    chatName: 'Guest User',
  },
  {
    isGroupChat: false,
    users: [
      {
        name: 'Anthony',
        email: 'anthony@example.com',
      },
      {
        name: 'Piyush',
        email: 'piyush@example.com',
      },
    ],
    _id: '617a077e18c2d468bc7c4dd4',
    chatName: 'Anthony',
  },
  {
    isGroupChat: true,
    users: [
      {
        name: 'John Doe',
        email: 'jon@example.com',
      },
      {
        name: 'Piyush',
        email: 'piyush@example.com',
      },
      {
        name: 'Guest User',
        email: 'guest@example.com',
      },
    ],
    _id: '617a518c4081150716472c78',
    chatName: 'Friends',
    groupAdmin: {
      name: 'Guest User',
      email: 'guest@example.com',
    },
  },
  {
    isGroupChat: false,
    users: [
      {
        name: 'Jane Doe',
        email: 'jane@example.com',
      },
      {
        name: 'Piyush',
        email: 'piyush@example.com',
      },
    ],
    _id: '617a077e18c25468bc7cfdd4',
    chatName: 'Jane Doe',
  },
  {
    isGroupChat: true,
    users: [
      {
        name: 'John Doe',
        email: 'jon@example.com',
      },
      {
        name: 'Piyush',
        email: 'piyush@example.com',
      },
      {
        name: 'Guest User',
        email: 'guest@example.com',
      },
    ],
    _id: '617a518c4081150016472c78',
    chatName: 'Chill Zone',
    groupAdmin: {
      name: 'Guest User',
      email: 'guest@example.com',
    },
  },
];

dotenv.config();
mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server is running on port ${PORT}`)
);

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
    // credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('Connected to socket.io');
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User Joined Room: ' + room);
  });
  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit('message recieved', newMessageRecieved);
    });
  });

  socket.off('setup', () => {
    console.log('USER DISCONNECTED');
    socket.leave(userData._id);
  });
});
