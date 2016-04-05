/* 定义事件处理程序，兼容IE + Chrome */
var EventUtil = { 
  
    getEvent: function(event){ 
            return event ? event : window.event; 
        }, 
     
    getTarget: function(event){ 
        return event.target || event.srcElement; 
    }, 
     
    preventDefault: function(event){ 
        if (event.preventDefault){ 
            event.preventDefault(); 
        } else { 
            event.returnValue = false; 
        } 
    },
    stopPropagation: function(event){
        if (event.stopPropagation){ 
            event.stopPropagation(); 
        } else { 
            event.cancelBubble = true; 
        } 
    },
    addHandler: function(element, type, handler){ 
        if (element.addEventListener){ 
            element.addEventListener(type, handler, false); 
        } else if (element.attachEvent){ 
            element.attachEvent("on" + type, handler); 
        } else { 
            element["on" + type] = handler; 
        } 
    }, 
    removeHandler: function(element, type, handler){ 
        if (element.removeEventListener){ 
            element.removeEventListener(type, handler, false); 
        } else if (element.detachEvent){ 
            element.detachEvent("on" + type, handler); 
        } else { 
            element["on" + type] = null; 
        } 
    } 
 
};     
/* DOM基本数据查询 */
function $(name){
	return document.getElementById(name);
}

function create(ele){
	return document.createElement(ele);
}

/* Ajax get方法封装 */
function get(url, options, callback) {
	var pairs = [];
	for(var name in options){
		if (!options.hasOwnProperty(name)) continue;
		if(typeof options[name]=='function') continue;
		var value = options[name].toString();
		name = encodeURIComponent(name);
		value = encodeURIComponent(value);
		pairs.push(name + '=' + value);
	}
	var newOptions = pairs.join('&');
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if (xhr.readyState==4) {
			if((xhr.status>=200 && xhr.status<300)|| xhr.status==304){
				console.log('成功获取数据');
				var data = JSON.parse(xhr.responseText);
				if (typeof callback == 'function') {
					callback(data,options);
				}
			}else{
				console.log('Request was unsuccessful:' + xhr.status);
				return '';
			}
		}
	}
	xhr.open('get', url+'?'+newOptions, true);
	xhr.send(null);
}

/* Cookie读取，将Cookie转化为JS对象 */
function getCookies(){
	var cookie = {};
	var all = document.cookie;
	if (all==='') return cookie;
	var list = all.split(';');
	for (var i = 0,len=list.length; i < len; i++) {
		 var item = list[i];
		 var p = item.indexOf('=');
		 var name = item.substring(0,p);
		 name = decodeURIComponent(name);
		 var value = item.substring(p+1);
		 value = decodeURIComponent(value);
		 cookie[name] = value;
	}
	return cookie;
}
/* 设置Cookie值得封装函数*/
function setCookie(name,value,path,iDay,domain,secure){
	var oDate=new Date();
	oDate.setDate(oDate.getDate()+iDay);
	var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
	if (iDay) {
		cookie+=';expires=' + oDate;
	}
	if (path) {
		cookie+=';path=' + path;
	}
	if (domain) {
		cookie+=';domain' + domain;
	}
	if (secure) {
		cookie+=';secure' + secure;		
	}
	document.cookie = cookie;
}


/* 关注按钮实现：初始化+关注后*/
function oFocus(){
	var focusBtn =document.querySelector('.w-nav .focus');
	EventUtil.addHandler(focusBtn,"click",function(){
		var myCookie = getCookies();
		if (!myCookie.loginSuc) {
			oLogin();
		}else{
			focus();
		}
	});
}

function focus(){
	var focusBtn =document.querySelector('.w-nav .focus');
	var focusedBtn =document.querySelector('.w-nav .focus-2');
	focusBtn.style.display='none';
	focusedBtn.style.display='';
	setCookie('followSuc',true,'/',90);
}
/* 登录按钮：初始化 */
function oLogin(){
	var loginDiv = document.querySelector('.my-login');
	var closeBtn = loginDiv.querySelector('.my-login i');
	var loginUrl ="http://study.163.com/webDev/login.htm";
	var form = loginDiv.querySelector('.my-login form');
	loginDiv.style.display ='block';
	EventUtil.addHandler(closeBtn,'click',function(){
		loginDiv.style.display ='none';
	});
	EventUtil.addHandler(form,'submit',function(event){
		event =EventUtil.getEvent(event);
		EventUtil.preventDefault(event);
		var name=form.elements['userName'];
		var password=form.elements['password'];
		options={userName:md5(name.value),password:md5(password.value)};
		
		get(loginUrl,options,function(data,options){
			if (data&&data==1) {
				loginDiv.style.display='none';
				setCookie('loginSuc',true,'/',90);
				focus();
			}else{
				var tips=document.querySelector('#tips');
				tips.style.display='block';
			}
		});
	});

}


