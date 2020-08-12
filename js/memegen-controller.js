'use strict';

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

function onUpdateLineText(text, x, y) {
    drawSelectedImage();
    updateLine(text);
    drawText(x, y);
}


function drawText(x, y) {
    let line = getLineByIdx();
    gCtx.lineWidth = '2';
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = line.color;
    gCtx.font = line.size + ' impact';
    gCtx.textAlign = line.align;
    gCtx.fillText(line.txt, x, y);
    gCtx.strokeText(line.txt, x, y);
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}

function renderGallery(){
    const gallery = getGallery();
    var htmlImgs= gallery.map(item =>{
        return `<img class="gallery-img" src="${item.url}" onclick="onSelectImge(${item.id})">`;
    });
    console.log(htmlImgs);
    document.querySelector('.gallery-container').innerHTML = htmlImgs.join('');
}