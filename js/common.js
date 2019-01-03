var content = $.extend({
	onEvent : "ontouchend" in document ? "tap" : "click",	//事件处理
	goTop : function(){		// 返回头部
		var gotopBtn = $(".juhe-to-top");
		var gotopBtn1 = $(".go-top-btn");
		$(window).scroll(function(){
			var sTop = $(window).scrollTop();
			var viewH = window.window.height;
			if( sTop > 200){
				gotopBtn.css("display",'block');
			}else{
				gotopBtn.css("display",'none');
			}
		});
		gotopBtn.on("touchstart" ,function(){
			$(window).scrollTop(0);
			return false;
		});
		gotopBtn1.on("touchstart" ,function(){
			$(window).scrollTop(0);
			return false;
		});
	},
	slider : function(){ 	// 弹层
		var cover = $('.cover'),
			zizhiBtn = $("#zizhiBtn"),
			scrollBox = $("#scroller"),
			scrollImgLen = scrollBox.find('img').length,
			num = 1;
		var t = new TouchSlider({	// 图片滑动
			id : 'scroller',
			begin : 0,
			after : function(index){
				num = index+1;
				cover.children('p').html(num+"/"+scrollImgLen);
			}
		});
		zizhiBtn.on(content.onEvent, function(){
			cover.css({zIndex:1001}).show();
			// cover.css({"top":$('body').scrollTop()+"px"});
			cover.children('p').html(num+"/"+scrollImgLen)//.css({"top":$(window).height()/2 + scrollBox.height()/2 + 30});
			scrollBox.css({"top":$(window).height()/2 - scrollBox.height()/2});
			document.addEventListener('touchmove',content.handle,false);
			return false;
		});
		cover.on(content.onEvent, function(){
			setTimeout(function(){
				cover.hide();
				document.removeEventListener('touchmove',content.handle,false);
			},300);
		});
	},
	handle : function(event){	// 阻止页面滑动
    	event.preventDefault();
	}

});
// 展开收缩
$.fn.shrink = function(opt){
	var opts = $.extend({
		oBtn : '.shrinkMoreBtn',
		oContent : '.shrinkContent',
		onStyle : 'active',
		isHeight : null ,
		getObj : "parents"
	}, opt);
	return this.each(function(index) {
		var that = $(this);
		var aBtn = that.find( opts.oBtn );
		var aContent = that.find( opts.oContent );
		if(aBtn.length != aContent.length){return}
		that.setShrinkSize({
			oBtn : opts.oBtn,
			oContent : opts.oContent,
			isHeight : opts.isHeight
		});
		that.delegate(opts.oBtn, content.onEvent, function(event){
			var _this = $(this);
			if(opts.getObj == "parents"){
				var oC = _this.parents( opts.oContent );
			}
			if(opts.getObj == "notParents"){
				var oC = that.find(opts.oContent)
			}
			if( !_this.attr("onOff") || _this.attr("onOff") == 'true' ){
				oC.height('auto');
				_this.attr("onOff", false).html("收起").addClass( opts.onStyle );
			}else{
				oC.height(opts.isHeight);
				_this.attr("onOff", true).html("展开").removeClass( opts.onStyle );
			}
		});
	});
};
// 设置展开收缩默认值
$.fn.setShrinkSize = function(o){
	var config = $.extend({
		oBtn : '',
		oContent : '',
		isHeight : null
	}, o);
	return this.each(function(index) {
		var that = $(this);
		var aB = that.find(config.oBtn), aC = that.find(config.oContent), iH = config.isHeight;
		for(var i=0,len=aB.length;i<len;i++){
			if(!aB.eq(i).attr("onOff")){
				if(aC.eq(i).height() > iH ){
					aC.eq(i).height(iH);
					aB.eq(i).attr("onOff", true).show();
				}else{
					aB.eq(i).attr("onOff", false).hide();
				}
			}
		}
	});
}


// 新加 2017年1月13日

// fix底部padding
var now_footer = $(".fix_footers.show");
var footer_h = now_footer.height();
$("body").css("paddingBottom",footer_h+'px');

// 可滑动tab
var $slideTabs = {
	tabs : function(ind){
		var $t = $("#z_tabs .tab_box li");
		var tindex = ind//$t.index();
		var $tab_box = $t.parents(".tab_box");

		$("#z_tabs").find(".z_ul").hide();
		$("#z_tabs .z_list").eq(tindex).find(".z_ul").show();
		// 移动
		if(tindex >0 ){
			var newLeft =  $t.eq(tindex-1).position().left
		}else{
			var newLeft = 0;
		}
		$slideTabs.tabSlide({focusObj : $t, tab_box : $tab_box });
		$tab_box.scrollLeft(newLeft);
	},
	tabSlide : function(obj){
		var $t = obj['focusObj'], $tab_box = obj['tab_box'];
		if($tab_box.scrollLeft() >40 && !$t.hasClass("prevbg")){
			$t.parents(".tabs").addClass("prevbg");
		}else{
			$t.parents(".tabs").removeClass("prevbg");
		}
		if($tab_box.scrollLeft() + $tab_box.width() < $t.parent("ul").width()-40){
			if(!$t.hasClass("nextbg")){
				$t.parents(".tabs").addClass("nextbg");
			}
		}else{
			$t.parents(".tabs").removeClass("nextbg");
		}
	},
	arrowDown : function(zind){
		$slideTabs.tabs(zind);
		$("#z_tabs .tab_down").addClass("hide");
		$("#z_tabs .tabs .arrow-down").removeClass("opened");
	}

};
// 列表纵向循环滚动
$.fn.listScroll = function(opts){
	var o = $.extend({
		ul : ".news-list"
	}, opts);
	var zul = o.ul , animateTime = o.animateTime;

	var $main = $(this);
	var obj_ul = $main.find(zul);
	var obj_li = $main.find("li");
	var li_length = obj_li.length
	var s = 0;
	if(li_length>1){
		setInterval(function(){
			obj_li.eq(s).attr("class","movein_top").siblings("li").attr("class","moveout_top");
			s++;
			s = ( s == li_length ) ? s = 0 : s;
		},2500);
	}
};

