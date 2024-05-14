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

router
  .route('/')
  .get(
    [
      body('user_id').notEmpty().isInt().withMessage('user_id는 숫자로 입력해주세요.'),
      validate
    ],
    (req, res) => { // 채널 전체 조회

    var {user_id} = req.body;
    let SQL = `SELECT * FROM channels WHERE user_id = ?`;

    conn.query(SQL, user_id, 
      function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        if (results.length) {
          res.status(200).json(results);
        } else {
          return res.status(404).end();
        }
      }
    ); 
  })
  .post(
    [
      body('user_id').notEmpty().isInt().withMessage('user_id는 숫자로 입력해주세요.'),
      body('channel_name').notEmpty().isString().withMessage('channel_name은 문자로 입력해주세요.'),
      validate
    ], 
    (req, res) => { // 채널 개별 생성

    const {channel_name, user_id} = req.body;
    let SQL = `INSERT INTO channels (channel_name, user_id) VALUES (?, ?)`;
    let values = [channel_name, user_id];

    conn.query(SQL, values, 
      function (err, results) {
        if (err) {
          console.log(err);
        
          res.status(400).end();
        }
        res.status(201).json(results);
      }
    ); 
  })

router
  .route('/:id')
  .get(
    [
      param('id').notEmpty().withMessage('채널 id를 입력해주세요'),
      validate
    ],
    (req, res) => { // 채널 개별 조회

    let {id} = req.params;
    id = parseInt(id);
    let SQL = `SELECT * FROM channels WHERE id = ?`;

    conn.query(SQL, id, 
      function (err, results) {
        if (err) {
          console.log(err);
          res.status(400).end();
        }

        if (results.length) {
          res.status(200).json(results);
        } else {
          return res.status(404).end();
        }
      }
    ); 
  })
  .put(
    [
      param('id').notEmpty().withMessage('채널 id를 입력해주세요'),
      body('channel_name').notEmpty().isString().withMessage('채널명을 다시 입력해주세요'),
      validate
    ],
    (req, res) => { // 채널 개별 수정

    let {id} = req.params;
    id = parseInt(id);
    let {channel_name} = req.body;

    let SQL = `UPDATE channels SET channel_name=? WHERE id = ?`;
    let values = [channel_name, id];

    conn.query(SQL, values, 
      function (err, results) {
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
  }) 
  .delete(
    [
      param('id').notEmpty().withMessage('채널 id를 입력해주세요'),
      validate
    ],
    (req, res) => { // 채널 개별 삭제

    let {id} = req.params;
    id = parseInt(id);

    let SQL = `DELETE FROM channels WHERE id = ?`;

    conn.query(SQL, id,
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
  }) 

module.exports = router