'use strict';

// var gIds = gImgs.length;
var gKeywords = { 'happy': 12, 'funny puk': 1 }

var gImgs = [
    { id: 1, url: '/img/1.jpg', keywords: ['happy'] },
    { id: 2, url: 'img/2.jpg', keywords: ['happy'] },
    { id: 3, url: 'img/3.jpg', keywords: ['happy'] },
    { id: 4, url: 'img/4.jpg', keywords: ['happy'] },
    { id: 5, url: 'img/5.jpg', keywords: ['happy'] },
    { id: 6, url: 'img/6.jpg', keywords: ['happy'] },
    { id: 7, url: 'img/7.jpg', keywords: ['happy'] },
    { id: 8, url: 'img/8.jpg', keywords: ['happy'] },
    { id: 9, url: 'img/9.jpg', keywords: ['happy'] },
    { id: 10, url: 'img/10.jpg', keywords: ['happy'] },
    { id: 11, url: 'img/11.jpg', keywords: ['happy'] },
    { id: 12, url: 'img/12.jpg', keywords: ['happy'] },
    { id: 13, url: 'img/13.jpg', keywords: ['happy'] },
    { id: 14, url: 'img/14.jpg', keywords: ['happy'] },
    { id: 15, url: 'img/15.jpg', keywords: ['happy'] },
    { id: 16, url: 'img/16.jpg', keywords: ['happy'] },
    { id: 17, url: 'img/17.jpg', keywords: ['happy'] },
    { id: 18, url: 'img/18.jpg', keywords: ['happy'] }
];

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I never eat Falafel',
            size: 20,
            align: 'left',
            color: 'red'
        }
    ]
}


function setSelectrdImg(imgId) {
    let imgToSet = gImgs.find(img => { return img.id === imgId });
    gMeme.selectedImgId = imgToSet.id;
}

function addLine(txt, size, align, color) {
    let line =
    {
        txt: txt,
        size: size,
        align: align,
        color: color
    }
    gMeme.lines.push(line);
}

function updateLine (idx=0,txt, size, align, color) {
   let updateLine =  gMeme.lines[idx];
   updateLine.txt=txt;
   updateLine.size=size;
   updateLine.align=align;
   updateLine.color=color;
}

function getSelectedImg() {
    return gImgs.find(img => { return img.id === gMeme.selectedImgId });
}

function getLineByIdx(idx = 0) {
    return gMeme.lines[idx];
}

function getMeme() {
    return gMeme
}

function getGallery(){
    return gImgs;
}