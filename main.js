import './style.css'

import hljs from "highlight.js";
import MarkDownIt from "markdown-it"

let md = new MarkDownIt(`default`, {
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                console.log('<pre class="hljs"><code>' +
                    hljs.highlight(str, {language: lang, ignoreIllegals: true}).value +
                    '</code></pre>');
                return '<pre class="hljs"><code>' +
                    hljs.highlight(str, {language: lang, ignoreIllegals: true}).value +
                    '</code></pre>';
            } catch (__) {
            }
        }

        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
});

let Files = [];//所有记事本文件存放的数组，其中元素为对象格式

let fileTplate = {
    fileName: "未命名",
    createDate: "2022/9/22",
    updateDate: "2022/9/22",
    updateTime: "11:56",
    title: "",
    contents: []
}//单个文件对象模板示例


// let Htmll = md.render(mark1); e.g.How to use Markdown-it

let initNewFile = (filename = "未命名") => {
    //新建文件
    //新建文件操作：新建一个file对象，并保存到文件对象数组中
    let newFile = JSON.parse(JSON.stringify(fileTplate));
    let date = new Date();
    newFile.fileName = filename;
    newFile.createDate = date.getFullYear() + '/' + Number(date.getMonth() + 1) + '/' + date.getDate();
    newFile.updateDate = newFile.createDate;
    //三目运算符进行基本格式控制
    newFile.updateTime = (date.getHours() > 10 ? date.getHours() : '0' + date.getHours()) + ':' + (date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes());
    newFile.title = "请输入标题";
    Files.push(newFile);

    nowEditingFile = Files.length - 1;
    nowEditingCube = 0;
}

let initTextCube = (cubeId, content = '') => {
    //生成一个textnode元素
    let src;
    let textCube = document.createElement('div');
    textCube.className = 'textCube';
    textCube.dataset.cubeId = cubeId;
    let highlight = document.createElement('div');
    highlight.className = 'highLighted';
    textCube.appendChild(highlight);
    let cubeid = document.createElement('div');
    cubeid.className = 'cubeid';
    let txtNode = document.createTextNode('[' + cubeId + ']:');
    cubeid.appendChild(txtNode);
    textCube.appendChild(cubeid);
    let typeCube = document.createElement('div');
    let textNode = document.createTextNode('');
    typeCube.appendChild(textNode);
    typeCube.innerText = content;
    typeCube.className = 'typeCube';
    typeCube.contentEditable = 'true';
    textCube.appendChild(typeCube);
    let editBar = document.createElement('div');
    editBar.className = 'inlineEditBar';
    for (src in imgsrc) {
        let img = document.createElement('img');
        img.className = 'inlineIcon';
        img.src = imgsrc[src];
        img.addEventListener('click', clickEvents[src]);
        editBar.appendChild(img);
    }
    textCube.appendChild(editBar);
    return textCube;
}

let initSplitArea = (serialNumber) => {
    //生成splitArea元素
    let splitArea = document.createElement('div');
    splitArea.className = 'splitArea';
    splitArea.dataset.splitId = serialNumber;
    let splitLine = document.createElement('div');
    splitLine.className = 'splitLine';
    splitArea.appendChild(splitLine)
    let addCubeBtn = document.createElement('div');
    addCubeBtn.className = 'addCubeBtn';
    addCubeBtn.addEventListener('click', addCubeInLine);
    let textnode = document.createTextNode('+ Markdown标记语言');
    addCubeBtn.appendChild(textnode);
    splitArea.appendChild(addCubeBtn);
    return splitArea;
}

