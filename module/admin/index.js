const express = require('express');
const async = require('async');
const router = express.Router();

// 登录验证
router.use((req, res, next) => {
	if(!req.session.adminid) {
		res.redirect('/admin/login');
		return;
	}
	next();
});
//登录首页显示
router.get('/', (req, res) => {
	let data = {};
	data.adminname = req.session.adminname;
	async.waterfall([
		function(cb) {
			let sql1 = "select aname,atel,aemail from author limit 5";
			conn.query(sql1, (err, result) => {
				data.lists1 = result;
				cb(null);
			});

		},
		function(cb) {
			let sql2 = "select username,utel,addtimes from user limit 5";
			conn.query(sql2, (err, result) => {
				data.lists2 = result;
				cb(null);
			});
		}
	], (err, result) => {
		console.log(data)
		res.render('admin/index', data);
	})

});

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
	//任务一  查询总条数,任务二  查询当前页数要显示的记录
	//定义每页显示多少条
	let pagenum = 10;
	// 当前是第几页  默认页数是 1
	let page = req.query.page ? req.query.page : 1;
	(page < 1) && (page = 1);
	async.series({
		totalnums: function(cb) {
			let sql = 'SELECT COUNT(nid) AS totalnums FROM novel WHERE serial = 1 AND novelstatus = 1';
			conn.query(sql, (err, result) => {
				//判断当前也是是否大于总页数
				let totalpage = Math.ceil(result[0].totalnums / pagenum);
				if(page > totalpage) {
					page = totalpage;
				}
				cb(null, result[0].totalnums);
			});
		},
		booklist: function(cb) {
			//查询50条显示到页面上
			let sql = 'SELECT * FROM novel WHERE serial = 1 AND novelstatus = 1 LIMIT ?,?';
			conn.query(sql, [pagenum * (page - 1), pagenum], (err, results) => {
				cb(null, results);
			});
		}
	}, (err, data) => {
		// 传递页数
		data.page = page;
		//计算总页数  向上取整
		data.totalpage = Math.ceil(data.totalnums / pagenum);
		//要循环的页数 起始位置 和  结束位置  
		/*
		    End  -  start  = Showpage – 1
		    End  - Showpage +1 = start  
		    Start = page –(Showpage – 1)/2;  开始页数
		    End = page + (Showpage – 1)/2;   结束页数
		*/
		let showpage = 9;
		let start = page - (showpage - 1) / 2;
		let end = page * 1 + (showpage - 1) / 2;
		if(start < 1) {
			start = 1;
			end = start + showpage - 1;
		}
		if(end > data.totalpage) {
			end = data.totalpage;
			start = end - showpage + 1;
			if(start < 1) {
				start = 1;
			}
		}
		data.adminname = req.session.adminname;
		data.start = start;
		data.end = end;
		res.render('admin/bookfinish', data);
	});
});

//管理古代言情书籍
router.get('/ancientromance', (req, res) => {
	//任务一  查询总条数,任务二  查询当前页数要显示的记录
	//定义每页显示多少条
	let pagenum = 10;
	// 当前是第几页  默认页数是 1
	let page = req.query.page ? req.query.page : 1;
	(page < 1) && (page = 1);
	async.series({
		totalnums: function(cb) {
			let sql = 'SELECT COUNT(nid) AS totalnums FROM novel WHERE noveltype = "古代言情" AND novelstatus = 1';
			conn.query(sql, (err, result) => {
				//判断当前也是是否大于总页数
				let totalpage = Math.ceil(result[0].totalnums / pagenum);
				if(page > totalpage) {
					page = totalpage;
				}
				cb(null, result[0].totalnums);
			});
		},
		booklist: function(cb) {
			//查询50条显示到页面上
			let sql = 'SELECT * FROM novel WHERE noveltype = "古代言情" AND novelstatus = 1 LIMIT ?,?';
			conn.query(sql, [pagenum * (page - 1), pagenum], (err, results) => {
				cb(null, results);
			});
		}
	}, (err, data) => {
		// 传递页数
		data.page = page;
		//计算总页数  向上取整
		data.totalpage = Math.ceil(data.totalnums / pagenum);
		//要循环的页数 起始位置 和  结束位置  
		let showpage = 9;
		let start = page - (showpage - 1) / 2;
		let end = page * 1 + (showpage - 1) / 2;
		if(start < 1) {
			start = 1;
			end = start + showpage - 1;
		}
		if(end > data.totalpage) {
			end = data.totalpage;
			start = end - showpage + 1;
			if(start < 1) {
				start = 1;
			}
		}
		data.adminname = req.session.adminname;
		data.start = start;
		data.end = end;
		res.render('admin/ancientromance', data);
	});
});

