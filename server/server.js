import express from 'express';
import cors  from 'cors';
import morgan from 'morgan';
import connect from './database/connect.js';
import router from './router/route.js';
import { config } from 'dotenv';

const app = express();
config();

var whitelist = ['http://localhost:3000', 'https://expenses-sharing.yukilun.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  exposedHeaders: ['x-total', 'x-totalpage']
}

/** middleware */
app.use(express.json({ limit: '10mb' }));
app.use(cors(corsOptions));
app.use(morgan('tiny'));
app.disable('x-powered-by'); // avolid hackers

const port = process.env.PORT || 8080;

/** HTTP GET Request */
app.get('/', (req, res)=> {
    res.status(201).json("Home GET Request");
});

/** api routes */
app.use('/api', router);

app.get('/test', (req, res)=> {
    res.send(req.query);
})

/** start server only when we have valid connection*/
connect().then(()=> {
    try {
        app.listen(port, () => {
            console.log(`Server connected port ${port}`);
        });
    }
    catch (error) {
        console.log(`Cannot connect to server`);
    }
}).catch(error => {
    console.log("Invalid database connection!");
})