// 顶部搜索弹出
$.fn.showTopSearch = function(opts){
	var o = $.extend({
		main : ".juhe-warper" , 
		children : "section , header" , 
		search_box : ".juhe-search-warper" , 
		search_form : ".juhe-search-warper form" , 
		search_btn : ".juhe-search-warper .s-submit",
		cancel_btn : ".juhe-search-warper .juhe-search-cancel",
		cls_btn	: ".juhe-search-warper .juhe-search-cls" , 
		recent_search : ".juhe-search-warper .recent-search" , 
		class_check : ".juhe-search-warper .class-search",
		history_delete : ".recent-search .search-delete" , 
		search_input : ".juhe-search-warper .s-input" , 
		show_lx : ".juhe-search-warper .show_lx" , 
		historyAndHot : ".juhe-search-warper .search-tags-list" , 
		show_hide : "search_hide",
		animate : "movein_down" ,
		lx_href : "" , 
		search_href : "",
	}, opts);

	var main = o.main ,
		children = o.children , 
		search_box = o.search_box , 
		search_form = o.search_form , 
		search_btn = o.search_btn , 
		cancel_btn = o.cancel_btn , 
		cls_btn	= o.cls_btn , 
		recent_search = o.recent_search ,
		class_check = o.class_check , 
		history_delete = o.history_delete , 
		search_input = o.search_input , 
		show_lx = o.show_lx , 
		historyAndHot = o.historyAndHot , 
		show_hide = o.show_hide , 
		animate = o.animate , 
		lx_href = o.lx_href , 
		search_href = o.search_href;
	var childrens = $(main).children(children);
	// 显示
	$(this).on(content.onEvent, function(){
		childrens.addClass(show_hide);
		$(search_box).removeClass("hide "+show_hide).addClass(animate);
		var nowStorage = window.localStorage.searchhistory;
		if(nowStorage != undefined && nowStorage != ""){
			var newArray = nowStorage.split(',');
			var historys = "";
			if(newArray.length == 0){return;}
			for(var i = 0; i< newArray.length; i++){
				historys += "<li><a href='#'>"+newArray[i]+"</a></li>";
			}
			$(recent_search).removeClass("hide").find(".search-tags-list").html(historys);
		}
		setTimeout(function(){
			$(search_input).trigger(content.onEvent).focus();
		},300);
	});
	// 隐藏
	$(cancel_btn).on(content.onEvent, function(){
		childrens.removeClass(show_hide);
		$(search_box).addClass("hide").removeClass(animate);
		$.clsFun();
	});
	// 输入
	$(search_input).on("keyup , focus", function(){
		var search_val = $(search_input).val();
		if(search_val != ""){
			$(cls_btn).removeClass("hide");
			$.ajax({
				type: "POST",
				url : lx_href,
				data : search_val,
				success : function(data){
					// 以下为后台处理
					var show_list = "";
					// var data = ['11112','22223','33334','44445','11112','22223','33334','44445','11112','22223','33334','44445'];
					var data = eval("("+data+")");
					for(var i = 0; i < data.length; i++){
						if(data[i].indexOf(search_val)>-1){
							var newLi = "<li><a href='#'>"+data[i]+"</a></li>";
							show_list +=newLi;
						}
					}
					// 正式用时 下面改为 $(show_lx).find("ul").html(data);
					$(show_lx).find("ul").html(show_list);
				},
				error : function(){
					// alert("访问失败！");
					return;
				}
			})
		}else{
			$(cls_btn).addClass("hide");
			$(show_lx).find("ul").html("");
		}
	})
	// 输入框清空
	$(cls_btn).on(content.onEvent, function(){
		$.clsFun();
	});
	// 清空历史缓存
	$(history_delete).on(content.onEvent, function(){
		$.removeHistory({
			text : "您确定要清空么？",
			type : "searchhistory",
			recent_search: recent_search
		});
	});

	$(class_check).delegate("label", content.onEvent, function(){
		$(this).addClass("checked").parent("li").siblings("li").find("label").removeClass("checked");
	});
	// 历史/ 热门搜索
	$(historyAndHot).delegate("li", content.onEvent, function(){
		var this_val = $(this).text();
		$(search_input).val(this_val).focus();
		$.search({keywords:this_val});
	});
	// 联想列表
	$(show_lx).delegate("li", content.onEvent, function(){
		var this_val = $(this).text();
		$(search_input).val(this_val).focus();
		$.search({keywords:this_val});
	});

	// 搜索
	$(search_btn).on(content.onEvent, function(){
		var search_val = $.trim($(search_input).val());
		if(search_val == ""){
			return false;
		}else{
			$.search({keywords:search_val});
		}
	});
	// 输入框清空方法
	$.clsFun = function(){
		$(search_input).val("");
		$(cls_btn).addClass("hide");
		$(show_lx).find("ul").html("");
	};
	// 搜索方法
	$.search = function(keys){
		if(window.localStorage.searchhistory == undefined || window.localStorage.searchhistory == "" ){
			window.localStorage.searchhistory = keys.keywords.toString();
		}else{
			var nowStorage = window.localStorage.searchhistory.split(",");
			var hasThis = false;
			if( $.inArray(keys.keywords, nowStorage) > -1 ){
				hasThis = true;
			}
			if( !hasThis ){
				window.localStorage.searchhistory = window.localStorage.searchhistory + "," +keys.keywords.toString();
			}
		}
		var links = $(search_form).attr("action");
		var searchs = $(search_form).serialize();
		var newLink = links+"?"+ escape(searchs);//"?search=" + keys.keywords;
		setTimeout(function(){
			console.log(newLink)
			// window.location.href = newLink;
		},300);
	}

};

// 浏览记录清除

// 清除缓存
$.removeHistory = function(opts){
	var o = $.extend({
		text : "您确定要清空么？",
		type : "searchhistory",		// searchhistory:搜索历史 ； browsehistory: 浏览历史
		recent_search : ""		// searchhistory 执行用参数；

	},opts);
	layers.lay_confirm({
			id : "#qingkonghuancun",
			html : '<div class="layers" id="qingkonghuancun">'
						+ '<div class="layer_bg fadeIn_5"></div>'
						+ '<div class="layer_body scale3">'
							+ '<div class="layer_main">'
								+ '<p class="single_p">'+o.text+'</p>'
							+ '</div>'
							+ '<div class="layer_btn_box top_border cfx">'
							+ '</div>'
						+ '</div>'
					+ '</div>',
			btn : {
				btns: ['<a href="javascript:;" class="btns btn2">取消</a>', '<a href="javascript:;" class="btns btn2 font_blue">确定</a>'],
				funs: {
					0:function(){
						// 取消
						layerEvents.layerClose($("#qingkonghuancun"));
					},
					1:function(){
						// 确定
						switch(o.type){
							case "searchhistory" : {
								window.localStorage.searchhistory = "";
								$(o.recent_search).find("ul").html("");
								$(o.recent_search).addClass("hide");
							}; break;
							case "browsehistory" : {
								window.localStorage.browsehistory = "";
								
							}; break;
						}
						layerEvents.layerClose($("#qingkonghuancun"));
					}
				}
			}
		});
}

