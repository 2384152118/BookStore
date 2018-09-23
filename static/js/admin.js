$(function() {

	//完结书本删除
	$('.mytable').on('click', '.delbook', function() {
		console.log($(this).attr('nid'));
		if(confirm("确定删除该书籍吗？")) {
			let nid = $(this).attr('nid');
			$.ajax({
				url: '/admin/delbook',
				type: 'GET',
				dataType: 'JSON',
				data: {
					nid: nid
				},
				success: function(result) {
					console.log(result);
					if(result.r == 'success') {
						window.location.reload();
					}
				}
			});
		}
	});

	//禁止读者登录
	$('.readertable').on('click', '.readerstop', function() {
		console.log($(this).attr('rid'));
		if(confirm("确定禁止该读者登录吗？")) {
			let rid = $(this).attr('rid');
			$.ajax({
				url: '/admin/stopreader',
				type: 'GET',
				dataType: 'JSON',
				data: {
					rid: rid
				},
				success: function(result) {
					console.log(result);
					if(result.r == 'success') {
						window.location.reload();
					}
				}
			});
		}
	});
	
	//禁止作者登录
	$('.authortable').on('click', '.authorstop', function() {
		console.log($(this).attr('aid'));
		if(confirm("确定禁止该作者登录吗？")) {
			let aid = $(this).attr('aid');
			$.ajax({
				url: '/admin/stopauthor',
				type: 'GET',
				dataType: 'JSON',
				data: {
					aid: aid
				},
				success: function(result) {
					console.log(result);
					if(result.r == 'success') {
						window.location.reload();
					}
				}
			});
		}
	});
	
});