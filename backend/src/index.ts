import express from 'express';
import cors from 'cors';
import router from './api/routes/routes';
import { runtimeObject } from './config/firebase_setup';
import { getAuth } from 'firebase/auth';
import { v4 } from 'uuid';

const app = express();
const PORT = runtimeObject.port
export const auth = getAuth();

app.use(express.json())
app.use(cors());
app.use('/', router);

export const jwtSecret = v4();

app.listen(PORT, () => {
    console.log(`[server]: Server is running`);
});