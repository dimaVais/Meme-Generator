'use strict';

// var gIds = gImgs.length;
const DEF_LINE_SIZE = 60;
const DEF_LINE_ALIGN = 'center';
const DEF_LINE_COLOR = 'white';

var gKeywords = { 'happy': 12, 'funny puk': 1 }

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['happy'] },
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
            pos: { x: 250, y: 50 },
            txt: 'I never eat Falafel',
            size: DEF_LINE_SIZE + 'px',
            align: DEF_LINE_ALIGN,
            color: DEF_LINE_COLOR
        }
    ]
}


function setSelectrdImg(imgId) {
    let imgToSet = gImgs.find(img => { return img.id === imgId });
    gMeme.selectedImgId = imgToSet.id;
}

function addLine(txt, size, align, color, x, y) {
    let line =
    {
        pos: { x: x, y: y },
        txt: txt,
        size: size + 'px',
        align: align,
        color: color
    }
    gMeme.lines.push(line);
}

function updateLine(data, type) {
    let updateLine = gMeme.lines[gMeme.selectedLineIdx];
    switch (type) {
        case TXT_TYPE:
            updateLine.txt = data;
            break;
        case SIZE_TYPE:
            console.log(updateLine.size);
            let newSize = parseInt(updateLine.size.substring(0,updateLine.size.length-2)) + data;
            console.log(newSize);
            updateLine.size = newSize+'px';
            break;
        case ALIGN_TYPE:
            updateLine.align = data;
            break;
        case COLOR_TYPE:
            updateLine.color = data;
            break;
        case POS_TYPE:
            updateLine.pos = data;
            break;
    }
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

function getGallery() {
    return gImgs;
}