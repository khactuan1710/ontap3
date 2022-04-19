var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const {log} = require("debug");
const  db ="mongodb+srv://khactuan2312:khactuan@cluster0.dhfhw.mongodb.net/ontap?retryWrites=true&w=majority";
const multer = require('multer');

mongoose.connect(db).catch(error => {
  console.log("co loi xay ra" + error);
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET list page. */
router.get('/List', function (req, res, next) {
  oto.find({}, function (err, data) {
    if (err == null) {
      res.render('listcar', {title: 'ListAll', data: data});
    } else {
      console.log(err.message);
    }
  })
});

/* GET update page. */
router.get('/update', function (req, res, next) {
  res.render('update', {title: 'Update',message:""});
});


const otoModel = new mongoose.Schema({
  _id: "string",
  _nhanhieu: "string",
  _namsx: "string",
  _ngaynhap: "string",
  _gia: "string",
  _image: "string",
});
let _imageName = "";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/')
  },
  filename: function (req, file, cb) {
    _imageName = Date.now() + ".jpg";
    cb(null, _imageName);
  }
});
function fileFilter(req, file, cb) {
  if (file.mimetype === 'image/jpeg') {
    cb(null, true)
  } else {
    cb(new Error('K phai duoi jpg!'));
  }
}
const oto = mongoose.model("ontap", otoModel);
var upload = multer({storage: storage, fileFilter: fileFilter});

router.post('/add', upload.single("profile_pic"), function (req, res, next) {
  let _id = req.body._id;
  let _nhanhieu = req.body._nhanhieu;
  let _namsx = req.body._namsx;
  let _ngaynhap = req.body._ngaynhap;
  let _gia = req.body._gia;
  let _image = req.file;
  console.log(req.file, "file")
  if (!_image) {
    const err = new Error("Chua chon file");
    return next(err);
  }
  const data = new oto({
    _id: _id,
    _nhanhieu: _nhanhieu,
    _namsx: _namsx,
    _ngaynhap: _ngaynhap,
    _gia: _gia,
    _image: _imageName,
  });
  console.log(data, 'data')

  data.save(function (err) {
    if (err == null) {
      mess = "Add thanh cong!";
      console.log(mess);
      res.render('index', {title: 'ListAll', message:mess});

    } else {
      mess = "Add that bai!";
      console.log(mess);
      console.log(err.message);
      res.render('index', {title: 'Submit', message: mess});
    }
  })
});

router.post("/getOto", function (req, res,) {
  let _id = req.body._id;
  console.log(req.body._id, 'body ===>')
  oto.findOne({_id: _id}, function (err, data) {
    if (err == null) {
      console.log("thanh cong", data)
      res.send({
        trangThai: 0,
        data: data
      });
    } else {
      console.log("that bai")
      res.send({
        trangThai: 1
      });
      console.log(err.message);
    }
  })
})




router.post("/delete", function (req, res,) {
  let _id = req.body.id;
  console.log(req.body, "body delete")
  oto.deleteOne({_id: _id}, function (err) {
    if (err == null) {
      console.log("xoa thanh cong")
      res.send({
        trangThai: 0
      });
    } else {
      res.send({
        trangThai: 1
      });
      console.log(err.message);
    }
  })
})

router.post("/Update", function (req, res,) {
  let _id = req.body._id;
  let _nhanhieu = req.body._nhanhieu;
  let _namsx = req.body._namsx;
  let _ngaynhap = req.body._ngaynhap;
  let _gia = req.body._gia;
  let _image = req.body._image;
  console.log(req.body, 'body updatre')

  oto.updateOne({_id: _id},{_nhanhieu: _nhanhieu,_namsx:_namsx,_ngaynhap:_ngaynhap, _gia: _gia, _image: _image}, function (err) {
    if (err == null) {
      console.log("update thanh cong")
      res.send({
        trangThai: 0,
      });
    } else {
      res.send({
        trangThai: 1
      });
      console.log(err.message);
    }
  })

})

// search
router.post("/Find", function (req, res,) {
  let _id = req.body.timKiem;
  oto.findOne({_id: _id}, function (err, data) {
    if (err == null) {
      if (data == null) {
        res.render("Find", {title: "Find", data: null, message: "K tim thay!"});
      } else {
        console.log(data);
        res.render("Find", {title: "Find", data: data, message: "Da tim thay!"});
      }
    } else {
      res.send({
        trangThai: 1
      });
      console.log(err.message);
    }
  })
})

module.exports = router;
