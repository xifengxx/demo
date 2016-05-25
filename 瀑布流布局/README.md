## 案例3：瀑布流布局实现

### 瀑布流介绍
**什么是瀑布流？**
瀑布流，又称瀑布流式布局，是比较流行的一种网站页面布局，视觉表现为参差不齐的多栏布局，随着页面滚动条向下滚动，这种布局还会不断加载数据块并附加至当前尾部，最早采用此布局的网站是Pinterest，逐渐在国内流行开来，国内大多数清新站基本为这类风格。

### 相关知识点：
**瀑布流的原理：利用绝对定位固定图片位置，图片等宽不等高。**

1. 瀑布流布局中图片排序：
  第二行的第一个box排在第一行高度最矮的那个下面，第二个排在次矮的那个下面，以此类推。需要一个数组，存放每行每个box的offsetHeight的数组
  存放offsetHeight的数组值hArr要不断更改
  在每次定位之后，最小高度的box加上定位在其下的box的offsetHeight ；即：hArr[index]+=oBox[i].offsetHeight;

2. onscroll事件实现瀑布流布局的图片加载功能
  原理：当滚动滚动条时，判断是否要加载新的图片，通过一个函数，返回布尔值。
  需要加载的条件：
  页面最下面的元素box在视口中露出一半的高度时，开始加载。具体计算：(scrollTop+可视宽口高度)>(box.offsetTop+自身高度一半)时，加载（如图所示）。

3. scrollTop标准模式和混杂模式的兼容问题。
  标准模式--`document.body.scrollTop`
  混杂模式--`document.documentElement.scrollTop;`
  兼容的写法：`var scrollTop = document.body.scrollTop||document.documentElement.scrollTop;`
4. 当前浏览器的可视窗口的高度
  标准模式--`document.body.clientHeight`
  混杂模式--`document.documentElement.clientHeight;`
5. 求数组中最小值
  `Math.min()`只能求一组数据的最小值，通过传参，而不是数组。
  借助`apply()`方法，apply用来改变函数中this的指向，这里用来改变Math对象中的this指向
  `Math.min.apply(null,hArr);`
  Function.apply/Function.call:
  apply方法能劫持另外一个对象的方法，继承另外一个对象的属性
  Function.apply(obj,args)方法能接收两个参数
  - obj：这个对象将代替Function类里this对象
  - args：这个是数组，它将作为参数传给Function（args-->arguments）

### 实现瀑布流布局的三种方法：
#### JS原生方法
HTML部分代码：
```html
<div id="main">
        <div class="box">
            <div class="pic">
                <img src="image/P_00.jpg" />
            </div>
        </div>
        <div class="box">
            <div class="pic">
                <img src="image/P_01.jpg" />
            </div>
        </div>
        //以下省略
```
CSS部分代码：
```
*{margin:0;padding: 0}
    #main{position: relative;}
    .box{padding: 5px 0 0 5px;
        float: left;}
    .pic{
        padding: 10px;
        border:1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 0 3px #cc2;
        }
    .pic img{width:192px;
        height: auto}
//用padding而不用换margin的原因：js获取数据块的高度时（ offsetHeight） 包括图片所在的盒子高度和数据块间的距离 offsetHeight包含padding的值而不能将margin的值计入在内
```
JS部分代码：
```javascript
window.onload=function(){
    waterfall('main','box');

    var dataInt={'data':[{'src':'1.jpg'},{'src':'2.jpg'},{'src':'3.jpg'},{'src':'4.jpg'}]};
    //瀑布流布局图片加载代码：
    window.onscroll=function(){
        if(checkscrollside()){
            var oParent = document.getElementById('main');// 父级对象
            for(var i=0;i<dataInt.data.length;i++){
                var oBox=document.createElement('div'); //添加 元素节点
                oBox.className='box';                   //添加 类名 name属性
                oParent.appendChild(oBox);              //添加 子节点
                var oPic=document.createElement('div');
                oPic.className='pic';
                oBox.appendChild(oPic);
                var oImg=document.createElement('img');
                oImg.src='./image/'+dataInt.data[i].src;
                oPic.appendChild(oImg);
            }
            waterfall('main','box');
        };
    }
}
/*
    parend 父级id
    pin 元素id
*/
function waterfall(parent,pin){
    var oParent=document.getElementById(parent);// 父级对象
    var aPin=getClassObj(oParent,pin);// 获取存储块框pin的数组aPin
    var iPinW=aPin[0].offsetWidth;// 一个块框pin的宽
    var num=Math.floor(document.documentElement.clientWidth/iPinW);//每行中能容纳的pin个数【窗口宽度除以一个块框宽度】
    oParent.style.cssText='width:'+iPinW*num+'px;margin:0 auto;';//设置父级居中样式：定宽+自动水平外边距

    var pinHArr=[];//用于存储 每列中的所有块框相加的高度。
    for(var i=0;i<aPin.length;i++){//遍历数组aPin的每个块框元素
        var pinH=aPin[i].offsetHeight;
        if(i<num){
            pinHArr[i]=pinH; //第一行中的num个块框pin 先添加进数组pinHArr
        }else{
            var minH=Math.min.apply(null,pinHArr);//数组pinHArr中的最小值minH
            var minHIndex=getminHIndex(pinHArr,minH); //数组pinHArr中最小值的索引
            aPin[i].style.position='absolute';//设置绝对位移
            aPin[i].style.top=minH+'px';
            aPin[i].style.left=aPin[minHIndex].offsetLeft+'px';
            //数组 最小高元素的高 + 添加上的aPin[i]块框高
            pinHArr[minHIndex]+=aPin[i].offsetHeight;//更新添加了块框后的列高
        }
    }
}
/****
    *通过父级和子元素的class类 获取该同类子元素的数组
    */
function getClassObj(parent,className){
    var obj=parent.getElementsByTagName('*');//获取 父级的所有子集
    var pinS=[];//创建一个数组 用于收集子元素
    for (var i=0;i<obj.length;i++) {//遍历子元素、判断类别、压入数组
        if (obj[i].className==className){
            pinS.push(obj[i]);
        }
    };
    return pinS;
}
/****
    *获取 pin高度 最小值的索引index
    */
function getminHIndex(arr,minH){
    for(var i in arr){
        if(arr[i]==minH){
            return i;
        }
    }
}

//判断滚动时是否加载数据。
function checkscrollside(){
    var oParent=document.getElementById('main');
    var aPin=getClassObj(oParent,'pin');
    var lastPinH=aPin[aPin.length-1].offsetTop+Math.floor(aPin[aPin.length-1].offsetHeight/2);//创建【触发添加块框函数waterfall()】的高度：最后一个块框的距离网页顶部+自身高的一半(实现未滚到底就开始加载)
    var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;//注意解决兼容性
    var documentH=document.documentElement.clientHeight;//页面高度
    return (lastPinH<scrollTop+documentH)?true:false;//到达指定高度后 返回true，触发waterfall()函数
}
```

