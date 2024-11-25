const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('views'));
app.set('view engine', 'ejs');
app.set('views', './views'); // 뷰 파일 디렉토리 설정
app.use(bodyParser.urlencoded({ extended: true })); //url인코딩 데이터 파싱
app.use(bodyParser.json()); // json 데이터 파싱

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
    res.render('main'); // main으로 최초접근 후 다른 곳으로 이동하는 용
});


// firstStore 관리자 페이지
app.get('/firstStore/admin', (req, res) => {
    const sql = 'SELECT * FROM menu';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('쿼리가 제대로 명시되지 않았습니다.: ' + err.stack);
            res.status(500).send('데이터베이스 쿼리 실패');
            return;
        }
        res.render('firstStore/admin', { items1: results });
    });
});

// post방식 admin_adTomenu /버튼으로 추가하기
app.post('/admin_adTomenu', (req, res) => { 
    const { name, image_url, price, description } = req.body;
    const sql = 'INSERT INTO menu (name, image_url, price, description) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, image_url, price, description], (err, result) => {
        if (err) {
            console.error('쿼리가 제대로 명시되지 않았습니다.: ' + err.stack);
            res.status(500).send('데이터베이스 쿼리 실패');
            return;
        }
        res.redirect('/firstStore/admin');
    });
});

// post방식 admin_addel /버튼으로 삭제 시켜버리기
app.post('/firstStore/admin_addel', (req, res) => { 
    const { id } = req.body;
    console.log('버튼삭제 요청:', req.body); //일단 수시로 확인하기 위한 로그
    const sql = 'DELETE FROM menu WHERE id = ?;'
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('쿼리가 제대로 명시되지 않았습니다.: ' + err.stack);
            res.status(500).send('데이터베이스 쿼리 실패');
            return;
        }
        res.redirect('firstStore/admin');
    });
});



// 손님 페이지
app.get('/firstStore/menu2', (req, res) => {
    const sql = 'SELECT * FROM menu';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('쿼리가 제대로 명시되지 않았습니다.: ' + err.stack);
            res.status(500).send('데이터베이스 쿼리 실패');
            return;
        }
        res.render('firstStore/menu2', { items: results });
    });
});

// 테스트용 손님페이지
app.get('/TestStore/test', (req, res) => {
    const sql = 'SELECT * FROM menu';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('쿼리가 제대로 명시되지 않았습니다.: ' + err.stack);
            res.status(500).send('데이터베이스 쿼리 실패');
            return;
        }
        res.render('TestStore/test', { items: results}); // test.ejs 파일을 렌더링
    });
});


//주문 완료 처리
app.post('/DoSendOrder', (req, res) => { 
    const { menu } = req.body;
    console.log('주문 완료:', menu); // 주문 완료 로그
    // 주문 완료 처리 로직을 여기에 추가할 수 있습니다.
    res.json({ success: true });
});

app.listen(3001, () => {
    console.log('서버가 3001포트에서 실행됩니다.');
});