// express 모듈 세팅
const express = require("express");
const router = express.Router();

const conn = require('../mariadb');

router.use(express.json()); // http 외 모듈 'JOSN' 사용

let db = new Map();
var objectId = 1; // 객체마다 고유한 ID값 부여

// 로그인 기능
router.post("/login", (req, res) => {
  console.log(req.body);

  const {id, password} = req.body;
  var loginUser = {};

  db.forEach(objectUser => {
    if (objectUser.id === id) {
      loginUser = objectUser;
    }
  });

  if (isAccount(loginUser)) {
    if (loginUser.password === password) {
      res.status(200).json({
        message : `${loginUser.name}님 로그인 되었습니다.`
      });
    } else {
      res.status(400).json({
        message : "비밀번호가 틀렸습니다."
      });
    }
  } else {
    res.status(404).json({
      message : "존재하지 않는 아이디 입니다."
    });
  }

  function isAccount(obj) {
    if (Object.keys(obj).length === 0) return false;
    else return true;
  }
});

// 회원 가입 기능
router.post("/join", (req, res) => {
  if (req.body == {}) {
    res.status(400).json({
      message : `회원 정보를 다시 입력해주세요.`,
    });
  } else {
    const {id} = req.body;
    db.set(id, req.body);
    console.log(db);

    res.status(201).json({
      message : `${db.get(id).name}님 반갑습니다!`
    });
  }
});

// 회원 개별 조회
router.get("/users", (req, res) => {
  console.log(db);
  let {userEmail} = req.body;

  conn.query(
    `SELECT * FROM users WHERE user_email = ?`, userEmail, 
    function (err, results, fiedls) {
      if (results.length) {
        res.status(200).json(results);
        console.log(results);
      } else {
        res.status(404).json({
          message : `입력한 회원이 존재하지 않습니다.`
        });
      }
    }
  ); 
});

// 회원 개별 탈퇴
router.delete("/users", (req, res) => {
  let {id} = req.body;
  const user = db.get(id);

  if (user) {
    db.delete(id);
    console.log(db);

    res.status(200).json({
      message : `${user.name}님 계정이 삭제되었습니다.`
    })
  } else {
    res.status(404).json({
      message : "회원 정보가 존재하지 않습니다."
    })
  }
});

module.exports = router