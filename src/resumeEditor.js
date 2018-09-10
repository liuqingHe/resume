import resumeMarkdown from './data/resume'
import $ from './vQuery'
import marked from 'marked'
import { resolve } from 'url';

let $resumeWrap=$('#app .resume-wrap')
let resumeWrap=$resumeWrap.get(0)

let $resumetag = $('.resume-tag', resumeWrap)
let $resumeMarkdown = $('.resume-markdown', resumeWrap)

let currentMarkdown=''
let length=resumeMarkdown.length
let timer=null
let delay=10  //打印间隔60ms
let start=0
let iClass='htmlMode'

//将markdown转换为html并填入resumeTag的div里
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

//动画显示简历
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

module.exports={
    showResume,
    markdownToHtml
}