const express = require("express");
const router = express.Router();
const conn = require('../mariadb');

router.use(express.json());

let db = new Map();
var objectId = 1;

router
  .route('/')
  .get((req, res) => { // 채널 전체 조회
    var {id} = req.body;
    var youtubeChannels = [];

    if (db.size && id) {
      db.forEach(objectChannel => {
        if (objectChannel.id === id) 
          youtubeChannels.push(objectChannel);
      })
      
      if (youtubeChannels.length) {
        res.status(200).json(youtubeChannels);
      } else {
        notFoundChannelError();
      }
    } else {
      notFoundChannelError();
    }
  })
  .post((req, res) => { // 채널 개별 생성

    if (req.body.channelTitle) {

      db.set(objectId++, req.body);
      console.log(db);

      res.status(201).json({
        message : `${db.get(objectId - 1).channelTitle} 채널이 생성되었습니다!`
      })
    } else {
      res.status(400).json({
        message : '채널 정보를 다시 입력해주세요.'
      })
    }
  })

router
  .route('/:id')
  .get((req, res) => { // 채널 개별 조회
    let {id} = req.params;
    id = parseInt(id);

    let SQL = `SELECT * FROM channels WHERE id = ?`;

    conn.query(SQL, id, 
      function (err, results) {
        if (results.length) {
          res.status(200).json(results);
        } else {
          notFoundChannelError(res);
        }
      }
    ); 
  })
  .put((req, res) => { // 채널 개별 수정
    let {id} = req.params;
    id = parseInt(id);

    var dbchannel = db.get(id);
    var oldChannelTitle = dbchannel.channelTitle;

    if (dbchannel) {
      var newChannelTitle = req.body.channelTitle;
      dbchannel.channelTitle = newChannelTitle;
      db.set(id, dbchannel);
      console.log(db);

      res.status(200).json({
        message : `채널명이 ${oldChannelTitle}에서 ${newChannelTitle}로 변경되었습니다.`
      })
    } else {
      notFoundChannelError();
    }
  }) 
  .delete((req, res) => { // 채널 개별 삭제
    console.log(db);
    let {id} = req.params;
    id = parseInt(id);
    var dbChannel = db.get(id);

    if (dbChannel) {
      db.delete(id);
      console.log(db);
      res.status(200).json({
        message : `${dbChannel.channelTitle} 채널이 삭제되었습니다.`
      });
    } else {
      notFoundChannelError();
    }
  }) 

function notFoundChannelError(res) {
  res.status(404).json({
    message : '채널을 찾지 못했습니다.'
  })
}

module.exports = router