/* 顶部通知条通知条 */
function showStatus(){
	var cookie=getCookies();
	var notice=document.querySelector('.w-notice');
	var cbtn=document.querySelector('.w-notice .close');
	if (cookie.noRemind) {
		console.log("has cookied");
		notice.style.display='none';
	}else{
		cbtn.onclick=function(){
			setCookie('noRemind',true,'/',90);
			notice.style.display='none';
		};
	}
}
/* 轮播图实现 - 图片切换*/
function Slider(){
	var slider = document.querySelector('.w-slider');
	var buttons = document.querySelectorAll('#buttons span');
	var index =0;
	var timer;

	var imgChange = function(){
		var current=(index==2)?0:index+1;
		imgChanging(index,current,buttons);
		index = current;
	}
	var t=setInterval(imgChange,5000);
	EventUtil.addHandler(slider,'mouseover',function(){
		if(t){
			clearInterval(t);
		}
	});

	EventUtil.addHandler(slider,'mouseout',function(){
		t=setInterval(imgChange,5000);
	});
	
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].onclick = function(){
			var myindex= parseInt(this.getAttribute('index'));
			clearInterval(timer);
			timer=imgChanging(index,myindex-1,buttons);
			index=myindex-1;
			
		};
	}
}
/* 轮播图实现 - 图片切换*/
function imgChanging(cur,next,buttons){
	var imgs=document.querySelectorAll('.w-slider .m-wrap');
	var curImg=imgs[cur];
	var nextImg=imgs[next];
	var deg=0
	nextImg.style.zIndex='3';
	nextImg.style.display='block';
	buttons[next].className='on';
	buttons[cur].className='';
	curImg.style.opacity=1;
	curImg.style.filter='alpha(opacity:100)';
	var timer=setInterval(function(){
		if (deg<10) {
			deg+=2;
			nextImg.style.opacity=deg/10;
			nextImg.style.filter='alpha(opacity:'+ deg*10 +')';
		}else{
			clearInterval(timer);
			nextImg.style.zIndex='2';
			curImg.style.zIndex='1';
			curImg.style.display='none';
			curImg.style.opacity='0';
			curImg.style.filter='alpha(opacity:0)';
		}
	},100);
	return timer;
}


/* getElementsByClassName 兼容IE8方案 */
function getClassName(element,names){
    if(element.getElementsByClassName){
        return element.getElementsByClassName(names);
    }else{
        var elements=element.getElementsByTagName('*');
        var result=[];
        var element,classNameStr,flag;
        names=names.split('');
        for(var i=0,element=elements[i];i++;){
            classNameStr=''+ element.className +'';
            flag=true;
            for(var j=0,name;name=names[j];j++){
                if(classNameStr.indexOf(''+name+'')==-1){
                    flag=false;
                    break;
                }
            }
            if(flag){
                result.push(element);
            }
        }
    return result;    
    }
}

/* 获取课程卡片 */
function getCourse(data){
	var card =document.createElement('div');
	card.setAttribute('class','card');
	var price;
	if (data.price=='0') {
		price='免费';
	}
	else{
		price='￥' + data.price;
	}
	var html='<div class="cardImg"><img width="223px" height="124px" src=';
	html+=data.middlePhotoUrl;
	html+='></div><div class="cardInfo"><p class="courseName t-inline">';
	html+=data.name;
	html+='</p><p class="provider">'+data.provider;
	html+='</p><div class="learnerCount"><i class="cardIcon"></i>';
	html+=data.learnerCount;
	html+='</div><p class="price">'+ price;
	html+='</p></div><div class="cardDetail"><img width="223px" height="124px" src=';
	html+=data.middlePhotoUrl;
	html+='><div class="courseInfo"><p class="title t-inline">';
	html+=data.name;
	html+='</p><div class="c-count"><i class="cardIcon"></i>';
	html+=data.learnerCount+'人在学';
	html+='<p class="c-provider">'+'发布者：'+data.provider;
	html+='</p><p class="c-category">'+'分类：'+data.categoryName;
	html+='</p></div></div><div class="c-description clearfix"><p>';
	html+=data.description;
	html+='</p></div></div>';
	card.innerHTML=html;
	return card;
}

/* 获取左侧课程 
	data为Ajax中返回的课程数据
	list为课程数据的数组。
*/
function getCourses(data,options){
	var courseNode=document.querySelector('.w-courses .n-courses');
	for (var i = 0; i < data.list.length; i++) {
		courseNode.insertBefore(getCourse(data.list[i]),courseNode.firstChild);

	}
}