let addTextCube = (serialNumber, content = '') => {
    //增加textcube：在序号位置前增加一个分割线，后增加textcube，检测是否未最后一个textcube，是则增加最后一个
    serialNumber = Number(serialNumber);
    let textArea = document.getElementById('textArea');
    let splitAreas = document.getElementsByClassName('splitArea');
    let textCubes = document.getElementsByClassName('textCube');
    if (!textCubes[serialNumber]) {
        // console.log('yes');
        if (!splitAreas[serialNumber]) {
            let splitArea = initSplitArea(serialNumber);
            textArea.appendChild(splitArea);
        }
        //已改问题：检测与按序插入textcube
        let textCube = initTextCube(serialNumber, content);
        textArea.appendChild(textCube);
        let splitArea = initSplitArea(Number(serialNumber) + 1);
        textArea.appendChild(splitArea);
    } else {
        let textCube = initTextCube(serialNumber, content);
        let splitArea = initSplitArea(serialNumber + 1);
        for (let i = serialNumber; i < textCubes.length; i++) {
            // console.log(textCubes[i].dataset.cubeId)
            textCubes[i].dataset.cubeId++;
            let cubeid = textCubes[i].getElementsByClassName('cubeid');
            cubeid[0].innerText = '[' + textCubes[i].dataset.cubeId + ']:';
            splitAreas[i + 1].dataset.splitId++;
        }
        textArea.insertBefore(textCube, textCubes[serialNumber]);
        textArea.insertBefore(splitArea, textCubes[serialNumber + 1]);
    }
}

let addCubeInLine = (e,directe = null) => {
    //点击分割线上的加号的回调函数
    let target = e.target;
    let snumber;
    if (target.className == 'addCubeBtn') {
        snumber = target.parentNode.dataset.splitId;
        // console.log(snumber);
    }
    addTextCube(snumber);
}

let moveUpCube = (e,directe = null) => {
    //点击将单元格上移
    console.log('wdnmd')
    let target = e.target;
    let thisTextCube = target.parentNode.parentNode;
    let textCubes = document.getElementsByClassName('textCube');
    if (thisTextCube.dataset.cubeId == 0) {
        return
    } else {
        let cubeId = thisTextCube.dataset.cubeId;
        let textArea = thisTextCube.parentNode;
        let preTextCube = textCubes[cubeId - 1];
        let splitAreas = document.getElementsByClassName('splitArea');
        thisTextCube.dataset.cubeId--;
        thisTextCube.getElementsByClassName('cubeid')[0].innerText = '[' + thisTextCube.dataset.cubeId + ']:'
        preTextCube.dataset.cubeId++;
        preTextCube.getElementsByClassName('cubeid')[0].innerText = '[' + preTextCube.dataset.cubeId + ']:';
        textArea.insertBefore(thisTextCube, preTextCube);
        textArea.insertBefore(splitAreas[cubeId], preTextCube);
    }
}

let moveDownCube = (e,directe = null) => {
    //点击将单元格下移
    // console.log('wdnmd')
    let target = e.target;
    let thisTextCube = target.parentNode.parentNode;
    let textCubes = document.getElementsByClassName('textCube');
    if (thisTextCube.dataset.cubeId == textCubes.length - 1) {
        // console.log('last cube')
        return
    } else {
        let cubeId = thisTextCube.dataset.cubeId;
        cubeId = Number(cubeId);
        let textArea = thisTextCube.parentNode;
        let nexTextCube = textCubes[cubeId + 1];
        let splitAreas = document.getElementsByClassName('splitArea');
        thisTextCube.dataset.cubeId++;
        thisTextCube.getElementsByClassName('cubeid')[0].innerText = '[' + thisTextCube.dataset.cubeId + ']:'
        nexTextCube.dataset.cubeId--;
        nexTextCube.getElementsByClassName('cubeid')[0].innerText = '[' + nexTextCube.dataset.cubeId + ']:';
        textArea.insertBefore(nexTextCube, thisTextCube);
        textArea.insertBefore(splitAreas[cubeId + 1], thisTextCube);
    }
}

let copyCube = (e,directe = null) => {
    let target = e.target.parentNode.parentNode;
    let snumber;
    let textInLast = target.getElementsByClassName('typeCube')[0].innerText;
    snumber = target.dataset.cubeId;
    addTextCube(snumber, textInLast);
}

