import express from 'express';
import 'dotenv/config';
import cors from 'cors';


const app = express();

app.use(express.json({ extended: false }));
app.use(cors());


const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
    console.log(`FastFood server running on port ${PORT}`);
});