/* 课程Tab 切换*/
function changeCourses(options,url2){
	var oTab= document.querySelector('.w-courses .k-tab');
	var oCourses=document.querySelector('.w-courses .n-courses');
	var tabs=oTab.getElementsByTagName('li');
	for (var i = 0; i < tabs.length; i++) {
		tabs[i].index=i;
		tabs[i].onclick=function(){
			for (var i = 0; i < tabs.length; i++) {
				tabs[i].className="";
				oCourses.innerHTML='';
			}
			this.className="k-tab-1";
			options.type=tabs[this.index].getAttribute('data-type');
			get(url2,options,getCourses);
		};
	}
}

/* 分页 */
function courseData(toPage){
		var url='http://study.163.com/webDev/couresByCategory.htm';
		var cards=document.querySelectorAll('.card');
		for (var i = 0; i < cards.length; i++) {
			cards[i].parentNode.removeChild(cards[i]);
		}
		options.pageNo=toPage;
		get(url,options,getCourses);
	}
	
function changePage(){
	var page=document.querySelector('.w-courses .page-index');
	var html='<i class="prev"></i><span class="page-on">1</span>';
	for (var i = 2; i <= 8; i++) {
		html+='<span>'+i+'</span>';
	}
	html+='<i class="next"></i>';
	page.innerHTML=html;
	
	var spanlist=page.getElementsByTagName('span');
	var prev=page.querySelector('.w-courses .prev');
	var next=page.querySelector('.w-courses .next');
	
	var toPage;
	var nowPage;
	function classSpan(){
		for (var i = 0; i < spanlist.length; i++) {
			spanlist[i].className="";
		}
	}

	for (var i = 0; i < spanlist.length; i++) {
		spanlist[i].index=i;
		spanlist[i].onclick=function(){
			classSpan();
			this.className="page-on";
			toPage = this.index+1;
			courseData(toPage);
		}
	}
	/* prev,next按钮实现页面切换*/
	EventUtil.addHandler(prev,'click',function(){
		var curSpan=page.querySelector('.w-courses .page-on');
		nowPage=curSpan.innerHTML;
		classSpan();
		if (nowPage==1) {
			spanlist[nowPage-1].className='page-on';
			return;
		}else{
			spanlist[nowPage-2].className='page-on';
			courseData(nowPage-1);
		
		}
		
	});

	EventUtil.addHandler(next,'click',function(){
		var curSpan=page.querySelector('.w-courses .page-on');
		nowPage=curSpan.innerHTML;
		classSpan();
		if (nowPage==8) {
			spanlist[nowPage-1].className='page-on';
		}else{
			spanlist[nowPage].className='page-on';
		courseData(nowPage+1);
		
		}
	});
}


/* 获取右侧热门课程列表 */
function getHotCourse(courseData){
	var course=create('div');
	var html='<div class="pop-info clearfix"><img width="50px" height="50px" src=';
	html+=courseData.smallPhotoUrl;
	html+='><div class="pop-des"><p class="t-inline">';
	html+=courseData.name;
	html+='</p><span><i class="cardIcon"></i>';
	html+=courseData.learnerCount;
	html+='</span></div></div>';
	course.innerHTML=html;
	return course;
}
function autoCourses(element,num,data){
	var next=num<data.length-1?num+1:0;
	var prev;
	if (element.firstChild.nodeType==1) {
		prev=element.firstChild;
	}else{
		prev=element.childNodes[1];
	}
	element.appendChild(getHotCourse(data[next]));
	element.removeChild(prev);
}
function getHotCourses(data){
	var TopCourses = document.querySelector('.w-courses .n-pop');
	for (var i = 0; i < 10; i++) {
		TopCourses.appendChild(getHotCourse(data[i]));
	}
	setInterval(function(){
		autoCourses(TopCourses,i,data);
		i=i<data.length-1?i+1:0;
	},5000);
}


/* 设置视频播放及关闭 */
function setVideo(url){
	var videoMask = document.querySelector('.w-courses .mask');
	var closeBtn=videoMask.querySelector('.w-courses .mask .close');
	var video=document.getElementById('myvideo');
	var videoOn=document.querySelector('.w-courses .movie-info i');
	var videoPause=document.querySelector('.w-courses .mask .pause');
	videoOn.onclick=function(){
		videoMask.style.display='block';
		video.setAttribute('src',url);
	};
	closeBtn.onclick=function(){
		videoMask.style.display='none';
		video.pause();
	};
	videoPause.onclick=function(){
		if (video.paused) {
			video.play();
		}else{
			video.pause();
		}
	};				
}

/* */
window.onload = function(){
	Slider();
	oFocus();
	showStatus();

var url1='http://study.163.com/webDev/couresByCategory.htm';
options={
	pageNo:1,
	psize:20,
	type:10
};
get(url1,options,getCourses);
changeCourses(options,url1);
changePage();

var url2='http://study.163.com/webDev/hotcouresByCategory.htm';
get(url2,'',getHotCourses);


setVideo('http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4');

};