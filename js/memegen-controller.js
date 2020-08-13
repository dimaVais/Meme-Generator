'use strict';
const TXT_TYPE = 'TEXT';
const SIZE_TYPE = 'SIZE';
const ALIGN_TYPE = 'ALIGN'
const COLOR_TYPE = 'COLOR';
const POS_TYPE = 'POS';
const SIZE_CHANGE_FACTOR = 5;

var gCanvas;
var gCtx;
var gIsImg = false;


function init() {
    gCanvas = document.getElementById('meme-canvas');
    gCtx = gCanvas.getContext('2d');
    renderGallery();
}

function onSelectImge(imgId = 2) {
    setSelectrdImg(imgId);
    gIsImg = false;
    drawSelectedImage();
}

function drawSelectedImage() {
    var selectedImg = getSelectedImg();
    const img = new Image();
    img.src = selectedImg.url;
    if (!gIsImg) {
        img.onload = () => {
            gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
            gIsImg = true;
            drawCanvas();
        }
    } else {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
    }
}

function onAddLine() {
    let meme = getMeme();
    let len = meme.lines.length;
    if (len === 1) var posY = gCanvas.height - getDefVals().lineSize;
    else if (len === 2) posY = gCanvas.height / 2;
    else if (len === 3) posY = gCanvas.height / 3;
    else if (len === 4) posY = gCanvas.height * (2 / 3);
    else posY = gCanvas.height;

    addLine(posY);
    setSelectedLinebyIdx(len);
    drawCanvas();
}

function onSelectLine() {
    setSelectNextLine();
    drawCanvas();
}

function onUpdateLineText(text) {
    drawSelectedImage();
    if (getLineTextWidth() + geTextWidth(text) > gCanvas.width) {
        let currLine = getSelectedLine();
        directUpdateLinePosY(currLine.pos.y, getLineFontHeight)
    }
    updateLine(text, TXT_TYPE);
    drawCanvas();
}

function onUpdateLineSize(sizeChange) {
    drawSelectedImage();
    if (isFontOutOfCanvasHieght(sizeChange) || sizeChange < 0) {
        updateLine(SIZE_CHANGE_FACTOR * sizeChange, SIZE_TYPE);
    }
    drawCanvas();
}

function onUpdateLineAlign(align) {
    drawSelectedImage();
    updateLine(align, ALIGN_TYPE);
    if (isOutOfCanvasWidth()) {
        drawCanvas();
    } else {
        if (align === 'right') {
            var borderX = 0;
        } else if (align === 'left') {
            borderX = gCanvas.width;
        } else {
            borderX = gCanvas.width / 2
        }
        directUpdateLinePosX(borderX, getLineTextWidth());
        drawCanvas();
    }
}

function onUpdateLineColor(color) {
    drawSelectedImage();
    updateLine(color, COLOR_TYPE);
    drawCanvas();
}
function onUpdateLinePos(posChange) {
    drawSelectedImage();
    if (isMoveOutOfCanvasHieght(posChange)) {
        updateLine(posChange, POS_TYPE);
    } else {
        let borderY = (posChange < 0) ? 0 : gCanvas.height;
        directUpdateLinePosY(borderY, getLineFontHeight());
    }
    drawCanvas();
}

function onRemoveLine() {
    removeSelectedLine();
    drawCanvas();
}

function isMoveOutOfCanvasHieght(posChange) {
    const currLine = getSelectedLine();
    if (currLine.pos.y + currLine.size * posChange < 0 + currLine.size || currLine.pos.y + currLine.size * posChange > gCanvas.height) return false;
    else return true;
}

function isFontOutOfCanvasHieght(sizeChange) {
    const currLine = getSelectedLine();
    if (currLine.pos.y + SIZE_CHANGE_FACTOR * sizeChange < 0 + currLine.size) return false;
    else return true;
}

function isOutOfCanvasWidth() {
    const currLine = getSelectedLine();
    const txtxWidth = gCtx.measureText(currLine.txt).width;
    if (currLine.pos.x - txtxWidth < 0 || currLine.pos.x + txtxWidth > gCanvas.width) return false;
    else return true;
}

function getLineFontHeight() {
    const currLine = getSelectedLine();
    let fontOfLine = currLine.size + 'pt' + ' impact';
    return parseInt(fontOfLine);
}

function getLineTextWidth() {
    const currLine = getSelectedLine();
    return gCtx.measureText(currLine.txt).width;
}

function geTextWidth(text) {
    return gCtx.measureText(text).width;
}

function drawCanvas() {
    clearCanvas();
    drawSelectedImage();
    const meme = getMeme()
    meme.lines.forEach(line => {
        gCtx.lineWidth = '2';
        if (meme.selectedLineIdx === line.id) {
            gCtx.strokeStyle = 'blue';
            gCtx.fillStyle = 'red';
            setInputLineText();
        } else {
            gCtx.strokeStyle = 'black';
            gCtx.fillStyle = line.color;
        }
        gCtx.font = line.size + 'px' + ' impact';
        gCtx.textAlign = line.align;
        gCtx.fillText(line.txt, line.pos.x, line.pos.y);
        gCtx.strokeText(line.txt, line.pos.x, line.pos.y);
    });
}

function setInputLineText() {
    const currLine = getSelectedLine();
    document.querySelector('.line').value = currLine.txt;
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}

function renderGallery() {
    const gallery = getGallery();
    var htmlImgs = gallery.map(item => {
        return `<img class="gallery-img" src="${item.url}" onclick="onSelectImge(${item.id})">`;
    });
    document.querySelector('.gallery-container').innerHTML = htmlImgs.join('');
}