// 下拉筛选
$.fn.slide_ladder = function(opts){
	var o = $.extend({
		show_searchVal: ".juhe-header-search .search-text",
		first_menu : ".search-select-bar",
		juheLayerBg : "#juheLayerBg",
		all_layer : ".js_layer",
		first_list : ".js_slide_left .first_list",
		second_box : ".js_slide_left .second_box",
		second_list : ".js_slide_left .second_list",
		labels_list : ".js_slide_left .labels_list",
		show_title : ".sidebar-header .juhe-header-title",
		confirm : ".js_slide_left .sidebar-hd-right",
		confirm_btn : ".sldebar-hd-button",
		classify_form: "#classify_form",
		sizer_form  : "#sizer_form",
		urlObj      : ".juhe-search-tab #url",
		getSearch_keywords : ".search_keywords",
		getClassify : ".classify_val",
		getKeywords : ".keywords_val",
		price_box   : ".price-item-box",
		price_submit: ".price-item-box .js_sizer_submit",
		getPrice : ".juhe-search-tab #price",
		getOrder : ".juhe-search-tab #order",
		order_box   : ".order-item-box",
		order_submit: ".order-item-box .js_sizer_submit",
		classify_submit : ".js_slide_left .js_classify_submit"
	}, opts);
	var $main = $(this);
	var show_searchVal = $(o.show_searchVal),
		first_menu = $main.find(o.first_menu),
		sizer_li = first_menu.find("li"),
		juheLayerBg = $(o.juheLayerBg),
		all_layer = o.all_layer,
		first_list = $(o.first_list),
		second_box = $(o.second_box),
		second_list = $(o.second_list),
		labels_list = $(o.labels_list),
		show_title = $(o.show_title),
		confirm = $(o.confirm),
		confirm_btn = confirm.find(o.confirm_btn),
		classify_form= $(o.classify_form),
		sizer_form  = $(o.sizer_form),
		urlObj      = $(o.urlObj),
		getSearch_keywords = $(o.getSearch_keywords),
		getClassify = $(o.getClassify),
		getKeywords = $(o.getKeywords),
		price_box   = $(o.price_box),
		price_submit= $(o.price_submit),
		getPrice    = $(o.getPrice),
		getOrder    = $(o.getOrder),
		order_box   = $(o.order_box),
		order_submit= $(o.order_submit),
		classify_submit = $(o.classify_submit);
	// 筛选tab.弹出一级弹出
	sizer_li.on(content.onEvent, function(){
		$(this).siblings("li").removeClass("active");
		$(this).toggleClass("active");
		var showBox = $(this).attr("_show");
		$(all_layer).removeClass("show");
		if(!$(this).hasClass("active")){
			$.hideAll();
		}else{
			$(all_layer+showBox).addClass("show");
			var t_zIndex = $(all_layer+showBox).css("z-index");
			juheLayerBg.addClass("show").css("zIndex",t_zIndex-1);
		}
	});
	// 点击背景
	juheLayerBg.on(content.onEvent, function(){
		$.hideAll();
	});
	// 侧滑二级
	first_list.find("li").on(content.onEvent, function(){
		var pid = $(this).find("input[type=radio]").val();
		var templete = '<label><input type="radio" name="classify" value="'+pid+'" checked="checked" /><i>全部</i></label>';
		$.ajax({
			type : "POST",
			url  : "js/xiangmufenlei.json",
			data : { id : pid },
			success: function(data){
				// 二级分类
				var seconds = data['seconds'];
				for(var i = 0; i<seconds.length; i++){
					if(seconds[i]['pid'] == pid ){
						templete += '<label><input type="radio" name="classify" value="'+ seconds[i]['id'] +'" /><i>'+ seconds[i]['name'] +'</i></label>';
					}
				}
				second_list.height("auto").html(templete);
				second_list.find("label").on(content.onEvent, function(){
					// 热门关键词
					labels_list.html("");
					var tid = $(this).find("input[type=radio]").val();
					if(tid == pid){
						return;
					}
					var labels_templete = "";
					var labels = data['labels'];
					for(var i = 0; i<labels.length; i++){
						var hasID = labels[i]['ids'];
						for(var j = 0; j< hasID.length; j++ ){
							if( hasID[j] == tid ){
								labels_templete += '<label><input type="checkbox" name="keywords" value="'+ labels[i]['id'] +'" /><i>'+ labels[i]['name'] +'</i></label>';
							}
						}
					}
					labels_list.html(labels_templete);
				})
				var lH = second_list.height();
				if(lH>157){
					second_box.find(".shrinkMoreBtn").show();
				}else{
					second_box.find(".shrinkMoreBtn").hide();
				}
				second_box.shrink({
					oContent : ".second_list",
					isHeight : 152,
					getObj : "notParents"
				});
			}
		})
		var tname = $(this).text();
		first_list.addClass("hide");
		second_box.removeClass("hide");
		show_title.text(tname);
		confirm_btn.removeClass("hide");
		
	});

	// 项目分类
	classify_submit.on(content.onEvent, function(e){
		var search_keywords = getSearch_keywords.val() ,
				   classify = $("input[name=classify]:checked").val() ,
				  $keywords = $("input[name=keywords]:checked") ,
			   new_keywords = "";
		for(var i = 0; i< $keywords.length; i++){
			if(i == 0){
				new_keywords = $keywords.eq(i).val();
			}else{
				new_keywords += "," + $keywords.eq(i).val();
			}
		}
		getClassify.val( classify );
		getKeywords.val( new_keywords );
		setTimeout(function(){
			classify_form.submit();
		},300);

	});

	// 投资额度 / 排序
	price_submit.on(content.onEvent, function(){
		$.sizerFun();

	})
	order_submit.on(content.onEvent, function(){
		$(this).find("input[type=radio][name=orders]").prop("checked",true);
		$.sizerFun();
		


	})
	$.sizerFun = function(){
		var search_keywords = getSearch_keywords.val();
		var price_data = price_box.find("input[type=checkbox]:checked");
		var newPrice = [];
		for(var i = 0; i<price_data.length; i++){
			newPrice.push(price_data.eq(i).val());
		}
		getPrice.val(newPrice)
		var getPriceVal= newPrice.toString();
		var orderVal = $("input[type=radio][name=orders]:checked").val();
		getOrder.val(orderVal);
		// var GetRequest = $.GetRequest();
		// return false;
		// sizer_form.submit();

		setTimeout(function(){
			sizer_form.submit();
		},300);
	}

	// 获得url参数
	$.GetRequest = function() {
		var protocol = window.location.protocol ,
				host = window.location.host ,
			pathname = window.location.pathname ,
			new_link = protocol+"//"+host+pathname,
			url_arguments = window.location.search; //获取url中"?"符后的字串
		urlObj.val(new_link);  
		if( url_arguments.indexOf("?") != -1 ) { 
			var str = url_arguments.substr(1) ,
				strs = str.split("&") , 
				search_keywords = "" ,
				classify = "" ,
				keywords = [] ,
				price = [] ;
			for( var i = 0; i < strs.length; i ++ ) {
				var keyname = strs[i].split("=")[0],
					keyval = strs[i].split("=")[1];
				if( keyname == "search" ){
					search_keywords = unescape(keyval);
					if( search_keywords !="" ){
						show_searchVal.val( search_keywords );
						getSearch_keywords.val( search_keywords );
						if($(".juhe-search-box .s-input").length>0){
							$(".juhe-search-box .s-input").val( search_keywords );
						}
					}
				}
				if( keyname == "classify" ){
					classify = unescape( keyval );
					getClassify.val( classify );
				}
				if( keyname == "keywords" ){
					keywords.push( unescape(keyval) );
					getKeywords.val( keywords );
				}
				if( keyname == "price" ){
					var priceVal = unescape( keyval ),
						priceArr = priceVal.split(","),
						price_li = price_box.find("li");
					price.push( priceVal );
					for(k in priceArr ){
						for( var j = 0; j < price_li.length; j++ ){
							if( price_li.eq(j).find(".price_check").val() == priceArr[k] ){
								price_li.eq(j).find(".price_check").attr( "checked" , "checked" );
							}
							getPrice.val( price );
						}
					}
				}
				if( keyname == "order" ){
					var orderVal = unescape( keyval ),
						orderObj = $(".orders_check");
					for( var j = 0; j<orderObj.length; j++ ){
						if(orderObj.eq(j).val() == orderVal){
							getOrder.val(orderVal);
							orderObj.eq(j).prop("checked", true);
						}
					}
				}
			} 
		}
		return { "new_link" : new_link , "search_keywords" : search_keywords , "classify": classify , "keywords": keywords ,"price" : price , "order" : orderVal };
		
	} 

	// 额度投资
	$.GetRequest();
	// if(GetRequest['search_keywords']!=undefined){
	// 	getSearch_keywords.val(GetRequest['search_keywords']);
	// }
	// if(GetRequest['classify']!=undefined){
	// 	getClassify.val(GetRequest['classify']);
	// }
	// if(GetRequest['keywords']!=undefined){
	// 	getKeywords.val(GetRequest['keywords']);
	// }

	// 排序

	// 返回按钮
	$('.js_slide_left .sidebar-hd-left').on(content.onEvent, function(){
		if( first_list.hasClass("hide") ){
			first_list.removeClass("hide");
			second_list.html("");
			labels_list.html("");
			second_box.addClass("hide");
			show_title.text("项目分类");
			confirm_btn.addClass("hide");
			second_box.undelegate(".shrinkMoreBtn", content.onEvent);
		}else{
			$.hideAll();
		}
	});
	// 全部关闭
	$.hideAll = function(){
		juheLayerBg.removeClass("show");
		$(all_layer).removeClass("show");
		sizer_li.removeClass("active");
		first_list.removeClass("hide");
		second_box.addClass("hide");
		show_title.text("项目分类");
		confirm_btn.addClass("hide");
		second_list.html("");
		labels_list.html("");
	}

};

