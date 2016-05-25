## 案例4：企业网站综合布局实战-imooc

### 企业网站综合布局分析
一般企业网站包括：头部Logo区。导航区、内容展示区、底部版权区。
页面布局时表现为：头部/导航区、信息展示区、页脚区。
![企业网站布局](http://7xrt0g.com1.z0.glb.clouddn.com/git-%E9%A6%96%E9%A1%B5%E5%88%B6%E4%BD%9C2.png)

### 涉及知识点
1. HTML + CSS 基本知识
2. 清除浮动float
3. 盒子模型
4. 两列自适应布局、三列布局
5. JavaScript+jQuery运用。
6. 焦点图特效

#### 浮动float:
浮动会让元素塌陷。即被浮动元素的父元素不具有高度。例如一个父元素包含了浮动元素，它将塌陷具有零高度。即一个父容器没有被设置高度，且里面包含的元素是浮动的，那么父容器的高度为0
浮动元素由于脱离了普通的文档流，不再占用原来文档中的位置，因此无法把父元素撑开。

**清除浮动的方法**：
1、使用空标签清除浮动。
    通过在浮动元素末尾添加一个空的标签例如 `<div style=”clear:both”></div>`，其他标签br等亦可。
    空标签可以是div标签，也可以是P标签。这种方式是在需要清除浮动的父级元素内部的所有浮动元素后添加这样一个标签清除浮动，并为其定义CSS代 码：`clear:both`。
    *优点：*通俗易懂，容易掌握
    *缺点：*会添加无意义的空标签，有违结构与表现的分离，在后期维护中将是噩梦.
2. 父元素设置 `overflow：hidden` 或 `overflow：auto`
    通过设置父元素overflow值设置为hidden；在IE6中还需要触发 hasLayout ，例如 `zoom：1`；
    此方法有效地解决了通过空标签元素清除浮动而不得不增加无意代码的弊端。使用该方法是只需在需要清除浮动的元素中定义CSS属性：`overflow:auto`，即可！”zoom:1″用于兼容IE6,也可以用`width:100%`。
    ```css
    #layout{background:#FF9;overflow:auto;zoom:1; }
    /*overflow:auto可以换成overflow:hidden，zoom:1可以换成width:100%*/
    #layout{background:#FF9;overflow:hidden;width:100%; }
    ```
    优点：不存在结构和语义化问题，代码量极少
    缺点：内容增多时候容易造成不会自动换行导致内容被隐藏掉，无法显示需要溢出的元素。
3. 使用:after 伪元素
    在需要清除浮动的地方添加.clearfix样式
    ```css
    .clearfix:after { 
        content: " "; 
        display: block; 
        height: 0; 
        clear: both; 
        visibility: hidden; 
    } 
    .clearfix{*zoom:1;} //针对IE6/7的haslayout:;
    ```
    分析：
    - 1) display:block 使生成的元素以块级元素显示,占满剩余空间;
    - 2) height:0 避免生成内容破坏原有布局的高度。
    - 3) visibility:hidden 使生成的内容不可见，并允许可能被生成内容盖住的内容可以进行点击和交互;
    - 4）通过 content:"."生成内容作为最后一个元素，至于content里面是点还是其他都是可以的.
    - 5）zoom：1 触发IE hasLayout。
    通过分析发现，除了clear：both用来闭合浮动的，其他代码无非都是为了隐藏掉content生成的内容，这也就是其他版本的闭合浮动为什么会有font-size：0，line-height：0。
    对于.clearfix样式，也可以使用如下两个简化版本：
    ```
    //终极版1：
    .clearfix:after { 
        content:"\200B"; 
        display:block; 
        height:0; 
        clear:both; 
    } 
    .clearfix {*zoom:1;}/*IE/7/6*/
    /*content:"\200B";这个参数，Unicode字符里有一个“零宽度空格”，即 U+200B，代替原来的“.”，可以缩减代码量。而且不再使用visibility:hidden。*/    
    //终极版2：
    .clearfix:before,.clearfix:after{ 
        content:""; 
        display:table; 
    } 
    .clearfix:after{clear:both;} 
    .clearfix{ 
        *zoom:1;/*IE/7/6*/
    }
    ```
