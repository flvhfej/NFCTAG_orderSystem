const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('views'));
app.set('view engine', 'ejs');
app.set('views', './views'); // 뷰 파일 디렉토리 설정
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'restaurantDB',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('데이터베이스 연결 실패: ' + err.stack);
        return;
    }
    console.log('데이터베이스와 연결 성공!');
});

// 기본 경로
app.get('/', (req, res) => {
    res.render('admin'); // test.ejs 파일을 렌더링
});

// 관리자 페이지
app.get('/admin', (req, res) => {
    res.render('admin'); // admin.ejs 파일을 렌더링
});

app.post('/admin_adTomenu', (req, res) => { // post방식 admin_adTomenu
    const { name, image_url, price, description } = req.body;
    const sql = 'INSERT INTO menu (name, image_url, price, description) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, image_url, price, description], (err, result) => {
        if (err) {
            console.error('쿼리가 제대로 명시되지 않았습니다.: ' + err.stack);
            res.status(500).send('데이터베이스 쿼리 실패');
            return;
        }
        res.redirect('/admin');
    });
});

app.post('/admin_addel', (req, res) => { // post방식 admin_addel 
    const { id } = req.body;
    console.log('Request Body:', req.body); //일단 수시로 확인하기 위한 로그
    const sql = 'DELETE FROM menu WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('쿼리가 제대로 명시되지 않았습니다.: ' + err.stack);
            res.status(500).send('데이터베이스 쿼리 실패');
            return;
        }
        res.redirect('/admin');
    });
});



// 손님 페이지
app.get('/menu', (req, res) => {
    const sql = 'SELECT * FROM menu';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('쿼리가 제대로 명시되지 않았습니다.: ' + err.stack);
            res.status(500).send('데이터베이스 쿼리 실패');
            return;
        }
        res.render('menu', { items: results });
    });
});

// 이식할 손님 페이지
app.get('/test', (req, res) => {
    const sql = 'SELECT * FROM menu';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('쿼리가 제대로 명시되지 않았습니다.: ' + err.stack);
            res.status(500).send('데이터베이스 쿼리 실패');
            return;
        }
        res.render('test', { items: results}); // test.ejs 파일을 렌더링
    });
});

app.listen(3001, () => {
    console.log('서버가 3001포트에서 실행됩니다.');
});