// 锚链
$.fn.showPointer = function(){
	var $t = $(this);
	$t.on(content.onEvent, function(){
		var th = $(this).attr("anchor");
		var firstTop = $("#"+$t.eq(0).attr("anchor")).position().top;
		var tTop = $("#"+th).position().top;
		$(window).scrollTop(tTop-firstTop);
		console.log(tTop-firstTop)
	});
	$(window).scroll(function(){
		var w_sTop = $(window).scrollTop();
		var w_height = $(window).height();
		var as = $t;
		var thisMod = 0;
		for(var i = 0; i< as.length; i++){
			var ta = as.eq(i).attr("anchor");
			var tmod = $("#"+ ta);
			var tTop = tmod.position().top;
			if(w_sTop < tTop && w_sTop+w_height > tTop){
				thisMod = i;
				break;
			}
		}
		as.eq(thisMod).addClass("active").siblings("a").removeClass("active");

	});
}


// 弹层

var layers = {
	lay_confirm : function(opts){
		var o = $.extend({
			id : null,
			html : '<div class="layers">'
						+ '<div class="layer_bg fadeIn_5"></div>'
						+ '<div class="layer_body scale3">'
							+ '<div class="layer_main">'
								+ '<p class="single_p">您确定要清空么？</p>'
							+ '</div>'
							+ '<div class="layer_btn_box top_border cfx">'
							+ '</div>'
						+ '</div>'
					+ '</div>',
			btn : {
				btns: [],
				funs: {
				}
			},
			delay: null
		}, opts);

		var layers  = o.html;
		
		$("body").append($(layers));
			// 计算位置
			if($(layers).hasClass("tips") == true){
				var lay_width = $(".tips:last-child").width();
				var lay_height = $(".tips:last-child").height();
				console.log(lay_width)
				$(".tips:last-child").css({
					marginTop: - lay_height/2 + "px",
					marginLeft: - lay_width/2 + "px"
				});

				setTimeout(function(){
					$(".tips:last-child").remove();
				},o.delay);
			}

		if(o.id == null){
			return;
		}
		// 写入按钮
		o.btn.btns.forEach(function(value, index){
			$(o.id).find(".layer_btn_box").append($(value));
		});
		// 绑定事件
		$(o.id).find(".layer_btn_box").children().each(function(index){
			$(this).on(content.onEvent, function(){
				var tindex = $(this).index();
				o.btn.funs[tindex]();
			})
		});


	}
}
var layerEvents = {
	layerClose : function(obj){
		if(obj){
			obj.find(".layer_body").addClass("scale_out3");
			obj.find(".layer_bg").hide(10);
			setTimeout(function(){
				obj.remove();
			},500);
		}else{
			$(".layers .layer_body").addClass("scale_out3");
			$(".layers .layer_bg").hide(10);
			setTimeout(function(){
				$(".layers").remove();
			},500);
		}
		
	},
	showMsg : function(htmls){
		layers.lay_confirm({
			id : "#tishi",
			html : htmls,
			btn : {
				btns: ['<a href="javascript:;" class="btns font_blue">确定</a>'],
				funs: {
					0:function(){
						// 取消
						layerEvents.layerClose($("#tishi"));
					}
				}
			}
		});
	},
	layoutTip : function(text){
		var templete = '<div class="layers" id="tishi">'
								+'<div class="layer_bg fadeIn_5"></div>'
								+'<div class="layer_body scale3">'
									+'<div class="layer_main">'
										+'<p class="single_p">'+text+'</p>'
									+'</div>'
									+'<div class="layer_btn_box top_border cfx">'
									+'</div>'
								+'</div>'
							+'</div>';
		layers.lay_confirm({
			id : "#tishi",
			html : templete,
			btn : {
				btns: ['<a href="javascript:;" class="btns font_blue">确定</a>'],
				funs: {
					0:function(){
						// 取消
						layerEvents.layerClose($("#tishi"));
					}
				}
			}
		});
	}
}

