/*
 *@create: ouli
 *@description 设置cookie
 *@date: 2011/1/5
 */
function setcookie(cookieName, cookieValue, seconds, path, domain, secure) {
    var expires = new Date();
    expires.setTime(expires.getTime() + seconds);
    document.cookie = escape(cookieName) + '=' + escape(cookieValue)
    + (expires ? '; expires=' + expires.toGMTString() : '')
    + (path ? '; path=' + path : '/')
    + (domain ? '; domain=' + domain : '')
    + (secure ? '; secure' : '');
}

/*
 *@create: ouli
 *@description 读取cookie
 *@date: 2011/1/5
 */
function getcookie(name) {
    var cookie_start = document.cookie.indexOf(name);
    var cookie_end = document.cookie.indexOf(";", cookie_start);
    return cookie_start == -1 ? '' : unescape(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
}



//加载批次分数线
function get_college_batchdata(provid, wl, year, num)
{
	$('#college_batchdata_body').html('<tr><td colspan="8">数据载入中...</td></tr>');
        var wl_name = '';
	switch(wl)
	{
		case '1' :
                    wl_name = '文科';
			break;
		case '2':
                    wl_name = '理科';
			break;
		case '3':
                    wl_name = '综合';
			break;
	}
	num = (typeof (num) == "undefined") ? 0 : num;
	$.getJSON(siteurl + "index.php?mod=college_api",{
		'action' : 'college_batchdata',
		'provid' : provid,
		'year' : year,
		'wl' : wl,
		'num' :num},
		function(data){	
			if (typeof (data) != "undefined" && data != '' && data != null) {
				var html = '';
                            var  allow_edit='';
				var bgcolor;
				for(var i=0; i<data.length; i++) {
					var row = data[i];
					if (!parseInt(row.score)) {
						row.score = '--';
					}
					bgcolor = (i%2) ? '#f0ffec' : '#FFF';
					html += '<tr><td>'+wl_name+'</td><td >'+row.name+'</td><td>'+row.score+'</td></tr>';
				}
				$('#college_batchdata_body').html(html);
			} else {
				$('#college_batchdata_body').html('<tr><td colspan="3">暂无数据</td></tr>');
			}
		});
}



//加载各省录取分数线
function get_college_score(collegeid, provid, wl, num)
{
	$('#collegescore_body').html('<tr><td colspan="8">数据载入中...</td></tr>');
	switch(wl)
	{
		case '1' :
			$('#wlinfo').html('文科分数线');
			break;
		case '2':
			$('#wlinfo').html('理科分数线');
			break;
		case '3':
			$('#wlinfo').html('综合分数线');
			break;
	}
	num = (typeof (num) == "undefined") ? 0 : num;

	$.getJSON(siteurl + "index.php?mod=college_api",{
		'action' : 'college_score',
		'provid' : provid,
		'college_id' : collegeid,
		'wl' : wl,
		'num' :num},
		function(data){	
			if (typeof (data) != "undefined" && data != '' && data != null) {
				var html = '';
                            var  allow_edit='';
				var bgcolor;
				for(var i=0; i<data.length; i++) {
					var row = data[i];
					if (!parseInt(row.score_min)) {
						row.score_min = '--';
					}
					if (!parseInt(row.score_max)) {
						row.score_max = '--';
					}
					if (!parseInt(row.score_avg)) {
						row.score_avg = '--';
					}
					if (!parseInt(row.score_td)) {
						row.score_td = '--';
					}
					if (!parseInt(row.plan)) {
						row.plan = '--';
					}

					row.batch = arr_batch[row.batch];
					bgcolor = (i%2) ? '#f0ffec' : '#FFF';

                                   if(allow_edit_data){
                                        var allow_edit = '<td><a href="javascript:void(0);" class="allow_edit" dataid="'+row.id+'">编辑</a></td>';
                                   }

					html += '<tr id = "score_row_' + row.id + '"><td id = "score_row_year_' + row.id + '">'+row.year+'</td><td id = "score_row_min_' + row.id + '">'+row.score_min+'</td><td id = "score_row_max_' + row.id + '">' + row.score_max + '</td><td id = "score_row_avg_' + row.id + '">'+row.score_avg+'</td><td id = "score_row_td_' + row.id + '">'+row.score_td+'</td><td id = "score_row_plan_' + row.id + '">'+row.plan+'</td><td id = "score_row_batch_' + row.id + '">'+row.batch+'</td>'+allow_edit+'</tr>';
				}
				$('#collegescore_body').html(html);

			} else {
				$('#collegescore_body').html('<tr><td colspan="9">暂无数据</td></tr>');
			}
		});		
}


//加载各省专业列表
function get_college_major(collegeid, provid, wl, year, num)
{
	$('#collegemajor_body').html('<tr><td colspan="8">数据载入中...</td></tr>');
	num = (num==undefined) ? 0 : num;
	$.getJSON(siteurl + "index.php?mod=college_api",{
		'action' : 'college_majordata',
		'provid' : provid,
		'college_id' : collegeid,
		'wl' : wl,
		'year' : year,
		'num' :num},
		function(data){
			var tbody = 'collegemajor_body';//显示专业内容的TBODY
			$('#'+tbody).html('');//首先清空默认显示内容
			if (typeof (data) != "undefined" && data != '' && data != null) {
                            var  html='';
                            var  allow_edit='';
                                   
				//计算合并列
				var tmp_type = new Array();
				for (var i=0; i<data.length; i++) {
					if (typeof (tmp_type[data[i].type]) == "undefined" || data[i].type == ''){
						tmp_type[data[i].type] = 1;
					}else{
						tmp_type[data[i].type] += 1;
					}
				}
				var html = '';
				for (var i=0; i<data.length; i++) {
					var row = data[i];
					if (!parseInt(row.score_min)) {
						row.score_min = '--';
					}
					if (!parseInt(row.score_max)) {
						row.score_max = '--';
					}
					if (!parseInt(row.score_avg)) {
						row.score_avg = '--';
					}

					var td = "";
					if (tmp_type[data[i].type] != 0){
						td = '<td rowspan='+tmp_type[data[i].type]+'>'+row.type+'</td>';
						tmp_type[data[i].type] = 0;
                                    }
					if(row.score_min==0) {row.score_min = '--';}
					switch(row.batch)
					{
						case '11':
							row.batch = '第一批';
							break;
						case '12':
							row.batch = '第二批';
							break;
						case '13':
							row.batch = '第三批';
							break;	
						case '21':
							row.batch = '专科';
							break;
					}

					if(row.majorid!='0' && row.majorid.length>4){
						var major_link = '<a href="'+siteurl+'major-'+row.majorid+'.html" target="_blank" class="schName" >'+row.majorname+'</a>';
					}else{
						var major_link = row.majorname;
					}

                                   if(allow_edit_data){
                                        var allow_edit = '<td><a href="javascript:void(0);" class="allow_edit" dataid="'+row.id+'">编辑</a></td>';
                                   }
					html = '<tr id = "major_row_' + row.id + '">'+td+'<td id = "major_row_category_' + row.id + '">'+row.category+'</td><td id = "major_row_link_' + row.id + '">&nbsp;' + major_link + '</td><td id = "major_row_avg_' + row.id + '">'+row.score_avg+'</td><td id = "major_row_max_' + row.id + '">'+row.score_max+'</td><td id = "major_row_min_' + row.id + '">'+row.score_min+'</td><td id = "major_row_batch_' + row.id + '">'+row.batch+'</td>'+allow_edit+'</tr>';
					$('#'+tbody).append(html);
				}
			} else {
				$('#'+tbody).html('<tr><td colspan="9">暂无数据</td></tr>');
			}
		});		
}

 function get_district_html(container,name,areaid,level){
		$.ajax({
		   type: "POST",
		   url: "admin.php?mod=ajax&action=reload_district_form&name="+name+"&level="+level+"&areaid="+areaid,
		   success: function(data){
				 if(data){
					$(container).html(data);
				}
		   }
		});
    }
