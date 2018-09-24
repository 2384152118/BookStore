const express = require('express');
const async = require('async');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('admin/index');
})

router.get('/readermanage', (req, res) => {
	let data = {};
	let sql = 'SELECT * FROM user WHERE userstatus=1 ';

	conn.query(sql, (err, results) => {
		data.readerlist = results;
		console.log(data);
		res.render('admin/readermanage', data);
	});
})

//router.get('/authormanage', (req, res) => {
//let data = {};
//async.waterfall([
//	function(cb) {
//		let sql = 'SELECT * FROM author WHERE authorstatus = 1';
//		conn.query(sql, (err, results) => {
//			data.authorlist = results;
//			cb(null, data.authorlist);
//		});
//	}
//], (err, re) => {
//	for(let i = 0; i < re.length; i++) {
//		let sql = 'SELECT nname FROM novel WHERE novelstatus = 1 AND aid=?';
//		console.log(re[i]);
//		conn.query(sql, re[i].aid, (err, results) => {
//			re[i].novels = results;
//		})
//	}
//	res.render('admin/authormanage', data);
//});
//
//})

router.get('/authormanage', (req, res) => {
	let data = {};
	let sql = 'SELECT * FROM author WHERE authorstatus=1';
	conn.query(sql, (err, results) => {
		data.authorlist = results;
		res.render('admin/authormanage', data);
		console.log(data);

	});

});
//let sql = 'SELECT * FROM author WHERE authorstatus = 1';
//conn.query(sql, (err, results) => {
//data.authorlist = results;
//res.render('admin/authormanage', data);
//console.log(data);
//});

router.get('/bookfinish', (req, res) => {
	let data = {};
	let sql = 'SELECT * FROM novel WHERE serial = 1 AND novelstatus = 1';
	conn.query(sql, (err, results) => {
		data.booklist = results;
		res.render('admin/bookfinish', data);
		//		console.log(data);

	});

});

router.get('/ancientromance', (req, res) => {
	let data = {};
	let sql = 'SELECT * FROM novel WHERE noveltype = "古代言情" AND novelstatus = 1';
	conn.query(sql, (err, results) => {
		data.booklist = results;
		res.render('admin/ancientromance', data);
		console.log(data);
	});
})

router.get('/modernromance', (req, res) => {
	let data = {};
	let sql = 'SELECT * FROM novel WHERE noveltype = "现代言情" AND novelstatus = 1';
	conn.query(sql, (err, results) => {
		data.booklist = results;
		res.render('admin/modernromance', data);
		console.log(data);
	});
})

router.get('/fantasybook', (req, res) => {
	let data = {};
	let sql = 'SELECT * FROM novel WHERE noveltype = "玄幻" AND novelstatus = 1';
	conn.query(sql, (err, results) => {
		data.booklist = results;
		res.render('admin/fantasybook', data);
		console.log(data);
	});
})

router.get('/suspensebook', (req, res) => {
	let data = {};
	let sql = 'SELECT * FROM novel WHERE noveltype = "悬疑" AND novelstatus = 1';
	conn.query(sql, (err, results) => {
		data.booklist = results;
		res.render('admin/suspensebook', data);
		console.log(data);
	});

	//	res.render('admin/suspensebook');
})

//删除操作
router.get('/delbook', (req, res) => {
	let sql = 'UPDATE novel SET novelstatus = 0 WHERE nid = ? LIMIT 1';
	conn.query(sql, req.query.nid, (err, result) => {
		if(err) {
			console.log(err);
			res.json({
				r: 'db_err'
			});
			return;
		}
		res.json({
			r: 'success'
		});
	});
});

//读者管理
router.get('/stopreader', (req, res) => {
	let sql = 'UPDATE user SET userstatus = 0 WHERE uid = ? LIMIT 1';
	conn.query(sql, req.query.rid, (err, result) => {
		if(err) {
			console.log(err);
			res.json({
				r: 'db_err'
			});
			return;
		}
		res.json({
			r: 'success'
		});
	});
});

//作者管理
router.get('/stopauthor', (req, res) => {
	let sql = 'UPDATE author SET authorstatus = 0 WHERE aid = ? LIMIT 1';
	conn.query(sql, req.query.aid, (err, result) => {
		if(err) {
			console.log(err);
			res.json({
				r: 'db_err'
			});
			return;
		}
		res.json({
			r: 'success'
		});
	});
});

//管理完结书籍
router.get('/bookfinish', (req, res) => {
	let data = {};
	//当前页数
	let pagenum = 1;
	data.pagenum = pagenum;

	let page = req.query.page ? req.query.page : 1;
	data.page = page;
	async.series({
		count: function(callback) {
			let sql = 'SELECT COUNT(*) AS nums FROM novel WHERE serial = 1';
			conn.query(sql, (err, result) => {
				callback(null, result[0].nums);
			});
		},
		//      questions:function (callback) {
		//          //查询分类信息
		//          let sql = 'SELECT n.*, c.catename FROM questions AS q  LEFT JOIN category AS c ON q.cid = c.cid WHERE q.status = 1 LIMIT ?, ?';
		//          conn.query(sql, [pagenum*(page-1), pagenum], (err, results)=>{
		//              callback(null, results);
		//          });
		//      }
	}, (err, result) => {
		data.count = 10;
		data.questions = result.questions;
		res.render('admin/finishbook', data);
		console.log(data)
	});
});

module.exports = router;