// 登陆注册
$.account = function(opts){
	var o = $.extend({
		main : "#shortCut_login",
		user : null,
		getCodeBtn : null,
		codeBtnDis : null,
		phoneNumber: null,
		login_link : "",
		submitBtn  : "input[type=submit]",
		yzm		   : null,
		submitDis  : "btn-active",
		passwordIpt : null,
		passwordIpt2: null,
		ageCheck   : null,
		showPassWord: null,
		yzmType		: null,
		mail 		: null
	}, opts);
	var isSend = 0;
	// window.localStorage.phoneNumber = "";
	// window.localStorage.getCode = "";

	// 获取验证码
	var isMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[0-9])[0-9]{8}$/;
	if( o.getCodeBtn != null ){
		$(o.main).find(o.getCodeBtn).on(content.onEvent, function(){
			var $t = $(this);
			if($t.hasClass("form-disable")){
				var htmls = '<div class="layers" id="tishi">'
								+'<div class="layer_bg fadeIn_5"></div>'
								+'<div class="layer_body scale3">'
									+'<div class="layer_main">'
										+'<p class="single_p">验证码已发送至您的手机！</p>'
									+'</div>'
									+'<div class="layer_btn_box top_border cfx">'
									+'</div>'
								+'</div>'
							+'</div>';
				layerEvents.showMsg(htmls);
				return;
			}
			var phoneNumber = $.trim($(o.main).find(o.phoneNumber).val());
			if(o.phoneNumber!=null && phoneNumber == ""){
				var htmls = '<div class="layers" id="tishi">'
								+'<div class="layer_bg fadeIn_5"></div>'
								+'<div class="layer_body scale3">'
									+'<div class="layer_main">'
										+'<p class="single_p">请输入手机号码！</p>'
									+'</div>'
									+'<div class="layer_btn_box top_border cfx">'
									+'</div>'
								+'</div>'
							+'</div>';
				layerEvents.showMsg(htmls);
			}else if( o.phoneNumber!=null && !isMobile.test(phoneNumber) ){
				var htmls = '<div class="layers" id="tishi">'
								+'<div class="layer_bg fadeIn_5"></div>'
								+'<div class="layer_body scale3">'
									+'<div class="layer_main">'
										+'<p class="single_p">手机号码不正确!</p>'
									+'</div>'
									+'<div class="layer_btn_box top_border cfx">'
									+'</div>'
								+'</div>'
							+'</div>';
				layerEvents.showMsg(htmls);
			}else if(o.phoneNumber!=null ){
				if (!o.yzmType){
					var data = {phoneNumber : phoneNumber};
				}else{
					var data = {phoneNumber : phoneNumber,yzmType : o.yzmType};
				}
				console.log(isSend);
				if(isSend && isSend == 1 ){
					return;
				}
				isSend = 1;

				$.ajax({
					type: "POST",
					url : o.login_link,
					data: data,
					success: function(data){
						getcode = data.code;
						var status = data.status;
						// "0" => "短信发送成功",
						// "-1" => "参数不全",
						// "-2" => "服务器空间不支持,请确认支持curl或者fsocket，联系您的空间商解决或者更换空间！",
						// "30" => "密码错误",
						// "40" => "账号不存在",
						// "41" => "余额不足",
						// "42" => "帐户已过期",
						// "43" => "IP地址限制",
						// "50" => "内容含有敏感词"

						var status = "0";
						// console.log("123")
						
						// setInterval(function(){
							isSend = 0;
						// },5000)
						switch(status){
							case "0" : 
									window.localStorage.phoneNumber = phoneNumber;
									window.localStorage.getCode = "0000";
									$t.addClass(o.codeBtnDis).text("重新获取 (60s)");
									var times = 5;
									window.timer = setInterval(function(){
										times--;
										if(times == 0){
											window.clearInterval(window.timer);
											$t.text("获取验证码").removeClass(o.codeBtnDis);
											// window.localStorage.getCode = "";
										}else{
											$t.text("重新获取 ("+times+"s)");
										}
									},1000);
									break;

							case  "-1"||"-2"||"30"||"40"||"41"||"42"||"43"||"50" : 
									var msg = data.msg;
									layerEvents.showMsg('<div class="layers" id="tishi">'
										+'<div class="layer_bg fadeIn_5"></div>'
										+'<div class="layer_body scale3">'
											+'<div class="layer_main">'
												+'<p class="single_p" style="padding:35px;">'+"<i class='ico-waring' style='margin:0 10px;'>!</i><span class='font-orange'>"+msg+"</span>"+'</p>'
											+'</div>'
											+'<div class="layer_btn_box top_border cfx">'
											+'</div>'
										+'</div>'
									+'</div>');
									break;

						}
						
					}
				})
			}

			if(o.mail !=null){
				if( $.trim($(o.mail).val()) == ""){
					var htmls = '<div class="layers" id="tishi">'
								+'<div class="layer_bg fadeIn_5"></div>'
								+'<div class="layer_body scale3">'
									+'<div class="layer_main">'
										+'<p class="single_p">请输入邮箱！</p>'
									+'</div>'
									+'<div class="layer_btn_box top_border cfx">'
									+'</div>'
								+'</div>'
							+'</div>';
					layerEvents.showMsg(htmls);
					return;
				}
				if( $(o.mail).val().indexOf("@")<0 || $(o.mail).val().indexOf(".")<0 || ($(o.mail).val().indexOf("@") > $(o.mail).val().indexOf(".") ) ){
					var htmls = '<div class="layers" id="tishi">'
								+'<div class="layer_bg fadeIn_5"></div>'
								+'<div class="layer_body scale3">'
									+'<div class="layer_main">'
										+'<p class="single_p">邮箱格式不正确！</p>'
									+'</div>'
									+'<div class="layer_btn_box top_border cfx">'
									+'</div>'
								+'</div>'
							+'</div>';
					layerEvents.showMsg(htmls);
					return;
				}

				$.ajax({
					type: "POST",
					url : o.login_link,
					data: {mail : $(o.mail).val()},
					success: function(data){
						getcode = data.code;
						var status = data.status;
						// "0" => "短信发送成功",
						// "-1" => "参数不全",
						// "-2" => "服务器空间不支持,请确认支持curl或者fsocket，联系您的空间商解决或者更换空间！",
						// "30" => "密码错误",
						// "40" => "账号不存在",
						// "41" => "余额不足",
						// "42" => "帐户已过期",
						// "43" => "IP地址限制",
						// "50" => "内容含有敏感词"

						switch(status){
							case "0" : 
									window.localStorage.phoneNumber = phoneNumber;
									window.localStorage.getCode = "0000";
									$t.addClass(o.codeBtnDis).text("重新获取 (60s)");
									var times = 5;
									window.timer = setInterval(function(){
										times--;
										if(times == 0){
											window.clearInterval(window.timer);
											$t.text("获取验证码").removeClass(o.codeBtnDis);
											// window.localStorage.getCode = "";
										}else{
											$t.text("重新获取 ("+times+"s)");
										}
									},1000);
									break;

							case  "-1"||"-2"||"30"||"40"||"41"||"42"||"43"||"50" : 
									var msg = data.msg;
									layerEvents.showMsg('<div class="layers" id="tishi">'
										+'<div class="layer_bg fadeIn_5"></div>'
										+'<div class="layer_body scale3">'
											+'<div class="layer_main">'
												+'<p class="single_p" style="padding:35px;">'+"<i class='ico-waring' style='margin:0 10px;'>!</i><span class='font-orange'>"+msg+"</span>"+'</p>'
											+'</div>'
											+'<div class="layer_btn_box top_border cfx">'
											+'</div>'
										+'</div>'
									+'</div>');
									break;

						}
						
					}
				})
				
				
			}
		});
	}

	
	// 验证码输入
	if(o.yzm != null){
		$(o.main).find(o.yzm).on("keyup", function(){
			if(o.yzm == null ){
				return false;
			}
			var t = $(this);
			var tVal = t.val();
			var phoneNumber = $.trim($(o.main).find(o.phoneNumber).val());
			if(phoneNumber !="" && tVal !="" && (o.ageCheck == null || $(o.main).find(o.ageCheck).prop("checked") == true)){
				$(o.main).find(o.submitBtn).addClass(o.submitDis).prop("disabled",false);
			}else{
				$(o.main).find(o.submitBtn).removeClass(o.submitDis).prop("disabled",true);
			}
		});
	}
	

	// 注册条款
	if(o.ageCheck != null){
		$(o.main).find(o.ageCheck).parents("label").on(content.onEvent, function(){
			console.log("11")
			if( $(o.main).find(o.ageCheck).prop("checked") == false || $(o.main).find(o.yzm).val() ==""){
				$(o.main).find(o.submitBtn).removeClass(o.submitDis);
			}else{
				$(o.main).find(o.submitBtn).addClass(o.submitDis);
			}
		})
	}

	// 显示密码
	if(o.showPassWord != null ){
		$(o.main).find(o.showPassWord).on(content.onEvent, function(){
			var passwordObj = $(o.main).find(o.passwordIpt);
			if(passwordObj.attr("type") =="password"){
				$(o.main).find(o.passwordIpt).attr("type","text");
			}else{
				$(o.main).find(o.passwordIpt).attr("type","password");
			}
		})
	}
	// 只有电话密码表单提交
	if( o.getCodeBtn == null && o.yzm == null && o.ageCheck == null && o.phoneNumber != null && o.passwordIpt != null ){
		var pN_ipt = $(o.main).find(o.phoneNumber);
		var pS_ipt = $(o.main).find(o.passwordIpt);
		var oS_btn = $(o.main).find(o.submitBtn);
		if($.trim(pN_ipt.val()) == "" || $.trim(pS_ipt.val()) == ""){
			oS_btn.addClass(o.submitDis).prop("disabled",false);

		}else{
			oS_btn.removeClass(o.submitDis).prop("disabled",false);
		}

		pN_ipt.on("keyup", function(){
			if( pN_ipt.val()!="" && pS_ipt.val()!=""){
				oS_btn.addClass(o.submitDis).prop("disabled",false);
			}else{
				oS_btn.removeClass(o.submitDis).prop("disabled",true);
			}
		});
		pS_ipt.on("keyup", function(){
			if( pN_ipt.val()!="" && pS_ipt.val()!=""){
				oS_btn.addClass(o.submitDis).prop("disabled",false);;
			}else{
				oS_btn.removeClass(o.submitDis).prop("disabled",true);
			}
		})
	}

	// 提交
	$(o.main).find(o.submitBtn).on('touchstart', function(event){
		var t = $(this);
		if( !t.hasClass(o.submitDis)){
			event.preventDefault();
			return false;
		}
		if(o.user != null){
			var user = $.trim($(o.main).find(o.user).val());
			if(user ==""){
				var showTip = $(o.main).find(o.user).attr("placeholder");
				var htmls = '<div class="layers" id="tishi">'
								+'<div class="layer_bg fadeIn_5"></div>'
								+'<div class="layer_body scale3">'
									+'<div class="layer_main">'
										+'<p class="single_p">'+showTip+'!</p>'
									+'</div>'
									+'<div class="layer_btn_box top_border cfx">'
									+'</div>'
								+'</div>'
							+'</div>';
				layerEvents.showMsg(htmls);
				event.preventDefault();
				return false;
			}
		}
		if(o.phoneNumber != null){

			var phoneNumber = $.trim($(o.main).find(o.phoneNumber).val());
			if( !isMobile.test(phoneNumber) ){
				var htmls = '<div class="layers" id="tishi">'
								+'<div class="layer_bg fadeIn_5"></div>'
								+'<div class="layer_body scale3">'
									+'<div class="layer_main">'
										+'<p class="single_p">手机号码不正确!</p>'
									+'</div>'
									+'<div class="layer_btn_box top_border cfx">'
									+'</div>'
								+'</div>'
							+'</div>';
				layerEvents.showMsg(htmls);
				event.preventDefault();
				return false;
			}
		}
		var getCode = window.localStorage.getCode;

		var inputCode = $(o.main).find(o.yzm).val();
		// 验证码验证
		if( o.yzm != null && getCode != inputCode){
			var htmls = '<div class="layers" id="tishi">'
							+'<div class="layer_bg fadeIn_5"></div>'
							+'<div class="layer_body scale3">'
								+'<div class="layer_main">'
									+'<p class="single_p">验证码不正确!</p>'
								+'</div>'
								+'<div class="layer_btn_box top_border cfx">'
								+'</div>'
							+'</div>'
						+'</div>';
			layerEvents.showMsg(htmls);
			event.preventDefault();
			return false;
		}
		//密码验证
		if(o.passwordIpt != null){
			var password = $(o.main).find(o.passwordIpt).val();
			if(password == "" || ( password.length<6 || password.length > 16 )){
				var htmls = '<div class="layers" id="tishi">'
								+'<div class="layer_bg fadeIn_5"></div>'
								+'<div class="layer_body scale3">'
									+'<div class="layer_main">'
										+'<p class="single_p">密码输入错误</p>'
									+'</div>'
									+'<div class="layer_btn_box top_border cfx">'
									+'</div>'
								+'</div>'
							+'</div>';
				layerEvents.showMsg(htmls);
				event.preventDefault();
				return false;
			}
		}
		// 确认密码
		if( o.passwordIpt2!= null){
			var password = $(o.main).find(o.passwordIpt).val();
			var password2 = $(o.main).find(o.passwordIpt2).val();
			if(password2 == "" || ( password2.length<6 || password2.length > 16 )){
				var htmls = '<div class="layers" id="tishi">'
								+'<div class="layer_bg fadeIn_5"></div>'
								+'<div class="layer_body scale3">'
									+'<div class="layer_main">'
										+'<p class="single_p">确认密码输入错误</p>'
									+'</div>'
									+'<div class="layer_btn_box top_border cfx">'
									+'</div>'
								+'</div>'
							+'</div>';
				layerEvents.showMsg(htmls);
				event.preventDefault();
				return false;
			}
			if( password != password2 ){
				var htmls = '<div class="layers" id="tishi">'
								+'<div class="layer_bg fadeIn_5"></div>'
								+'<div class="layer_body scale3">'
									+'<div class="layer_main">'
										+'<p class="single_p">两次密码不一致</p>'
									+'</div>'
									+'<div class="layer_btn_box top_border cfx">'
									+'</div>'
								+'</div>'
							+'</div>';
				layerEvents.showMsg(htmls);
				event.preventDefault();
				return false;
			}
		}
	});
}

