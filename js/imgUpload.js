var img_arr = new Array();
 // *******************************实例引用 开始
   //相关图片
 $(".otherPic").on('change','#other_inputFile',function () {
	$(this).resizeImage({
		that:this,
		cutWid:'',
		quality:0.6,
		limitWid:710,
		success:function (data) {
			var len = $('#showOtherImage').find('img').size();
			img_arr[len] = data.base64;
			var img = '<div class="position_relative display-inlineBlock img-box" style="float:left;">' +
				'<img src="' + img_arr[len] + '">' +
				'<span class="deletedImages" sid="' +len+ '" id="other_img_'+len+'">X</span>'+
				'</div>';
			$('#showOtherImage').append(img);
			if(img_arr.length == 2){
				$('#openIdCardImg').hide();
				return false;
			}
		}
	});
	this.value = '';
 });
 
 //删除相关图片
 $(".otherPic").on('click','.deletedImages',function () {
	var sid = $(this).attr('sid');
 
	img_arr.splice(sid,1);
	$(this).parent().remove();
 
	$('#showOtherImage').html('');
	for( var i=0; i < img_arr.length; i++) {
		var img = '<div class="position_relative display-inlineBlock img-box" style="float:left;">' +
			'<img src="' + img_arr[i] + '">' +
			'<span class="deletedImages" sid="' +i+ '" id="other_img_' +i+ '">X</span>'+
			'</div>';
		$('#showOtherImage').append(img);
	}
 
	if(img_arr.length < 9){
		$('#openIdCardImg').show();
	}else{
		$('#openIdCardImg').hide();
	}
 });

  // *******************************实例引用 结束
 
/*
 * 裁剪图片
 * $(id).resizeImage({
 * that:this, //当前图片对象
 * cutWid:'', //裁剪尺寸
 * quality:0.6, //图片质量0~1
 * limitWid:400, //最小宽度
 * success:function (data) {
 * do something... 
 * }
 * })
 *
 * */
 $.fn.resizeImage = function (obj) {
	 var file = obj.that.files[0];
	 var URL = window.URL || window.webkitURL;
	 var blob = URL.createObjectURL(file);
	 var base64;
	 
	 var img = new Image();
	 img.src = blob;
	 
	 if(!/image\/\w+/.test(obj.that.files[0].type)){
		$.toast("请上传图片！",1000);
		return false;
	 }
	 
	 img.onload = function() {
		if(img.width < obj.limitWid){
			$.toast('图片宽度不得小于'+ obj.limitWid +'px',1000);
			return false;
		}
		var that = this;
	 
		//生成比例
		var w,scale,h = that.height;
		if(obj.cutWid == ''){
			w = that.width;
		}else{
			w = obj.cutWid;
		}
		scale = w / h;
		h = w / scale;
	 
		//生成canvas
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		$(canvas).attr({
			width: w,
			height: h
		});
		ctx.drawImage(that, 0, 0, w, h);
	 
		// 生成base64
		base64 = canvas.toDataURL('image/jpeg', obj.quality || 0.8);
		var result = {
			base64:base64
		};
	 
		//成功后的回调
		obj.success(result);
	 };
 };