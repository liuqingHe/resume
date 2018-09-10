本项目并非独立完成，是为了学习promise和async await练手的，但是中间大部分时间都花在了webpack配置文件和npm配置文件上。。。由于webpack4删去了很多部分。。比较坑，资料在这里
[这是大佬写的，点击跳转](https://github.com/qianlongo/resume-native)
#实现思路
主要有两个部分，简历主要是通过写一个返回promise的函数，通过定时器调用，实现不断在现有的字符串中加一个个的字符，样式则是在添加字符的同时，在文档的style标签中也添加
## 配置文件
### package.json
    配置scripts字段，main字段，dependencies和devDependencies字段
```
{
  "name": "resume-native",
  "version": "1.0.0",
  "scripts": {
    "dev": "webpack-dev-server --open --config ./build/webpack.dev.js",
    "build": "node ./build/build.js",
    "lint": "standard",
    "validate": "npm ls"
  },
  "main": "app.js",
  "author": "liuqing",
  "license": "MIT",
  "dependencies": {
    "marked": "^0.3.6",
    "prismjs": "^1.6.0"
  },
  "devDependencies": {
    "babel-core": "^6.24.0",
    "babel-loader": "^6.4.1",
    "babel-preset-es2015": "^6.24.0",
    "clean-webpack-plugin": "^0.1.17",
    "css-loader": "^0.27.3",
    "extract-text-webpack-plugin": "^2.1.0",
    "html-webpack-plugin": "^2.28.0",
    "precommit-hook": "^3.0.0",
    "standard": "^9.0.2",
    "prismjs": "^1.6.0",
    "style-loader": "^0.16.1",
    "webpack": "^3.10.0",
    "webpack-dev-server": "^2.4.2",
    "webpack-merge": "^4.1.1"
  },
  "pre-commit": [
    "lint"
  ],
  "standard": {
    "ignore": "dist"
  }
}
```

### package.json
这部分就比较多了，参见项目具体代码，主要是dev.js用于配置webpack-dev-server, base.js用于配置webpack基础文件，包括loader这些，prod.js用于配置一些插件。
## 核心代码
#### 整个的流程可以分解为显示style第一步--显示resume(Markdown语法)--转换为html语法的--对html进行css修改，添加样式
#### 因为这里是一步执行完再完成第二部，最方便的就是使用ES7的async await方法，我们主函数可以这样写
```
async function drawMyResume(){
    await showStyles(0)
    await showResume()
    await showStyles(1)
    await markdownToHtml()
    await showStyles(2)
   // await showStyles(3)
}
```
#### 接下来分别写showStyle函数，showResume函数，markdownToHtml函数，他们都需要返回promise对象，动画显示的功能通过添加一个计时器，setInterval每隔一段时间调用，往html中一个个添加字符。
```
const showResume=()=>{
    return new Promise((resolve,reject)=>{
        clearInterval(timer)
        timer=setInterval(()=>{
            currentMarkdown+=resumeMarkdown.substring(start,start+1);
            if(currentMarkdown.length===length){
                //显示完毕
                clearInterval(timer);
                resolve()
            }else{
                $resumeMarkdown.html(currentMarkdown);
                start++;
            }
        },delay)
    })
}
//通过marked插件将markdown转换为html
const markdownToHtml=()=>{
    return new Promise((resolve,reject)=>{
        $resumeMarkdown.css({
            display:'none'
        })
        //$resumeWrap.addClass(iClass)
        $resumetag.html(marked(resumeMarkdown))
        resolve()
    })
}
```
marked插件用于将morkdown转换为html
```
const showStyles=(num)=>{
    console.log(num)
    console.log(styles[num])
    return new Promise((resolve,reject)=>{
        let style=styles[num]
        let length
        let prevLength
        if(!style){
            return
        }
        length=styles.filter((item,i)=>{
            return i<=num
        }).reduce((result,item)=>{
            result+=item.length
            return result
        },0)
        console.log(length)
        prevLength=length-style.length

        clearInterval(timer)

        timer=setInterval(()=>{
            let start=currentStyle.length-prevLength
            let char=style.substring(start,start+1)||''
            currentStyle+=char
            if(currentStyle.length===length){
                clearInterval(timer)
                resolve()
            }else{
                let top=$stylePre.height()-MAX_HEIGHT
                if(top>0){
                    goBottom(top)
                }
                $style.html(currentStyle)
                $stylePre.html(Prism.highlight(currentStyle,Prism.languages.css))
            }
        },delay)
    })
}
```
#### 封装了一个可链式调用的dom操作库
```
let doc=document;
let getEles=(selector,context)=>{
    return Array.from((context||doc).querySelectorAll(selector))
}

let isUndefined=(obj)=>{
    return obj===void 0;
}

class Vquery{
    constructor(selector,context){
        this.elements=getEles(selector,context)
    }
    optimizeCb(callback){
        this.elements.forEach(callback)
    }
    get(index){
        return this.elements[index<0?0:index]
    }
    html(sHtml){
        if(isUndefined(sHtml)){
            return this.get(0).innerHTML
        }
        this.optimizeCb((ele)=>{
            ele.innerHTML=sHtml
        })
        return this;
    }
    addClass(iClass){
        this.optimizeCb((ele)=>{
            if(ele.className.split(" ").indexOf(iClass)===-1){
                ele.className+=`${iClass}`
            }
        })
        return this;
    }
    css(styles){
        if(typeof styles==='object'){
            this.optimizeCb((ele)=>{
                for(let key in styles){
                    ele.style[key]=styles[key]
                }
            })
        }
        return this;
    }
    height(h){
        if(isUndefined(h)){
            return this.get(0).offsetHeight;
        }
        this.optimizeCb((ele)=>{
            ele.style.height=h;
        })
    }
    scrollTop(top){
        if(isUndefined(top)){
            return this.get(0).scrollTop
        }
        this.optimizeCb((ele)=>{
            ele.scrollTop=top;
        })
    }
}

export default(selector,context)=>{
    return new Vquery(selector,context)
}
```
###其他部分
1. gitignore需要写上node_modules, 否则打包的时候会打不完。
2、promise的缺点，采用async，await的好处见 [点击](https://www.oschina.net/translate/6-reasons-why-javascripts-async-await-blows-promises-away?comments&p=2)