//拨号打电话
$.fn.callKeFu = function(opts){
	var o = $.extend({
		phoneNumber : ""
	},opts);
	var $this = $(this);
	$(this).on(content.onEvent, function(){
		layers.lay_confirm({
			id : "#callKeFu",
			html : '<div class="layers" id="callKeFu">'
						+ '<div class="layer_bg fadeIn_5"></div>'
						+ '<div class="layer_body scale3">'
							+ '<div class="layer_main">'
								+ '<p class="single_p">'+o.phoneNumber+'</p>'
							+ '</div>'
							+ '<div class="layer_btn_box top_border cfx">'
							+ '</div>'
						+ '</div>'
					+ '</div>',
			btn : {
				btns: ['<a href="javascript:;" class="btns btn2">取消</a>', '<a href="javascript:;" class="btns btn2 font_blue">确定</a>'],
				funs: {
					0:function(){
						// 取消
						layerEvents.layerClose($("#callKeFu"));
					},
					1:function(){
						// 确定
						window.location.href = 'tel://' + o.phoneNumber;
						layerEvents.layerClose($("#callKeFu"));
					}
				}
			}
		});
	})
}

//倒计时
function lxfEndtime() {
	$(".lxftime").each(function() {
		var lxfday = $(this).attr("lxfday"); //用来判断是否显示天数的变量
		var endtime = new Date($(this).attr("endtime")).getTime(); //取结束日期(毫秒值)
		var nowtime = new Date().getTime(); //今天的日期(毫秒值)
		var youtime = endtime - nowtime; //还有多久(毫秒值)
		var seconds = youtime / 1000;
		var minutes = Math.floor(seconds / 60);
		var hours = Math.floor(minutes / 60);
		var days = Math.floor(hours / 24);
		var CDay = days;
		var CHour = hours % 24;
		var CMinute = minutes % 60;
		var CSecond = Math.floor(seconds % 60); //"%"是取余运算，可以理解为60进一后取余数，然后只要余数。
		if(CHour>9){CHour = CHour;} else
		if(CHour<10){CHour = '0'+CHour;}
		if(CMinute>9){CMinute = CMinute;} else
		if(CMinute<10){CMinute = '0'+CMinute;}
		if(CSecond>9){CSecond = CSecond;} else
		if(CSecond<10){CSecond = '0'+CSecond;}
		if (endtime <= nowtime){
			if ($(this).attr("lxfday") == "qt") {
				$(this).removeClass("djs").removeClass("js").addClass("qt").html("洽谈中");
				
			}else if($(this).attr("lxfday") == "js"){
				$(this).removeClass("djs").removeClass("qt").addClass("js").html("已结束"); //如果结束日期小于当前日期就提示过期啦
				
			}
		} else {
			if ($(this).attr("lxfday") == "no") {
				//$(this).html("<span>" + (days * 24 + CHour) + "</span><em>:</em><span>" + CMinute + "</span><em>:</em><span>" + CSecond + "</span>"); //输出没有天数的数据
			
				$(this).removeClass("qt").removeClass("js").addClass("djs").html("<em class='hours'>" + (parseInt(days * 24) + parseInt(CHour)) + "</em>:<em class='minutes'>" + CMinute + "</em>:<em class='seconds'>" + CSecond + "</em>");
			}else if($(this).removeClass("qt").removeClass("js").addClass("djs").attr("lxfday") == "1"){
				$(this).removeClass("qt").removeClass("js").addClass("djs").html("<em class='day'>" + days + "</em>天<em class='hours'>" + CHour + "</em>时<em class='minutes'>" + CMinute + "</em>分"); 
			}else if($(this).removeClass("qt").removeClass("js").addClass("djs").attr("lxfday") == "2"){
				$(this).removeClass("qt").removeClass("js").addClass("djs").html("倒计时：<em class='day'>" + days + "</em>天<em class='hours'>" + CHour + "</em>:<em class='minutes'>" + CMinute + "</em>"); 
			} else {
				$(this).removeClass("qt").removeClass("js").addClass("djs").html("距结束：<em class='day'>" + days + "</em>天<em class='hours'>" + CHour + "</em>时<em class='minutes'>" + CMinute + "</em>分<em class='seconds'>" + CSecond + "</em>秒"); //输出有天数的数据
			}
		}
	});
	setTimeout("lxfEndtime()", 1000);
};

