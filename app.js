var do_lc_bind_event = function(){
	$("#btn_valid").off("click")
	$("#btn_valid").on("click", function(){
		do_lc_load_result();
	})

	$("#btn_export").off("click")
	$("#btn_export").on("click", function(){
		do_lc_get_result();
	})
}

var do_lc_read_file = function(domInput){
	return new Promise(resolve => {
		var file	 	= $(domInput)[0].files[0];
		if(file == null)	return null;
		var reader  	= new FileReader();
		reader.readAsText(file);
		resolve(reader);
	});
}

var do_lc_show_result = function(obj){
	var source 		= $("#document-template").html();
	var template 	= Handlebars.compile(source);
	var html 		= template(obj);
	$('#div_results').html(html);
}

var do_lc_load_result = async function(){
	var tab		= [];
	var j_src 	= {};
	var j_des 	= {};

	var obj_src = await do_lc_read_file("#file_source");
	var obj_des = await do_lc_read_file("#file_existe");
	setTimeout(() => {
		if(obj_src != null)	j_src = JSON.parse(obj_src.result);
		if(obj_des != null)	j_des = JSON.parse(obj_des.result);

		for(var key in j_src){
			var item = {};
			item.key = key;
			item.fr  = j_src[key];
			item.uk  = j_des[key];

			tab.push(item);
		}

		do_lc_show_result(tab);
	}, 1000);
}

var do_lc_get_result = function(){
	var result_source 			= {};
	var result_traduction 		= {};
	var lstTr 					= $("#tab_result tbody tr");
	$.each(lstTr, function(i, e){
		var key 				= $(e).find(".key").html();
		var source  			= $(e).find(".source").html();
		var traduction  		= $(e).find(".traduction").html();
		result_source[key] 		= source;
		result_traduction[key] 	= traduction;
	})

	do_lc_download_file("_src", result_source);
	do_lc_download_file("_tra", result_traduction);
}

var do_lc_download_file = function(filename, data){
	var fr_str 		= JSON.stringify(data);
	var dataUri 	= 'data:application/json;charset=utf-8,'+ encodeURIComponent(fr_str);
	
	var link 		= document.createElement('a');
    link.setAttribute("type", "hidden"); // make it hidden if needed
    link.download 	= filename + '.json';
    link.href 		= dataUri;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

do_lc_bind_event();
