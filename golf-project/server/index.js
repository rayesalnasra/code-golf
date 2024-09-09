import express from 'express';

const app = express();
const port = 80;

app.use(express.json());

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