/* 留言列表回复 */
$.postLy = function(opts){
	var o = $.extend({
		postId 		: "",
		postUrl 	: "",
		postHtml 	: ""
	}, opts);
	$.post( o.postUrl , { "postid" : o.postId , "msg" : o.postHtml }, function(data){
		if(data){
			layers.lay_confirm({
				id : "#liuyanchenggong",
				html : '<div class="layers call" id="liuyanchenggong">'
							+'<div class="layer_bg fadeIn_5"></div>'
							+'<div class="layer_body scale3">'
								+'<div class="layer_main textCenter">'
									+'<p class="font_red">留言成功！</p>'
								+'</div>'
								+'<div class="layer_btn_box cfx">'
								+'</div>'
							+'</div>'
						+'</div>',
				btn : {
					btns: ['<div class="js_close closeBtn1"></div>','<input type="button" class="red_btn"  value="我知道了">'],
					funs: {
						0:function(){
							layerEvents.layerClose($("#liuyanchenggong"));
							window.location.href=window.location.href;
						},
						1:function(){
							layerEvents.layerClose($("#liuyanchenggong"));
							window.location.href=window.location.href;
						}
					}
				}
			});
		}else{
			layer.msg("发送失败！",{
				icon: 2
			});
		}
	})
}

$.fn.msgBoard = function(opts){
	var o = $.extend({
		replyBtn 	: "",		// 打开留言板按钮
		lparent 	: "",		// 创建留言框的父容器
		postUrl 	: ""		// 提交路径
	}, opts);

	var $that 			= $(this), 
		$repBtn 	= o.replyBtn,
		$lparent 	= o.lparent,
		$liuyanmoban 	= '<div class="lyban clearfix">'
						+'<div class="content" contenteditable="true"></div>'
						+'<a href="javascript:;" class="submit_ly">提交</a>'
					+'</div>';
					//<a href="javascript:;" class="showBQList"><img src="./images/biaoqing/bqbtn.png" /></a>// 表情
	// 表情数据 start				
	var biaoqings = [
		{
			"name":"default",
			"val":[
				{"name":"微笑","img":"./images/biaoqing/1.png"},
				{"name":"微笑","img":"./images/biaoqing/1.png"},
				{"name":"微笑","img":"./images/biaoqing/1.png"},
				{"name":"微笑","img":"./images/biaoqing/1.png"},
				{"name":"微笑","img":"./images/biaoqing/1.png"},
				{"name":"微笑","img":"./images/biaoqing/1.png"},
				{"name":"微笑","img":"./images/biaoqing/1.png"},
				{"name":"微笑","img":"./images/biaoqing/1.png"},
				{"name":"微笑","img":"./images/biaoqing/1.png"},
				{"name":"微笑","img":"./images/biaoqing/1.png"},
				{"name":"微笑","img":"./images/biaoqing/1.png"},
				{"name":"微笑","img":"./images/biaoqing/1.png"},
				{"name":"微笑","img":"./images/biaoqing/1.png"},
				{"name":"微笑","img":"./images/biaoqing/1.png"},
				{"name":"微笑","img":"./images/biaoqing/1.png"},
				{"name":"微笑","img":"./images/biaoqing/1.png"},
				{"name":"微笑","img":"./images/biaoqing/1.png"}
			]
		}
		// ,
		// {
		// 	"name":"zidingyi1",
		// 	"val" :[
		// 		{"name":"微笑","img":"./images/biaoqing/1.png"},
		// 		{"name":"微笑","img":"./images/biaoqing/1.png"},
		// 		{"name":"微笑","img":"./images/biaoqing/1.png"},
		// 		{"name":"微笑","img":"./images/biaoqing/1.png"},
		// 		{"name":"微笑","img":"./images/biaoqing/1.png"}
		// 	]
		// }
	];
	// 表情数据 end

	$($repBtn).click(function(){
		var $t = $(this);
		var tId = $t.attr("data-id");	//回复ID
		$(".lyban").remove();
		$t.parents( $lparent ).after( $liuyanmoban );

		
		$(".lyban .content").focus(function(){

		});
		$(".lyban .submit_ly").on("click", function(){
			var postUrl = $("#submitLink").val(); 		// 发送路径
			var postHtml = $(".lyban .content").html();
			$.postLy({
				postId 		: tId,
	 			postUrl 	: postUrl,
	 			postHtml 	: postHtml
			});

		});

		$(".lyban .showBQList").on("click", function(){
			var $showBQBtn = $(this);
			var BQBtnT = $showBQBtn.offset().top;
			var BQBtnL = $showBQBtn.offset().left;

			var showBQTMP = '<div class="showBQ_wrap">';
			for(var i = 0; i< biaoqings.length; i++){
				var b1 = biaoqings[i];

				showBQTMP = showBQTMP + '<div class="showBQ_zW"><ul>';
				for(var j = 0; j< b1['val'].length; j++){

					var b2 		= b1['val'][j];
					var b2name 	= b2['name'];
					var b2img 	= b2['img'];

					showBQTMP 	= showBQTMP + '<li><img src="'+b2img+'" title="'+b2name+'" /></li>';
				}
				showBQTMP = showBQTMP + '</ul></div>';
			}
			showBQTMP = showBQTMP + '</div>';
			$("body").append(showBQTMP);
			$(".showBQ_wrap").css({
				top : BQBtnT+"px",
				left: BQBtnL+"px"
			});

			$(".showBQ_wrap").find("img").on("click", function(){
				var $tBQ = $(this);
				$(".lyban .content").add($tBQ)
			})

		});
	});
};

