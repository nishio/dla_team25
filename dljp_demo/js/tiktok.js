

 ;(function($,window, document, undefined){
	var pluginName = 'tiktok',
	defaults = {
		// animation speed
animateSpeed: 400,

// animation delay
delay: 200,

// theme color
themeColor  :'#0082e5',

// title color
titleColor : '#0082e5',

// done,alert,error,default
status : 'default',

// position
position : 'top',

// popbox, poptext, popload, floattip, poptip
type : null,

// custom content
content : {
  'title':'tip_title',
  'content':'tip_content',
  'picurl':null
},

// text for cancel button
buttonCancel: 'Cancel',

// text for confirm button
buttonConfirm: 'OK',

// alignment of header
headerAlign : 'center',

// alignment of content
contentAlign : 'center',

// ajax content
ajaxContentUrl: null,

// callbacks
onConfirm:null,
onCancel:null,
onBeforeShow: null,
onShow: null,
onHide: null
	};
	function Plugin(element,options) {
		this.element = $(element);
		this.settings = $.extend({},defaults,options);
		this._defaults = defaults;
		this._name = pluginName;
		this.mode = 'hide';
		this.init();
	}
	$.extend(Plugin.prototype,{
		init: function() {
			var obj = this,
			$e = this.element;
			switch(obj.settings.type){
				case 'floattip':
				if (isTouchSupported()) {
				  	$e.on('click' + '.' + pluginName, function(e) {
				  	  	obj.mode == 'hide' ? obj.show() : obj.hide();
				  	  	e.stopPropagation();
				  	});
				  	$(document).on('click', function() {
				  	 	if (obj.mode == 'show') {
				  	 	  	obj.hide();
				  	 	}
				  	});
				} else {
				  	$e.on('mouseover' + '.' + pluginName, function() {
				  	  	obj.show();
				  	});
				  	$e.on('mouseout' + '.' + pluginName, function() {
				  	  	obj.hide();
				  	});
				}
				break;
				default:break;
			}
		},
		tooltip: function() {
			var obj = this;
			if (!this.tiktok_bubble) {
				switch(obj.settings.type){
					case 'floattip':
						this.tiktok_bubble = $('<div id="tiktok-float" class="tiktok"><p class="tt-'+obj.settings.position+'"></p></div>');
					break;
					case 'poptip':
						this.tiktok_bubble = $('<div id="tiktok-tip" class="tiktok tt-status-'+obj.settings.status+' tiktok-float-'+obj.settings.position+'"><p></p><a href="javascript:void(0);" class="tt-close"></a></div>');
					break;
					case 'poptext':
						this.tiktok_bubble = $('<div id="tiktok-pop" class="tiktok"><div class="tt-bg"></div><div class="tt-box tt-text"><div class="tt-box-header"></div><p></p><div class="tt-button"><a href="javascript:void(0);" id="tt-btn-cancel" class="tt-status-default tt-button-single">'+obj.settings.buttonConfirm+'</a></div></div></div>');
					break;
					case 'popload':
						if(obj.settings.content.picurl){
							this.tiktok_bubble = $('<div id="tiktok-pop-loading" class="tiktok"><div class="tt-bg"></div><div class="tt-box"><img src="" alt=""><p></p></div></div>');
						}
						else if(!obj.settings.content.picurl){
							this.tiktok_bubble = $('<div id="tiktok-pop-loading" class="tiktok"><div class="tt-bg"></div><div class="tt-box"><div class="tt-img"></div><p></p></div></div>');
						}
					break;
					case 'popbox':
						this.tiktok_bubble = $('<div id="tiktok-pop" class="tiktok"><div class="tt-bg"></div><div class="tt-box"><div class="tt-box-header"></div><p></p><div class="tt-button">'+'</a><a href="javascript:void(0);" id="tt-btn-confirm" class="tt-status-default" data-bool="true">'+obj.settings.buttonConfirm+'</a></div></div></div>');
					break;
					default:break;
				}
			}
			return this.tiktok_bubble;
		},
		show: function() {
			var tiktok_bubble = this.tooltip(),
			obj = this,
			$e = this.element,
			$win = $(window);
			if ($.isFunction(obj.settings.onBeforeShow)) {
				obj.settings.onBeforeShow($(this));
			}
			switch(obj.settings.type){
				case 'floattip':
					tiktok_bubble.css({
						backgroundColor: obj.settings.themeColor
					}).hide();
					tiktok_bubble.find('p').html(obj.content().content);
					obj.timeout = window.setTimeout(function() {
						$e.after(tiktok_bubble);
						reposition(obj);
						$win.resize(function() {
							reposition(obj);
						});
						tiktok_bubble.stop(true, true).fadeIn(obj.settings.animateSpeed, function() {
					      		obj.mode = 'show';
					      		if ($.isFunction(obj.settings.onShow)) {
					        			obj.settings.onShow($(this));
					      		}
					    	});
					}, obj.settings.delay);
				break;
				case 'poptip':
					tiktok_bubble.find('p').html(obj.content().content);
					obj.timeout = window.setTimeout(function() {
						$e.after(tiktok_bubble);
						measurePL('.'+pluginName);
						$win.resize(function() {
							measurePL('.'+pluginName);
						});
						tiktok_bubble.stop(true, true).fadeIn(obj.settings.animateSpeed, function() {
					      		obj.mode = 'show';
					      		if ($.isFunction(obj.settings.onShow)) {
					        			obj.settings.onShow($(this));
					      		}
					    	});
						tiktok_bubble.find('.tt-close').on('click',function() {
							obj.hide();
						})
					}, obj.settings.delay);
				break;
				case 'poptext': case 'popbox':
					tiktok_bubble.find('.tt-box-header').css({
						backgroundColor: obj.settings.themeColor,
						textAlign: obj.settings.headerAlign
					});
					tiktok_bubble.find('p').css({
						textAlign: obj.settings.contentAlign
					});
					tiktok_bubble.hide();
					if (obj.content().title=='') {tiktok_bubble.find('.tt-box-header').remove();}
					else{tiktok_bubble.find('.tt-box-header').html(obj.content().title);}
					tiktok_bubble.find('p').html(obj.content().content);
					noScroll();
					obj.timeout = window.setTimeout(function() {
						$e.after(tiktok_bubble);
						if (tiktok_bubble.find('p').height()!=0) {
							tiktok_bubble.find('p').height(Math.min(tiktok_bubble.find('p').height(),document.body.clientHeight-200));
						}
						tiktok_bubble.stop(true, true).fadeIn(obj.settings.animateSpeed, function() {
					      		obj.mode = 'show';
					      		if ($.isFunction(obj.settings.onShow)) {
					        			obj.settings.onShow($(this));
					      		}
					    	});
						measurePT('.'+pluginName+' .tt-box');
						measurePL('.'+pluginName+' .tt-box');
						$win.resize(function() {
							measurePL('.'+pluginName+' .tt-box');
							measurePT('.'+pluginName+' .tt-box');
						});
						tiktok_bubble.find('#tt-btn-cancel').on('click',function() {
							$e.attr('data-bool',$(this).attr('data-bool'));
							if ($.isFunction(obj.settings.onCancel)) {
					        			obj.settings.onCancel($(this));
					      		}
							obj.hide();
						})
						tiktok_bubble.find('#tt-btn-confirm').on('click',function() {
							$e.attr('data-bool',$(this).attr('data-bool'));
							if ($.isFunction(obj.settings.onConfirm)) {
					        			obj.settings.onConfirm($(this));
					      		}
							obj.hide();
						})
					}, obj.settings.delay);
				break;
				case 'popload':
					tiktok_bubble.find('.tt-box').css({
						backgroundColor: obj.settings.themeColor
					});
					tiktok_bubble.hide();
					tiktok_bubble.find('p').html(obj.content().content);
					tiktok_bubble.find('img').attr('src',obj.content().picurl);
					noScroll();
					obj.timeout = window.setTimeout(function() {
						$e.after(tiktok_bubble);
						measurePL('.'+pluginName+' .tt-box');
						measurePT('.'+pluginName+' .tt-box');
						$win.resize(function() {
							measurePL('.'+pluginName+' .tt-box');
							measurePT('.'+pluginName+' .tt-box');
						});
						tiktok_bubble.stop(true, true).fadeIn(obj.settings.animateSpeed, function() {
					      		obj.mode = 'show';
					      		if ($.isFunction(obj.settings.onShow)) {
					        			obj.settings.onShow($(this));
					      		}
					    	});
					}, obj.settings.delay);
				break;
				default:break;
			};

		},
		hide:function() {
			var obj = this,
			tiktok_bubble = this.tooltip();
			window.clearTimeout(obj.timeout);
			obj.timegout = null;
			tiktok_bubble.stop(true,true).fadeOut(obj.settings.animateSpeed,function(){
				$(this).remove();
				if($.isFunction(obj.settings.onHide) && obj.mode == 'show') {
					obj.settings.onHide($(this));
				}
				obj.mode= 'hide';
			});
			canScroll();
		},
		destroy: function() {
			var $e = this.element;
			$e.off('.'+pluginName);
			$e.removeData(pluginName);
		},
		content: function() {
			var content,
		  	$e = this.element,
		  	obj = this,
		  	title = this._title;
			if (obj.settings.ajaxContentUrl) {
			  	content = $.ajax({
			    		type: "GET",
			    		url: obj.settings.ajaxContentUrl,
			    		async: false
			  	}).responseText;
			} else if (obj.settings.content) {
			  	content = obj.settings.content;
			}
			return content;
		},
		update: function(key,value) {
			var obj = this;
			if(value){
				obj.settings[key] = value;
			}else{
				return obj.settings[key];
			}
		}


	})
	function isTouchSupported() {
	  	var msTouchEnabled = window.navigator.msMaxTouchPoints;
	  	var generalTouchEnabled = "ontouchstart" in document.createElement("div");
	  	if (msTouchEnabled || generalTouchEnabled) {
	  	  	return true;
	  	}
	  	return false;
	}//检测是否移动端
	function measurePL(ele) {
		$(ele).css('margin-left',-$(ele).width()/2);
	}//重新测定元素的左右边距
	function measurePT(ele) {
		$(ele).css('margin-top',-$(ele).height()/2);
	}//重新测定元素的上下边距
	function noScroll() {
		var widthScroller = $('html').outerWidth()-$('html').innerWidth();
		$(document.body).css('border-right',widthScroller+'px solid transparent');
		$('html').css('overflow','hidden');
	}//禁止页面滚动
	function canScroll() {
		$(document.body).css('border-right','0');
		$('html').css('overflow','auto');
	}//恢复页面滚动
	function reposition(that) {
		var tiktok_bubble = that.tooltip(),
		$e = that.element,
		obj = that,
		$win = $(window);
		var eleT=$e.position().top;
		var eleL=$e.position().left;
		var eleW=$e.width();
		var eleH=$e.height();
		var eleMT=parseInt($e.css('marginTop'));
		var eleML=parseInt($e.css('marginLeft'));
		var floatW=tiktok_bubble.width();
		var floatH=tiktok_bubble.height();
		switch(obj.settings.position){
			case 'top':
			tiktok_bubble.css({'left':eleW/2+eleL,'top':eleT-18,'margin-left':eleML-floatW/2,'margin-top':eleMT-floatH});
			break;
			case 'bottom':
			tiktok_bubble.css({'left':eleW/2+eleL,'top':eleT+floatH+eleH+18,'margin-left':eleML-floatW/2,'margin-top':eleMT-floatH});
			break;
			case 'left':
			tiktok_bubble.css({'left':eleL-floatW-18+eleML,'top':eleT+floatH,'margin-left':0,'margin-top':eleMT-floatH});
			break;
			case 'right':
			tiktok_bubble.css({'left':eleL+eleW+18+eleML,'top':eleT+floatH,'margin-left':0,'margin-top':eleMT-floatH});
			break;
			default:break;
		}
	}//floattip重新定位
	$[pluginName] = $.fn[pluginName] = function(options) {
		var args = arguments;
		if(options === undefined || typeof options === 'object'){
			if(!(this instanceof $)){
				$.extend(defaults,options);
			}
			return this.each(function() {
				if(!$.data(this,'plugin_'+pluginName)){
					$.data(this,'plugin_'+pluginName, new Plugin(this,options));
				}
			});
		}else if(typeof options === 'string' && options[0]!== '_' && options !== 'init'){
			var returns;
			this.each(function() {
				var instance = $.data(this,'plugin_'+pluginName);
				if(!instance) {
					instance = $.data(this,'plugin_'+pluginName, new Plugin(this,options));
				}
				if(instance instanceof Plugin && typeof instance[options] === 'function'){
					returns = instance[options].apply(instance,Array.prototype.slice.call(args,1));
				}
				if(options === 'destroy'){
					$.data(this,'plugin_'+pluginName,null);
				}
			});
			return returns !== undefined ? returns : this;
		}
	};
})(jQuery,window,document);