let deleteCube = (e,directe = null) => {
    let target = e.target.parentNode.parentNode;
    let cubeId = Number(target.dataset.cubeId);
    let textCubes = document.getElementsByClassName('textCube');
    let splitAreas = document.getElementsByClassName('splitArea');
    for (let i = cubeId+1; i < textCubes.length; i++) {
        textCubes[i].dataset.cubeId--;
        let cubeid = textCubes[i].getElementsByClassName('cubeid')[0];
        cubeid.innerText = '[' + textCubes[i].dataset.cubeId + ']:';
        splitAreas[i + 1].dataset.splitId--;
    }
    splitAreas[cubeId+1].remove();
    target.remove();
}

let runCode = (e, directe = null)=>{
    let target = directe?directe:e.target.parentNode.parentNode;
    let originText = target.getElementsByClassName('typeCube')[0].innerText;
    let transText = md.render(originText);
    target.getElementsByClassName('typeCube')[0].innerHTML = transText;
}

let firstTimeInitialize = () => {
    //第一次打开时需要进行的初始化工作
    //1检查文件对象数组中是否有对象，若有则根据数组进行render（由于没有后端可省略）
    //2没有则新建一个空文件并render
    //3具体render：将文件名填入顶框；将文件列表显示在左侧栏；在中间内容新建一个文本框并focus；更新右边栏序号；
    initNewFile();
    addTextCube(0);
}

let fileName = document.getElementById('fileName');
let nowEditingFile = null;//当前正在编辑的文件索引
let nowEditingCube = null;//当前正在编辑的文本框序号
let nowEditing = 0;//已废弃的变量，原指当前正在编辑的文件索引
let haveClickedFileInput = false;//是否点击了文件命名框
let ifFopOpen = [false, false, false];
let imgsrc = ['img/arrow_up.svg', 'img/arrow_down.svg', 'img/content_copy.svg', 'img/delete.svg', 'img/play_arrow.svg']
let clickEvents = [moveUpCube, moveDownCube, copyCube, deleteCube, runCode]

//==================================⬆变/常量/定义⬇执行/监听语句=========================

firstTimeInitialize();

document.body.onmousedown = (e) => {
    if (e.target.id != 'fileName') {
        if (haveClickedFileInput) {
            haveClickedFileInput = false;
            Files[nowEditing].fileName = fileName.value;//修改记录的文件名
            console.log("已保存标题", Files[nowEditing].fileName);
        }
    } else {
        haveClickedFileInput = true;
    }
    if (e.target.className == 'options') {
        console.log(e.target.id);
        let target = e.target;
        let numOfOption = 0;
        while (target != null) {
            target = target.previousSibling;
            numOfOption++;
            //获取当前选项是第几个
        }
        numOfOption = numOfOption / 2;
        let opall = document.querySelectorAll('.optionAll');
        //二级菜单栏列表
        let ops = document.querySelectorAll('.options');
        //一级菜单列表
        console.log(numOfOption);
        if (ifFopOpen[numOfOption]) {
            //如果点击菜单栏时该菜单栏是开启状态，则关闭所有菜单栏
            ifFopOpen = [false, false, false];
            ifFopOpen[numOfOption] = false;
            for (let i = 0; i < 3; i++) {
                opall[i].style.display = 'none';
                ops[i].style.cssText = '';
            }
            console.log('close')
        } else {
            //如果点击菜单栏时该菜单栏不是打开状态，则关闭其他菜单栏，打开该菜单栏
            ifFopOpen = [false, false, false];
            ifFopOpen[numOfOption] = true;
            for (let i = 0; i < 3; i++) {
                opall[i].style.display = 'none';
                ops[i].style.cssText = '';

            }
            e.target.style.cssText = `
            background-color: white;
            border-radius: 0;
            border: 1px solid #dadada;
            box-shadow: 0px -4px 10px 0px rgba(0,0,0,0.2);
            `
            console.log(e.target.parentNode);
            opall[numOfOption - 1].style.display = 'flex';
            console.log('open')
        }
    }
}