$(function(){
	lxfEndtime();
	// 顶部搜索 浮动变色
	var juhe_search = $(".juhe-index-warper .search-box");
	if(juhe_search.length>0){
		$(window).scroll(function(){
			var scTop = $(window).scrollTop();
			if(scTop>=30){
				juhe_search.addClass("fixed");
			}else{
				juhe_search.removeClass("fixed");
			}
		})
	}
	// 纵向列表循环滚动
	$(".news-list-wrapper").listScroll();

	// 搜索
	// $(".search-input").showTopSearch({
	// 	lx_href : "empty.php"
	// });

	// 搜索右侧下拉快捷菜单
	$(".juhe-header-icon-shortcut").on(content.onEvent, function(){
		$(".juhe-header-shortcut").toggleClass("hide");
	});
	// 返回上一页
	$("header .juhe-header-icon-back").on(content.onEvent, function(){
		window.history.go(-1);
	});
	// 回顶部
	content.goTop();

	// 关注
	$(".zongshu_footer .a2").on(content.onEvent, function(){
		var t = $(this);
		var isGZ = !t.hasClass("red_heart") ? true : false;

		$.ajax({
			type:"POST",
			data : {tryHeart : isGZ},
			url : "empty.php",
			success : function(data){
				var data = true;
				if(data == true){
					t.addClass("red_heart");
				}else{
					t.removeClass("red_heart");
				}
			},
			error : function(data){
				alert(data);
				return false;
			}
		})
	});

	// 拨打免费电话
	$(".zongshu_footer .a3, .my_ly .call").on(content.onEvent, function(){
		layers.lay_confirm({
			id : "#mianfeidianhua",
			html : '<div class="layers call" id="mianfeidianhua">'
						+'<div class="layer_bg fadeIn_5"></div>'
						+'<div class="layer_body scale3">'
							+'<div class="layer_main">'
								+'<h3>免费电话</h3>'
								+'<p>企业会自动回拨给您通话完全免费</p>'
								+'<input type="number" id="phoneNumber" class="mt25" placeholder="请输入您的手机号码!">'
							+'</div>'
							+'<div class="layer_btn_box cfx">'
							+'</div>'
						+'</div>'
					+'</div>',
			btn : {
				btns: ['<div class="js_close closeBtn1"></div>','<input type="button" value="免费电话">'],
				funs: {
					0:function(){
						// 取消
						var $layer = $(this).parents(".layers");
						layerEvents.layerClose($("#mianfeidianhua"));
					},
					1:function(){
						// 提交电话
						var isMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[0-9])[0-9]{8}$/;
						var phoneNumber = $.trim($("#phoneNumber").val());
						if(phoneNumber == ""){
							var htmls = '<div class="layers" id="tishi">'
											+'<div class="layer_bg fadeIn_5"></div>'
											+'<div class="layer_body scale3">'
												+'<div class="layer_main">'
													+'<p class="single_p">请输入手机号码！</p>'
												+'</div>'
												+'<div class="layer_btn_box top_border cfx">'
												+'</div>'
											+'</div>'
										+'</div>';
							layerEvents.showMsg(htmls);
							
						}else if( !isMobile.test(phoneNumber) ){
							var htmls = '<div class="layers" id="tishi">'
											+'<div class="layer_bg fadeIn_5"></div>'
											+'<div class="layer_body scale3">'
												+'<div class="layer_main">'
													+'<p class="single_p">手机号码不正确!</p>'
												+'</div>'
												+'<div class="layer_btn_box top_border cfx">'
												+'</div>'
											+'</div>'
										+'</div>';
							layerEvents.showMsg(htmls);
						}else{
							$.ajax({
								type: "POST",
								url : "/",
								data: {phoneNumber : phoneNumber},
								success: function(data){
									var data = true;
									if(data){
										layerEvents.layerClose($("#mianfeidianhua"));
										layers.lay_confirm({
											id : "#hujiaochenggong",
											html : '<div class="layers call" id="hujiaochenggong">'
														+'<div class="layer_bg fadeIn_5"></div>'
														+'<div class="layer_body scale3">'
															+'<div class="layer_main textCenter">'
																+'<p class="font_red">呼叫成功</p>'
																+'<p>请注意接听  '+phoneNumber+'</p>'
															+'</div>'
															+'<div class="layer_btn_box cfx">'
															+'</div>'
														+'</div>'
													+'</div>',
											btn : {
												btns: ['<div class="js_close closeBtn1"></div>','<input type="button" class="red_btn"  value="我知道了">'],
												funs: {
													0:function(){
														layerEvents.layerClose($("#hujiaochenggong"));
													},
													1:function(){
														layerEvents.layerClose($("#hujiaochenggong"));
													}
												}
											}
										});
									}
								}
							})
						}
					}
				}
			}
		});
		return false;
	});

	// 锚点
	$(".pointers a").showPointer();

	function chatQQ(){  
    /*1234567对应的就是需要聊天的客服*/  
    window.location.href = "mqqwpa://im/chat?chat_type=wpa&uin=1234567&version=1&src_type=web&web_src=oicqzone.com";  
} 
});


