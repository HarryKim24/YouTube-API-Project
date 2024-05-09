// 모듈 세팅
const express = require("express");
const router = express.Router();
const conn = require('../mariadb');

router.use(express.json());

// 로그인 기능
router.post("/login", (req, res) => {
  const {user_email, user_password} = req.body;
  let SQL = `SELECT * FROM users WHERE user_email = ?`;

  conn.query(SQL, user_email,
    function(err, results) {
      var loginUser = results[0];

      if (loginUser && loginUser.user_password == user_password) {
        res.status(200).json({
          message : `${loginUser.user_name}님 로그인 되었습니다.`
        });
      } else {
        res.status(404).json({
          message : "이메일 또는 비밀번호를 잘못 입력했습니다."
        });
      }
    }
  );
});

// 회원 가입 기능
router.post("/join", (req, res) => {

  if (req.body == {}) {
    res.status(400).json({
      message : `회원 정보를 다시 입력해주세요.`,
    });
  } else {
    const {user_email, user_name, user_password, user_contact} = req.body;
    let SQL = `INSERT INTO users (user_email, user_name, user_password, user_contact)
    VALUES (?, ?, ?, ?)`;
    let values = [user_email, user_name, user_password, user_contact];

    conn.query(SQL, values, 
      function (err, results) {
        res.status(201).json(results);
      }
    ); 
  }
});

// 회원 개별 조회
router.get("/users", (req, res) => {
  let {user_email} = req.body;
  let SQL = `SELECT * FROM users WHERE user_email = ?`;

  conn.query(SQL, user_email, 
    function (err, results) {
        res.status(200).json(results);
    }
  ); 
});

// 회원 개별 탈퇴
router.delete("/users", (req, res) => {
  let {user_email} = req.body;
  let SQL = `DELETE FROM users WHERE user_email = ?`;

  conn.query(SQL, user_email,
    function(err, results) {
      res.status(200).json(results);
    }
  );
});

module.exports = router