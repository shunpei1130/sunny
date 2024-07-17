const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// データベース接続
connectDB();

// ミドルウェア設定
app.use(express.json({ extended: false }));
app.use(cors());

// ルート設定
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
