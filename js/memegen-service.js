'use strict';

const DEF_LINE_SIZE = 60;
const DEF_LINE_ALIGN = 'center';
const DEF_LINE_COLOR = 'white';
const DEF_LINE_FRAME_COLOR = 'black';
const DEF_TXT = 'Insert Text Here';
const DEF_FONT = 'impact';
const CANVSA_WIDTH = 500;

var gMeme;

//Reset meme object to default values
function resetMeme() {
    gMeme = {
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
                frameColor: DEF_LINE_FRAME_COLOR,
                font: DEF_FONT
            }
        ]
    }
}

//Set selected img in meme object
function setSelectrdImg(imgId) {
    let imgToSet = gImgs.find(img => { return img.id === imgId });
    gMeme.selectedImgId = imgToSet.id;
}

//Add line to the meme
function addLine(y) {
    var line =
    {
        id: gMeme.lines.length,
        pos: { x: CANVSA_WIDTH / 2, y: y },
        txt: DEF_TXT,
        size: DEF_LINE_SIZE,
        align: DEF_LINE_ALIGN,
        color: DEF_LINE_COLOR,
        frameColor: DEF_LINE_FRAME_COLOR,
        font: DEF_FONT
    }
    gMeme.lines.push(line);
}

//Update all parameters in sellected meme line
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
        case FONT_TYPE:
            updateLine.font = data;
            break;
        case POS_TYPE:
            updateLine.pos.y = updateLine.pos.y + updateLine.size * data;
            break;
    }
}

//Fix update in case position y is out of canvas
function directUpdateLinePosY(newPosY, fontHeight) {
    let updateLine = gMeme.lines[gMeme.selectedLineIdx];
    if (newPosY === 0) updateLine.pos.y = newPosY + fontHeight;
    else updateLine.pos.y = newPosY;
}

//Fix update in case position x is out of canvas
function directUpdateLinePosX(newPosX, txtWidth) {
    let updateLine = gMeme.lines[gMeme.selectedLineIdx];
    if (newPosX === 0) updateLine.pos.x = newPosX + txtWidth;
    else if (newPosX === CANVSA_WIDTH) updateLine.pos.x = newPosX - txtWidth;
    else updateLine.pos.x = CANVSA_WIDTH / 2;
}

//Remove selected line from meme
function removeSelectedLine() {
    let deletedIdx = gMeme.selectedLineIdx;
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    gMeme.selectedLineIdx = (deletedIdx - 1 >= 0) ? deletedIdx - 1 : 0;
}

//Get meme selected image
function getSelectedImg() {
    return gImgs.find(img => { return img.id === gMeme.selectedImgId });
}

//Get line by its id
function getLineByIdx(idx = 0) {
    return gMeme.lines[idx];
}

//Select lines one by another according they order in the meme object
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

//Set the selected line
function setSelectedLinebyIdx(idx = 0) {
    gMeme.selectedLineIdx = idx;
}

//Get currently selected line
function getSelectedLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

//Get meme object
function getMeme() {
    return gMeme
}

//Get line default values
function getDefVals() {
    return {
        lineSize: DEF_LINE_SIZE,
        align: DEF_LINE_ALIGN,
        color: DEF_LINE_COLOR,
        txt: DEF_TXT
    }
}