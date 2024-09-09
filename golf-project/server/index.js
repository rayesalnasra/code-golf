import express from 'express';
import cors from 'cors';

const app = express();
const port = 80;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
