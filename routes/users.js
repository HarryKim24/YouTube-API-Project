// 모듈 세팅
const express = require("express");
const router = express.Router();
const conn = require('../mariadb');
const {body, param,  validationResult} = require('express-validator');

router.use(express.json());

const validate =  (req, res, next) => {
  const err = validationResult(req);
    
  if (err.isEmpty()) {
    return next();
  } else {
    return res.status(400).json(err.array());
  }
}

// 로그인 기능
router.post(
  "/login",
  [
    body('user_email').notEmpty().isEmail().withMessage('user_email은 이메일로 입력해주세요.'),
    body('user_password').notEmpty().isString().withMessage('user_password은 문자로 입력해주세요.'),
    validate
  ],
  (req, res) => {
  const {user_email, user_password} = req.body;
  let SQL = `SELECT * FROM users WHERE user_email = ?`;

  conn.query(SQL, user_email,
    function(err, results) {
      if (err) {
        console.log(err);
        res.status(400).end();
      }

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
router.post(
  "/join",
  [
    body('user_email').notEmpty().isEmail().withMessage('user_email은 이메일로 입력해주세요.'),
    body('user_name').notEmpty().isString().withMessage('user_name은 문자로 입력해주세요.'),
    body('user_password').notEmpty().isString().withMessage('user_password은 문자로 입력해주세요.'),
    body('user_contact').notEmpty().isString().withMessage('user_contact은 문자로 입력해주세요.'),
    validate
  ],
  (req, res) => {

  const {user_email, user_name, user_password, user_contact} = req.body;
  let SQL = `INSERT INTO users (user_email, user_name, user_password, user_contact)
            VALUES (?, ?, ?, ?)`;
  let values = [user_email, user_name, user_password, user_contact];
  conn.query(SQL, values, 
    function (err, results) {
      if (err) {
        console.log(err);
        res.status(400).end();
      }
      
      res.status(201).json(results);
    }
  ); 
});

// 회원 개별 조회
router.get("/users",
  [
    body('user_email').notEmpty().isEmail().withMessage('user_email은 이메일로 입력해주세요.'),
    validate
  ],
  (req, res) => {
  let {user_email} = req.body;
  let SQL = `SELECT * FROM users WHERE user_email = ?`;

  conn.query(SQL, user_email, 
    function (err, results) {
      if (err) {
        console.log(err);
        res.status(400).end();
      }
      
      res.status(200).json(results);
    }
  ); 
});

// 회원 개별 탈퇴
router.delete("/users",
  [
    body('user_email').notEmpty().isEmail().withMessage('user_email은 이메일로 입력해주세요.'),
    validate
  ],
  (req, res) => {
  let {user_email} = req.body;
  let SQL = `DELETE FROM users WHERE user_email = ?`;

  conn.query(SQL, user_email,
    function(err, results) {
      if (err) {
        console.log(err);
        res.status(400).end();
      }

      if (results.affectedRows == 0) {
        return res.status(400).end();
      } else {
        res.status(200).json(results);
      }
    }
  );
});

module.exports = router