**可能出现的Bug:**
当拉宽/窄浏览器后，再滚动图片会出现图片重叠的bug.
原因：当拉宽/窄浏览器后，某些已经使用了position定位的图片节点不能恢复到第一排，因为第一排不能有绝对定位的样式，所以在判断不是第一排加绝对定位之前要把前面所有设置过的样式全部清零。
增加如下代码：
```
for (var i = 0; i < oBoxs.length; i++){
   oBoxs[i].style="";
}
```
如果全部清零可能会拖慢性能，最好设置一个较大的数，如15或者更大一点的就可以了，不用全部清零，如下代码：
```
for (var i = 0; i < 15; i++){
    oBoxs[i].style="";
 }
```

#### jQuery方法
HTML部分代码：
```html
<div id="main">
    <div class="box">
        <div class="pic">
            <img src="image/P_00.jpg" />
        </div>
    </div>
    <div class="box">
        <div class="pic">
            <img src="image/P_01.jpg" />
        </div>
    </div>
    //以下省略
```
jQuery部分代码：
```javascript
/*
两种方式是否效果一样？
$(window).on('load',function(){
    waterfall();
})
*/
$(function(){
    waterfall();
    var dataInt={"data":[{"src":"P_01.jpg"},{"src":"P_02.jpg"},{"src":"P_03.jpg"},{"src":"P_04.jpg"},{"src":"P_05.jpg"},{"src":"P_06.jpg"}]}
    $(window).on("scroll",function(){
        if(checkScrollSlide){
            $.each(dataInt.data,function(key,value){
                var oBox=$("<div>").addClass("box").appendTo($("#main"));
                var oPic=$("<div>").addClass("pic").appendTo($(oBox));
                $("<img>").attr("src","image/"+$(value).attr("src")).appendTo($(oPic));
            })
            waterfall();
        }
    })
})
function waterfall(){
    var $boxs=$("#main>div");
    var w=$boxs.eq(0).outerWidth();
    var cols=Math.floor($(window).width()/w);
    $("#main").width(w*cols).css("margin","0 auto");
    var hArr=[];
    $boxs.each(function(index,value){
        if (index<cols) {
            hArr.push($boxs.eq(index).outerHeight());
        }else{
            var minH=Math.min.apply(null,hArr);
            var minIndex=$.inArray(minH,hArr);
            $(value).css({
                "position":"absolute",
                "top":minH+"px",
                "left":minIndex*w+"px"
            })
            hArr[minIndex]+=$boxs.eq(index).outerHeight();
        }
    })
}
function checkScrollSlide(){
    var $lastBox=$("#main>div").last();
    var lastBoxDis=$lastBox.offset().top+Math.floor($lastBox.outerHeight()/2);
    var scrollTop=$(window).scrollTop();
    var documentH=$(window).height();
    return (lastBoxDis<scrollTop+documentH)?true:false;
}
```

#### CSS3多栏布局
使用column属性来实现。
HTML部分代码：
```html
<div id="main">
    <div class="box">
        <div class="pic">
            <img src="image/P_00.jpg" />
        </div>
    </div>
    <div class="box">
        <div class="pic">
            <img src="image/P_01.jpg" />
        </div>
    </div>
    //以下省略
```
CSS部分代码：
```css
*{margin:0;padding: 0}
    #main{
        -webkit-column-width:229px;
        -moz-column-width:229px;
        -o-column-width:229px;
        -ms-column-width:229px;
    }
    .box{padding: 10px 0 0 15px;
        display: inline-block;
        }
    .pic{
        padding: 10px;
        border:1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 0 3px #ccc;
        width:192px;
        }
    .pic img{width:192px;
        height: auto}
```

### 瀑布流布局实现方式比较：
1. CSS3方式
  - 不需要计算，浏览器自动计算，只需设置列宽，性能高；
  - 列宽随着浏览器宽口大小进行改变，用户体验不好；
  - 图片排序按照垂直顺序排列，打乱图片显示顺序
  - 图片加载还是需要js来实现。
2. Javascript原生方式：
  - 需要计算，列数=浏览器窗口宽度/图片宽度。图片定位是根据每一列数据库的高度计算接下来图片的位置。
  - 图片排序是按照图片计算的位置横向排列，位置是计算出来的，比较规范。

