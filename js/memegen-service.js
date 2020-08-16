'use strict';

// const DEF_LINE_SIZE = 60;
// const DEF_LINE_ALIGN = 'center';
// const DEF_LINE_COLOR = 'white';
// const DEF_LINE_FRAME_COLOR = 'black';
// const DEF_TXT = 'Insert Text Here';
// const DEF_FONT = 'impact';

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
    gMeme.lines.push({
        id: gMeme.lines.length,
        pos: { x: CANVSA_WIDTH / 2, y: y },
        txt: DEF_TXT,
        size: DEF_LINE_SIZE,
        align: DEF_LINE_ALIGN,
        color: DEF_LINE_COLOR,
        frameColor: DEF_LINE_FRAME_COLOR,
        font: DEF_FONT
    });
}

//Update all parameters in sellected meme line
function updateLine(data, type) {
    let updateLine = gMeme.lines[gMeme.selectedLineIdx];
    if (type === POS_TYPE_Y) updateLine.pos.y = updateLine.pos.y + POS_CHANGE * data;
    else if (type === POS_TYPE_X) updateLine.pos.x = data;
    else if (type === SIZE_TYPE) updateLine[type] += data;
    else updateLine[type] = data;
}

//Fix update in case position y is out of canvas
function directUpdateLinePosY(newPosY, fontHeight) {
    let updateLine = gMeme.lines[gMeme.selectedLineIdx];
    if (newPosY === 0) updateLine.pos.y = newPosY + fontHeight;
    else updateLine.pos.y = newPosY;
}

//Remove selected line from meme
function removeSelectedLine() {
    let deletedIdx = gMeme.selectedLineIdx;
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    var startId = 0;
    gMeme.lines.forEach((line, idx) => {
        gMeme.lines[idx].id = startId;
        startId++;
    });

    gMeme.selectedLineIdx = (deletedIdx - 1 >= 0) ? deletedIdx - 1 : 0;
}

//Get meme selected image
function getSelectedImg() {
    return gImgs.find(img => { return img.id === gMeme.selectedImgId });
    // return gImgs.find(img => img.id === gMeme.selectedImgId );
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
    gMeme.isSelectedLine = true;
}

function setUnSelectLines() {
    gMeme.isSelectedLine = false;
    gMeme.selectedLineIdx = gMeme.lines.length+1;
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