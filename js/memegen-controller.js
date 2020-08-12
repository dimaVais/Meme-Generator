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
        }
    } else {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
    }
}

function onUpdateLineText(text) {
    drawSelectedImage();
    updateLine(text, TXT_TYPE);
    drawText();
}

function onUpdateLineSize(sizeChange) {
    drawSelectedImage();
    console.log(SIZE_CHANGE_FACTOR*sizeChange);
    updateLine(SIZE_CHANGE_FACTOR*sizeChange, SIZE_TYPE);
    drawText();
}

function onUpdateLineAlign(align) {
    drawSelectedImage();
    updateLine(align, ALIGN_TYPE);
    drawText();
}

function onUpdateLineColor(color) {
    drawSelectedImage();
    updateLine(color, COLOR_TYPE);
    drawText();
}
function onUpdateLinePos(pos) {
    drawSelectedImage();
    updateLine(pos, POS_TYPE);
    drawText();
}


function drawText() {
    let line = getLineByIdx(0);
    gCtx.lineWidth = '2';
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = line.color;
    gCtx.font = line.size + ' impact';
    gCtx.textAlign = line.align;
    gCtx.fillText(line.txt, line.pos.x, line.pos.y);
    gCtx.strokeText(line.txt, line.pos.x, line.pos.y);
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}

function renderGallery() {
    const gallery = getGallery();
    var htmlImgs = gallery.map(item => {
        return `<img class="gallery-img" src="${item.url}" onclick="onSelectImge(${item.id})">`;
    });
    console.log(htmlImgs);
    document.querySelector('.gallery-container').innerHTML = htmlImgs.join('');
}