//管理现代书籍
router.get('/modernromance', (req, res) => {
	//任务一  查询总条数,任务二  查询当前页数要显示的记录
	//定义每页显示多少条
	let pagenum = 10;
	// 当前是第几页  默认页数是 1
	let page = req.query.page ? req.query.page : 1;
	(page < 1) && (page = 1);
	async.series({
		totalnums: function(cb) {
			let sql = 'SELECT COUNT(nid) AS totalnums FROM novel WHERE noveltype = "现代言情" AND novelstatus = 1';
			conn.query(sql, (err, result) => {
				//判断当前也是是否大于总页数
				let totalpage = Math.ceil(result[0].totalnums / pagenum);
				if(page > totalpage) {
					page = totalpage;
				}
				cb(null, result[0].totalnums);
			});
		},
		booklist: function(cb) {
			//查询50条显示到页面上
			let sql = 'SELECT * FROM novel WHERE noveltype = "现代言情" AND novelstatus = 1 LIMIT ?,?';
			conn.query(sql, [pagenum * (page - 1), pagenum], (err, results) => {
				cb(null, results);
			});
		}
	}, (err, data) => {
		// 传递页数
		data.page = page;
		//计算总页数  向上取整
		data.totalpage = Math.ceil(data.totalnums / pagenum);
		//要循环的页数 起始位置 和  结束位置  
		/*
		    End  -  start  = Showpage – 1
		    End  - Showpage +1 = start  
		    Start = page –(Showpage – 1)/2;  开始页数
		    End = page + (Showpage – 1)/2;   结束页数
		*/
		let showpage = 9;
		let start = page - (showpage - 1) / 2;
		let end = page * 1 + (showpage - 1) / 2;
		if(start < 1) {
			start = 1;
			end = start + showpage - 1;
		}
		if(end > data.totalpage) {
			end = data.totalpage;
			start = end - showpage + 1;
			if(start < 1) {
				start = 1;
			}
		}
		data.adminname = req.session.adminname;
		data.start = start;
		data.end = end;
		res.render('admin/modernromance', data);
	});
});

//管理玄幻书籍
router.get('/fantasybook', (req, res) => {
	//任务一  查询总条数,任务二  查询当前页数要显示的记录
	//定义每页显示多少条
	let pagenum = 10;
	// 当前是第几页  默认页数是 1
	let page = req.query.page ? req.query.page : 1;
	(page < 1) && (page = 1);
	async.series({
		totalnums: function(cb) {
			let sql = 'SELECT COUNT(nid) AS totalnums FROM novel WHERE noveltype = "玄幻仙侠" AND novelstatus = 1';
			conn.query(sql, (err, result) => {
				//判断当前也是是否大于总页数
				let totalpage = Math.ceil(result[0].totalnums / pagenum);
				if(page > totalpage) {
					page = totalpage;
				}
				cb(null, result[0].totalnums);
			});
		},
		booklist: function(cb) {
			//查询50条显示到页面上
			let sql = 'SELECT * FROM novel WHERE noveltype = "玄幻仙侠" AND novelstatus = 1 LIMIT ?,?';
			conn.query(sql, [pagenum * (page - 1), pagenum], (err, results) => {
				cb(null, results);
			});
		}
	}, (err, data) => {
		// 传递页数
		data.page = page;
		//计算总页数  向上取整
		data.totalpage = Math.ceil(data.totalnums / pagenum);
		//要循环的页数 起始位置 和  结束位置  
		let showpage = 9;
		let start = page - (showpage - 1) / 2;
		let end = page * 1 + (showpage - 1) / 2;
		if(start < 1) {
			start = 1;
			end = start + showpage - 1;
		}
		if(end > data.totalpage) {
			end = data.totalpage;
			start = end - showpage + 1;
			if(start < 1) {
				start = 1;
			}
		}
		data.adminname = req.session.adminname;
		data.start = start;
		data.end = end;
		res.render('admin/fantasybook', data);
	});
});

