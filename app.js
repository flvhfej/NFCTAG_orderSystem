const express = require('express');
const mysql = require('mysql');
const path = require('path');
const multer  = require('multer')
//const upload = multer({ dest: 'test_img_upload/' }) //multer를 사용해 이미지 저장할 경로,테스트용임

//multer를 사용해 이미지 저장할 경로 
const upload = multer({  
    storage: multer.diskStorage({
      	filename(req, file, done) {
          	console.log(file);
			done(null, file.originalname);
        },
        //파일저장 위치 지정, file의 이름을 로그에 출력하고 test_img_upload파일에 이미지를 저장하게 될거야, 그래야만 해
		destination(req, file, done) {
      		console.log(file);
		    done(null, path.join(__dirname, "test_img_upload/"));
	    },
    }),
});

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
    port: 3306,
    multipleStatements: true // 여러 쿼리 실행을 허용
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
app.post('/admin_addel', (req, res) => { 
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


//테스트 이미지 업로드 
//firststore admin에서 이미지 선택 후 업로드 클릭 시 서버 로그에 파일 디테일을 출력함
//동시에 NodeJsver_ORDERTAG/test_img_upload에 파일이 랜덤한 이름으로 저장됨. 파일확장자도 지워지니 그건 주의
//line 3~4부분이 multer와 파일 저장 위치 이다.
//multipart/form-data 형식의 body를 파싱해서 파일로 다시 변환하고 dest에 등록된 경로에 업로드 된다.
//upload.single() : 파일이 하나일 때 사용 하는 함수, 인수로는 html상에서 전달하는 객체의 name을 적는다.
//예시로 admin.ejs에는 input의 name태그가 myFilef로 되어있다.
//////////// 
//이건 업로드 파일 확장자명을 지키기 위한 로직 위에서 변경요구
/*
const upload = multer({
    storage: multer.diskStorage({
      	filename(req, file, done) {
          	console.log(file);
			done(null, file.originalname);
        },
		destination(req, file, done) {
      		console.log(file);
		    done(null, path.join(__dirname, "public"));
	    },
    }),
});

////////////
const uploadMiddleware = upload.single('myFile');
app.use(uploadMiddleware);

app.post('/upload', (req, res) => {
    console.log(req.file);
    res.status(200).send('uploaded');
});


*/


//////////
//이곳에 firstStore 어드민 이미지 업로드 로직 구현 예정

/*
upload.single() : 파일이 하나일 때 사용 하는 함수, 인수로는 html상에서 전달하는 객체의 name을 적는다.
인수인 myFile은 나중에 수정예정, html에서도 수정요구
*/
const uploadMiddleware = upload.single('myFile');
app.use(uploadMiddleware);

app.post('/Storeimg_upload', (req, res) => {
    //test code 
    console.log(req.file); //파일업로드 시 해당 파일의 정보 출력
    res.status(200).send('uploaded');
});






// 손님 페이지
app.get('/firstStore/menu2', (req, res) => {
    const sql=`SELECT * FROM menu;`;
    /*const sql = `
        SELECT * FROM menu;
        SELECT * FROM menu_option;
    `;*/
    db.query(sql, (err, results) => {
        if (err) {
            console.error('쿼리가 제대로 명시되지 않았습니다.: ' + err.stack);
            res.status(500).send('데이터베이스 쿼리 실패');
            return;
        }
        
        /*const menuResults = results[0];
        const menuOptionResults = results[1];*/
        const menuResults = results;
        //메인메뉴는 items, 추가옵션은 options
        res.render('firstStore/menu2', { items:menuResults });//items: menuResults, options: menuOptionResults
    });
});

//주문 완료 처리
app.post('/DoSendOrder', (req, res) => { 
    const { menu } = req.body;
    console.log('주문 완료:', menu); // 주문 완료 로그
    // 주문 완료 처리 로직을 여기에 추가할 것
    res.json({ success: true });
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


app.listen(3001, () => {
    console.log('서버가 3001포트에서 실행됩니다.');
});