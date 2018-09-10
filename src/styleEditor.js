import styles from './data/style'
import $ from './vQuery'
import Prism from 'prismjs'


let $stylesWrap = $('#app .styles-wrap')
let stylesWrap = $stylesWrap.get(0)
let $style = $('style', stylesWrap)
let $stylePre = $('pre', stylesWrap)

let currentStyle=''
let delay=10
let timer
const MAX_HEIGHT=$stylesWrap.height()

const goBottom=(top)=>{
    $stylesWrap.scrollTop(top)
}

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

module.exports={
    showStyles
}
