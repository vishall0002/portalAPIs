import express from 'express';
import cors from 'cors';
import router from './view/routes.js';
import { connection } from './postgres/postgres.js';

const app = express();
const PORT = 8080;

console.log('📁 index.js loaded');

app.use(express.json());
app.use(cors());
// app.use(router);
app.use('/api/v1', router)

app.listen(PORT, () => {
    console.log(`🚀 Server is running on PORT ${PORT}`);
});
ReferenceError

// Initialize DB connection
connection();



