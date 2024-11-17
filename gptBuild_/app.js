const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views'); // 뷰 파일 디렉토리 설정
app.engine('html', require('ejs').renderFile); //ejs요구를 html로 랜더링


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
    res.render('admin.html');
});

// 관리자 페이지
app.get('/admin', (req, res) => {
    res.render('admin.html');
});

app.post('/admin', (req, res) => {
    const { name, image_url, price, description } = req.body;
    const sql = 'INSERT INTO Menu (name, image_url, price, description) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, image_url, price, description], (err, result) => {
        if (err) {
            console.error('쿼리가 제대로 명시되지 않았습니다.: ' + err.stack);
            res.status(500).send('데이터베이스 쿼리 실패');
            return;
        }
        res.redirect('/');
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

app.listen(3001, () => {
    console.log('서버가 3001포트에서 실행됩니다.');
});

//데이터 베이스까진 연결 성공
//하지만 html파일을 랜더링하는데 실패
