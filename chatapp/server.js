const express = require('express');
const path = require('path');

const app = express();

const server = require('http').createServer(app);
const io =  require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );

    res.render('index.html');
});

let messages = [];



io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id} `);

socket.emit('previousMessages', messages);


    socket.on('sendMsg', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    });
});


server.listen(3001);