//管理悬疑书籍
router.get('/suspensebook', (req, res) => {
	//任务一  查询总条数,任务二  查询当前页数要显示的记录
	//定义每页显示多少条
	let pagenum = 10;
	// 当前是第几页  默认页数是 1
	let page = req.query.page ? req.query.page : 1;
	(page < 1) && (page = 1);
	async.series({
		totalnums: function(cb) {
			let sql = 'SELECT COUNT(nid) AS totalnums FROM novel WHERE noveltype = "悬疑灵幻" AND novelstatus = 1';
			conn.query(sql, (err, result) => {
				//判断当前也是是否大于总页数
				let totalpage = Math.ceil(result[0].totalnums / pagenum);
				if(page > totalpage) {
					page = totalpage;
				}
				cb(null, result[0].totalnums);
			});
		},
		booklist: function(cb) {
			//查询50条显示到页面上
			let sql = 'SELECT * FROM novel WHERE noveltype = "悬疑灵幻" AND novelstatus = 1 LIMIT ?,?';
			conn.query(sql, [pagenum * (page - 1), pagenum], (err, results) => {
				cb(null, results);
			});
		}
	}, (err, data) => {
		// 传递页数
		data.page = page;
		//计算总页数  向上取整
		data.totalpage = Math.ceil(data.totalnums / pagenum);
		//要循环的页数 起始位置 和  结束位置  
		/*
		    End  -  start  = Showpage – 1
		    End  - Showpage +1 = start  
		    Start = page –(Showpage – 1)/2;  开始页数
		    End = page + (Showpage – 1)/2;   结束页数
		*/
		let showpage = 9;
		let start = page - (showpage - 1) / 2;
		let end = page * 1 + (showpage - 1) / 2;
		if(start < 1) {
			start = 1;
			end = start + showpage - 1;
		}
		if(end > data.totalpage) {
			end = data.totalpage;
			start = end - showpage + 1;
			if(start < 1) {
				start = 1;
			}
		}
		data.adminname = req.session.adminname;
		data.start = start;
		data.end = end;
		res.render('admin/suspensebook', data);
	});
});

//管理读者
router.get('/readermanage', (req, res) => {
	//任务一  查询总条数,任务二  查询当前页数要显示的记录
	//定义每页显示多少条
	let pagenum = 10;
	// 当前是第几页  默认页数是 1
	let page = req.query.page ? req.query.page : 1;
	(page < 1) && (page = 1);
	async.series({
		totalnums: function(cb) {
			let sql = 'SELECT COUNT(uid) AS totalnums FROM user WHERE userstatus=1';
			conn.query(sql, (err, result) => {
				//判断当前也是是否大于总页数
				let totalpage = Math.ceil(result[0].totalnums / pagenum);
				if(page > totalpage) {
					page = totalpage;
				}
				cb(null, result[0].totalnums);
			});
		},
		readerlist: function(cb) {
			//查询50条显示到页面上
			let sql = 'SELECT * FROM user WHERE userstatus=1 LIMIT ?,?';
			conn.query(sql, [pagenum * (page - 1), pagenum], (err, results) => {
				cb(null, results);
			});
		}
	}, (err, data) => {
		// 传递页数
		data.page = page;
		//计算总页数  向上取整
		data.totalpage = Math.ceil(data.totalnums / pagenum);
		//要循环的页数 起始位置 和  结束位置  
		let showpage = 9;
		let start = page - (showpage - 1) / 2;
		let end = page * 1 + (showpage - 1) / 2;
		if(start < 1) {
			start = 1;
			end = start + showpage - 1;
		}
		if(end > data.totalpage) {
			end = data.totalpage;
			start = end - showpage + 1;
			if(start < 1) {
				start = 1;
			}
		}
		data.adminname = req.session.adminname;
		data.start = start;
		data.end = end;
		res.render('admin/readermanage', data);
	});
});

//管理作者
router.get('/authormanage', (req, res) => {
	//任务一  查询总条数,任务二  查询当前页数要显示的记录
	//定义每页显示多少条
	let pagenum = 10;
	// 当前是第几页  默认页数是 1
	let page = req.query.page ? req.query.page : 1;
	(page < 1) && (page = 1);
	async.series({
		totalnums: function(cb) {
			let sql = 'SELECT COUNT(aid) AS totalnums FROM author WHERE authorstatus=1';
			conn.query(sql, (err, result) => {
				//判断当前也是是否大于总页数
				let totalpage = Math.ceil(result[0].totalnums / pagenum);
				if(page > totalpage) {
					page = totalpage;
				}
				cb(null, result[0].totalnums);
			});
		},
		authorlist: function(cb) {
			//查询50条显示到页面上
			let sql = 'SELECT * FROM author WHERE authorstatus=1 LIMIT ?,?';
			conn.query(sql, [pagenum * (page - 1), pagenum], (err, results) => {
				cb(null, results);
			});
		}
	}, (err, data) => {
		// 传递页数
		data.page = page;
		//计算总页数  向上取整
		data.totalpage = Math.ceil(data.totalnums / pagenum);
		//要循环的页数 起始位置 和  结束位置  
		/*
		    End  -  start  = Showpage – 1
		    End  - Showpage +1 = start  
		    Start = page –(Showpage – 1)/2;  开始页数
		    End = page + (Showpage – 1)/2;   结束页数
		*/
		let showpage = 9;
		let start = page - (showpage - 1) / 2;
		let end = page * 1 + (showpage - 1) / 2;
		if(start < 1) {
			start = 1;
			end = start + showpage - 1;
		}
		if(end > data.totalpage) {
			end = data.totalpage;
			start = end - showpage + 1;
			if(start < 1) {
				start = 1;
			}
		}
		data.adminname = req.session.adminname;
		data.start = start;
		data.end = end;
		res.render('admin/authormanage', data);
	});
});

module.exports = router;