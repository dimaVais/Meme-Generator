'use strict';

// var gIds = gImgs.length;
const DEF_LINE_SIZE = 60;
const DEF_LINE_ALIGN = 'center';
const DEF_LINE_COLOR = 'white';
const DEF_LINE_FRAME_COLOR = 'black';
const DEF_TXT = 'Insert Text Here';
const CANVSA_WIDTH = 500;

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
    isSelectedLine: true,
    lines: [
        {
            id: 0,
            pos: { x: CANVSA_WIDTH / 2, y: DEF_LINE_SIZE },
            txt: DEF_TXT,
            size: DEF_LINE_SIZE,
            align: DEF_LINE_ALIGN,
            color: DEF_LINE_COLOR,
            frameColor: DEF_LINE_FRAME_COLOR
        }
    ]
}


function setSelectrdImg(imgId) {
    let imgToSet = gImgs.find(img => { return img.id === imgId });
    gMeme.selectedImgId = imgToSet.id;
}

function addLine(y) {
    if (gMeme.lines.length > 0) {
        var line =
        {
            id: gMeme.lines.length,
            pos: { x: CANVSA_WIDTH / 2, y: y },
            txt: DEF_TXT,
            size: DEF_LINE_SIZE,
            align: DEF_LINE_ALIGN,
            color: DEF_LINE_COLOR,
            frameColor: DEF_LINE_FRAME_COLOR
        }
    } else {
        line = _addDefaultLine()
    }
    gMeme.lines.push(line);
}

function _addDefaultLine() {
    return {
        id: 0,
        pos: { x: CANVSA_WIDTH / 2, y: DEF_LINE_SIZE },
        txt: DEF_TXT,
        size: DEF_LINE_SIZE,
        align: DEF_LINE_ALIGN,
        color: DEF_LINE_COLOR,
        frameColor: DEF_LINE_FRAME_COLOR
    }
}

function updateLine(data, type) {
    let updateLine = gMeme.lines[gMeme.selectedLineIdx];
    switch (type) {
        case TXT_TYPE:
            updateLine.txt = data;
            break;
        case SIZE_TYPE:
            updateLine.size += data;
            break;
        case ALIGN_TYPE:
            updateLine.align = data;
            break;
        case COLOR_TYPE:
            updateLine.color = data;
            break;
        case COLOR_FRAME_TYPE:
            updateLine.frameColor = data;
            break;
        case POS_TYPE:
            updateLine.pos.y = updateLine.pos.y + updateLine.size * data;
            break;
    }
}

function directUpdateLinePosY(newPosY, fontHeight) {
    let updateLine = gMeme.lines[gMeme.selectedLineIdx];
    if (newPosY === 0) updateLine.pos.y = newPosY + fontHeight;
    else updateLine.pos.y = newPosY;
}

function directUpdateLinePosX(newPosX, txtWidth) {
    let updateLine = gMeme.lines[gMeme.selectedLineIdx];
    if (newPosX === 0) updateLine.pos.x = newPosX + txtWidth;
    else if (newPosX === CANVSA_WIDTH) updateLine.pos.x = newPosX - txtWidth;
    else updateLine.pos.x = CANVSA_WIDTH / 2;
}

function removeSelectedLine() {
    let deletedIdx = gMeme.selectedLineIdx;
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    gMeme.selectedLineIdx = (deletedIdx - 1 >= 0) ? deletedIdx - 1 : 0;
}

function getSelectedImg() {
    return gImgs.find(img => { return img.id === gMeme.selectedImgId });
}

function getLineByIdx(idx = 0) {
    return gMeme.lines[idx];
}

function setSelectNextLine() {

    if (gMeme.selectedLineIdx < gMeme.lines.length && gMeme.lines.length > 0) {
        ++gMeme.selectedLineIdx;
        if (gMeme.selectedLineIdx >= gMeme.lines.length) {
            gMeme.isSelectedLine = false;
        }
    } else {
        gMeme.isSelectedLine = true;
        gMeme.selectedLineIdx = 0;
    }
}

function setSelectedLinebyIdx(idx = 0) {
    gMeme.selectedLineIdx = idx;
}

function getSelectedLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

function getMeme() {
    return gMeme
}

function getGallery() {
    return gImgs;
}

function getDefVals() {
    return {
        lineSize: DEF_LINE_SIZE,
        align: DEF_LINE_ALIGN,
        color: DEF_LINE_COLOR,
        txt: DEF_TXT
    }
}