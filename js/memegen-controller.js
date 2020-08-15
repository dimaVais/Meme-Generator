'use strict';
const TXT_TYPE = 'TEXT';
const SIZE_TYPE = 'SIZE';
const ALIGN_TYPE = 'ALIGN'
const COLOR_TYPE = 'COLOR';
const COLOR_FRAME_TYPE = 'COLOR_FRAME';
const FONT_TYPE = 'FONT';
const POS_TYPE = 'POS';
const SIZE_CHANGE_FACTOR = 5;
const GALLERY_MODE = 'GALERY';
const MEMES_MODE = 'MEMES';

var gCanvas;
var gCtx;
var gIsImg = false;


function init() {
    gCanvas = document.getElementById('meme-canvas');
    gCtx = gCanvas.getContext('2d');
    resetMeme();
    getMyMemesFromStorage();
    renderGallery();
    setGalleryMode(GALLERY_MODE);
}

function onChangePageLayout(isMoveToEditor, elActive) {
    const memeEditor = document.querySelector('.meme-container');
    const gallery = document.querySelector('.gallery');
    const about = document.querySelector('.about');

    if (isMoveToEditor) {
        memeEditor.classList.add('flex-row');
        memeEditor.classList.add('space-between');
        memeEditor.classList.remove('hidden');
        gallery.classList.add('hidden');
        about.classList.remove('flex-row');
        about.classList.remove('justify-center');
        about.classList.remove('align-center');
        about.classList.add('hidden');

    } else {
        memeEditor.classList.remove('flex-row');
        memeEditor.classList.remove('space-between');
        memeEditor.classList.add('hidden');
        gallery.classList.remove('hidden');
        about.classList.add('flex-row');
        about.classList.add('justify-center');
        about.classList.add('align-center');
        about.classList.remove('hidden');

        if (elActive.getAttribute("id") === 'gallery-btn') {
            setGalleryMode(GALLERY_MODE);
            renderGallery();
        } else if (elActive.getAttribute("id") === 'memes-btn'){
            setGalleryMode(MEMES_MODE);
            renderMyMemes();
        } 
    }
}

function openMenu() {
    const elNavBar = document.querySelector('.nav-bar');
    const elBars = document.querySelector('.bars');
    const elClose = document.querySelector('.close');
    const elHamburger = document.querySelector('.hamburger');
    elNavBar.classList.toggle('nav-open');
    elBars.classList.toggle('hidden');
    elClose.classList.toggle('hidden');
    elHamburger.classList.toggle('fixed');
}


function onSelectImge(imgId = 2) {
    resetMeme();
    setSelectrdImg(imgId);
    gIsImg = false;
    drawSelectedImage();
    onChangePageLayout(true, null);
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
    if (len === 0) var posY = getDefVals().lineSize;
    else if (len === 1) posY = gCanvas.height - getDefVals().lineSize;
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
    if (!getMeme().isSelectedLine) return;
    drawSelectedImage();
    if (getLineTextWidth() + geTextWidth(text) > gCanvas.width) {
        let currLine = getSelectedLine();
        directUpdateLinePosY(currLine.pos.y, getLineFontHeight)
    }
    updateLine(text, TXT_TYPE);
    drawCanvas();
}

function onUpdateLineSize(sizeChange) {
    if (!getMeme().isSelectedLine) return;
    drawSelectedImage();
    if (isFontOutOfCanvasHieght(sizeChange) || sizeChange < 0) {
        updateLine(SIZE_CHANGE_FACTOR * sizeChange, SIZE_TYPE);
    }
    drawCanvas();
}

function onUpdateLineAlign(align) {
    if (!getMeme().isSelectedLine) return;
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
    if (!getMeme().isSelectedLine) return;
    drawSelectedImage();
    updateLine(color, COLOR_TYPE);
    drawCanvas();
}

function onUpdateLineFrameColor(color) {
    if (!getMeme().isSelectedLine) return;
    drawSelectedImage();
    updateLine(color, COLOR_FRAME_TYPE);
    drawCanvas();
}

function onUpdateFont(font) {
    if (!getMeme().isSelectedLine) return;
    drawSelectedImage();
    updateLine(font, FONT_TYPE);
    drawCanvas();
}

function onUpdateLinePos(posChange) {
    if (!getMeme().isSelectedLine) return;
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
    let fontOfLine = currLine.size + 'pt' + ' ' + currLine.font;
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
            gCtx.fillStyle = line.color;
            setInputLineText();
        } else {
            gCtx.strokeStyle = line.frameColor;
            gCtx.fillStyle = line.color;
        }
        gCtx.font = line.size + 'px' + ' ' + line.font;
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

function openColorPicker(itemId) {
    const iconAndInput = document.querySelectorAll('#' + itemId);
    iconAndInput.forEach(item => {
        item.classList.toggle('hidden');
    });
}

function downloadMeme(elLink) {
    const data = gCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-image.jpg';
}

function onSaveMeme() {
    const memeFile = gCanvas.toDataURL();
    addToMyMemes(memeFile);
}

function onRemoveMeme(memeId) {
    removeMeme(memeId);
    renderMyMemes();
}


function onSetCurrPage(changePage) {
    setCurrentPage(changePage);
    if(getGalleryMode() === GALLERY_MODE) renderGallery();
    else renderMyMemes();
  
}

function renderGallery() {
    const gallery = getGallery();
    var htmlImgs = gallery.map(item => {
        return `<img class="gallery-img" src="${item.url}" onclick="onSelectImge(${item.id})"   >`;
    });
    document.querySelector('.gallery-container').innerHTML = htmlImgs.join('');
}

function renderMyMemes() {
    const myMemes = getMyMemes();
    var htmlImgs = myMemes.map(item => {
        return `<div class=" meme-img flex-row"> 
            <img class="meme-img" src="${item.meme}">
            <div class="meme-btn-container absolute flex-col justify-center">
                <button class="meme-btn"><i class="meme-opt-icon fas fa-share-alt"></i></button>
                <button class="meme-btn">
                <a href=${item.meme} download="Gallery Meme ${item.id}.jpg">
                    <i class="meme-opt-icon fas fa-download"></i>
                </a>
                </button>
                <button class="meme-btn" onclick="onRemoveMeme('${item.id}')">
                    <i class="meme-opt-icon fas fa-trash"></i>  
                </button>
            </div>
        </div>`;
    });
    document.querySelector('.gallery-container').innerHTML = htmlImgs.join('');
}

function sctollToAbout() {
    var elAbout = document.querySelector('.about');
    var rect = elAbout.getBoundingClientRect();
    window.scrollTo({
        top: rect.top,
        left: rect.left,
        behavior: 'smooth'
    });
}