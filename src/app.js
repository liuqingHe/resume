//主程序
import './styles/base.css'
import styleEditor from './styleEditor'
import resumeEditor from './resumeEditor'

let {showStyles}=styleEditor
let {showResume,markdownToHtml}=resumeEditor

async function drawMyResume(){
    await showStyles(0)
    await showResume()
    await showStyles(1)
    await markdownToHtml()
    await showStyles(2)
   // await showStyles(3)
}

drawMyResume()