参考资源：
1. clearfix清除浮动进化史 http://www.admin10000.com/document/6259.html
2. 那些年我们一起清除过的浮动 http://www.iyunlu.com/view/css-xhtml/55.html

### 首页制作
**布局分析：**
自顶向下，逐步细化的页面布局方法
![](http://7xrt0g.com1.z0.glb.clouddn.com/git-%E9%A6%96%E9%A1%B5%E5%88%B6%E4%BD%9C.png)
![](http://7xrt0g.com1.z0.glb.clouddn.com/git-%E9%A6%96%E9%A1%B5%E5%88%B6%E4%BD%9C1.png)
![](http://7xrt0g.com1.z0.glb.clouddn.com/git-%E9%A6%96%E9%A1%B5%E5%88%B6%E4%BD%9C2.png)

#### 焦点图制作
![](http://7xrt0g.com1.z0.glb.clouddn.com/git-%E7%84%A6%E7%82%B9%E5%9B%BE%E7%89%B9%E6%95%882.jpg)
使用myfocus工具([下载地址](http://demo.jb51.net/js/myfocus/))制作焦点图效果步骤：
1.在html的标签内引入相关文件
```javascript
<script type="text/javascript" src="js/myfocus-2.0.0.min.js"></script><!--引入myFocus库-->
<script type="text/javascript" src="js/mf-pattern/slide3D.js"></script><!--引入风格js文件-->
<link href="js/mf-pattern/slide3D.css" type="text/css" /><!--引入风格css文件-->
```
2.创建myFocus标准的html结构，并填充你的内容
```html
<div id="boxID"><!--焦点图盒子-->
  <div class="loading"><img src="img/loading.gif" alt="请稍候..." /></div><!--载入画面(可删除)-->
  <div class="pic"><!--内容列表(li数目可随意增减)-->
    <ul>
        <li><a href="#"><img src="img/1.jpg" thumb="" alt="标题1" text="详细描述1" /></a></li>
        <li><a href="#"><img src="img/2.jpg" thumb="" alt="标题2" text="详细描述2" /></a></li>
        <li><a href="#"><img src="img/3.jpg" thumb="" alt="标题3" text="详细描述3" /></a></li>
        <li><a href="#"><img src="img/4.jpg" thumb="" alt="标题4" text="详细描述4" /></a></li>
        <li><a href="#"><img src="img/5.jpg" thumb="" alt="标题5" text="详细描述5" /></a></li>
    </ul>
  </div>
</div>
```
3.在head标签结束前调用myFocus
```html
//你可以简单的调用---只设置它的盒子id，其它参数全部默认设置：
<script type="text/javascript">
myFocus.set({id:'boxID'}); //此处id必须和列表最外层<div>的id一致
</script>

//或详细一点的参数调用：
<script type="text/javascript">
myFocus.set({
    id:'boxID',//焦点图盒子ID
    pattern:'mF_fancy',//风格应用的名称
    time:3,//切换时间间隔(秒)
    trigger:'click',//触发切换模式:'click'(点击)/'mouseover'(悬停)
    width:450,//设置图片区域宽度(像素)
    height:296,//设置图片区域高度(像素)
    txtHeight:'default'//文字层高度设置(像素),'default'为默认高度，0为隐藏
});
</script>
```

### 整站Demo
包括首页、新闻页(二级页面)、内容页(三级页面)制作，以及整站素材及图片。
下载地址：[下载](https://github.com/xifengxx/demo/tree/master/%E4%BC%81%E4%B8%9A%E7%BD%91%E7%AB%99%E7%BB%BC%E5%90%88%E5%B8%83%E5%B1%80-imooc)