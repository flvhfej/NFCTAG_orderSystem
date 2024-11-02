// app.js
const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

app.use(express.json());

// MySQL 연결 설정
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // MySQL 사용자 이름
    password: 'password', // MySQL 비밀번호
    database: 'restaurantDB'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL 연결됨');
});

// 메뉴 추가 API
app.post('/api/addMenu', (req, res) => {
    const { name, price, description } = req.body;
    const query = 'INSERT INTO Menu (name, price, description) VALUES (?, ?, ?)';
    db.query(query, [name, price, description], (err, result) => {
        if (err) throw err;
        res.status(201).json({ message: '메뉴 추가 완료' });
    });
});

// 메뉴 가져오기 API
app.get('/api/getMenu', (req, res) => {
    const query = 'SELECT * FROM Menu';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다`);
});
