var express = require('express');
var router = express.Router();
let mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var moment = require('moment')

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


/* GET home page. */
router.get('/', (req, res, next) => {
  MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
    let dbo = db.db('breaddb')
    const limit = 3;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;
    const url = req.url == '/' ? '/?page=1' : req.url
    // const total = count.length;

    let filter = {};

    if (req.query.checkid && req.query.formid) {
      filter["_id"] = ObjectId(req.query.formid)
    }
    if (req.query.checkstring && req.query.formstring) {
      filter["string"] = req.query.formstring;
    }
    if (req.query.checkinteger && req.query.forminteger) {
      filter["integer"] = parseInt(req.query.forminteger);
    }
    if (req.query.checkfloat && req.query.formfloat) {
      filter["float"] = parseFloat(req.query.formfloat);
    }
    if (req.query.checkdate && req.query.formsdate && req.query.formedate) {
      filter["date"] = {
        "$gte": new Date(req.query.formsdate),
        "$lte": new Date(req.query.formedate)
      }
    }
    if (req.query.checkboolean && req.query.formboolean) {
      filter["boolean"] = req.query.formboolean
    }
    // console.log(filter);

    dbo.collection('paket').find(filter).count(function (err, count) {
      // console.log(filter)
      dbo.collection('paket').find(filter).limit(limit).skip(offset).toArray(function (err, result) {
        let pages = Math.ceil(count / limit);
        res.render('index', {
          result,
          query: req.query,
          page,
          pages,
          limit,
          offset,
          url,
          moment
        })
      })
    })
  })
})

// keadaan filter
//   MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
//     let dbo = db.db('breaddb')
//     dbo.collection('paket').find(filter).toArray((err, result) => {
//       // console.log(result);

//       if (err) throw err
//       console.log(req.query);
//       res.render('index', {
//         result,
//         query: req.query,
//         moment
//       })
//     })
//   })
// })

// kondisi awal
// router.get('/', (req, res, next) => {
//   MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
//     let dbo = db.db('breaddb')
//     dbo.collection("paket").find({}).toArray(function (err, result) {
//       if (err) throw err;
//       res.render('index', {
//         result,
//         moment
//       });
//     });
//   });
// })


router.get('/add', (req, res, next) => {
  res.render('add')
})

router.post('/add', (req, res, next) => {
  MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
    let dbo = db.db('breaddb')
    // cara merubah id secara randaom
    // let data = { _id: Math.ceil(Math.random() * 100), string: req.body.string, integer: req.body.integer, float: req.body.float, date: req.body.date, boolean: req.body.boolean }
    let data = { string: req.body.string, integer: parseInt(req.body.integer), float: parseFloat(req.body.float), date: new Date(req.body.date), boolean: req.body.boolean }
    dbo.collection('paket').insertOne(data, (err, result) => {
      if (err) throw err
      res.redirect('/')
    })
  })
})


router.get('/edit/:id', (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
    let dbo = db.db('breaddb')
    // console.log(id);
    dbo.collection('paket').findOne({ _id: ObjectId(req.params.id) }, (err, result) => {
      if (err) throw err
      console.log(result);
      res.render('edit', {
        item: result,
        moment
      })
    })
  })
})


router.post('/edit/:id', (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
    let dbo = db.db('breaddb')
    let id = { _id: ObjectId(req.params.id) }
    // console.log(id);
    let data = { $set: { 'string': req.body.string, 'integer': req.body.integer, 'float': req.body.float, 'date': req.body.date, 'boolean': req.body.boolean } }
    // console.log(data);
    dbo.collection('paket').updateOne(id, data, (err, result) => {
      if (err) throw err
      res.redirect('/')
    })
  })
})


router.get('/delete/:id', (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
    let dbo = db.db('breaddb')
    let id = { _id: ObjectId(req.params.id) }
    // console.log(id);
    dbo.collection('paket').deleteOne(id, (err) => {
      if (err) throw err
      res.redirect('/')
    })
  })
})

// value="<%= query.formsdate ? moment(query.formsdate).format('YYYY-MM-DD') : '' %>">


module.exports = router;

