'use strict';

const TXT_TYPE = 'TEXT';
const SIZE_TYPE = 'SIZE';
const ALIGN_TYPE = 'ALIGN'
const COLOR_TYPE = 'COLOR';
const COLOR_FRAME_TYPE = 'COLOR_FRAME';
const FONT_TYPE = 'FONT';
const POS_TYPE = 'POS';
const SIZE_CHANGE_FACTOR = 5;

var gCanvas;
var gCtx;
var gIsImg = false;


// Init the meme-generator
function init() {
    gCanvas = document.getElementById('meme-canvas');
    gCtx = gCanvas.getContext('2d');
    resetMeme();
    getMyMemesFromStorage();
    renderGallery();
    setGalleryMode(GALLERY_MODE);
}


//Complete draw of the canvas after all data is set
function drawCanvas() {
    clearCanvas();
    drawSelectedImage();
    const meme = getMeme()
    meme.lines.forEach(line => {    
        if (meme.selectedLineIdx === line.id) {
            gCtx.strokeStyle = 'blue';
            gCtx.fillStyle = line.color;
            gCtx.lineWidth = '3';
            gCtx.font ='900'+' '+ line.size + 'px' + ' ' + line.font;
            setInputLineText();
        } else {
            gCtx.strokeStyle = line.frameColor;
            gCtx.fillStyle = line.color
            gCtx.lineWidth = '2';
            gCtx.font = line.size + 'px' + ' ' + line.font;
        }
        gCtx.textAlign = line.align;
        gCtx.fillText(line.txt, line.pos.x, line.pos.y);
        gCtx.strokeText(line.txt, line.pos.x, line.pos.y);
    });
}


//Cleare Canvas
function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}

//Select image from the gallery
function onSelectImge(imgId = 2) {
    resetMeme();
    setSelectrdImg(imgId);
    gIsImg = false;
    drawSelectedImage();
    onChangePageLayout(true, null);
}


//Set selected image data to be drawn on canvas
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

//Add new text line to the canvas
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

//Select line on the canvas cor edit
function onSelectLine() {
    setSelectNextLine();
    drawCanvas();
}

//Set the text of selected line
function setInputLineText() {
    const currLine = getSelectedLine();
    document.querySelector('.line').value = currLine.txt;
}


// ----- Selected line Line Update functions ------//

//Update text
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

//Update size
function onUpdateLineSize(sizeChange) {
    if (!getMeme().isSelectedLine) return;
    drawSelectedImage();
    if (isFontOutOfCanvasHieght(sizeChange) || sizeChange < 0) {
        updateLine(SIZE_CHANGE_FACTOR * sizeChange, SIZE_TYPE);
    }
    drawCanvas();
}

//Update aligmnet
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

//update line fill color
function onUpdateLineColor(color, colorPicker) {
    if (!getMeme().isSelectedLine) return;
    drawSelectedImage();
    updateLine(color, COLOR_TYPE);
    drawCanvas();
    toggleColorPicker(colorPicker);
}

//update line frame color
function onUpdateLineFrameColor(color, colorPicker) {
    if (!getMeme().isSelectedLine) return;
    drawSelectedImage();
    updateLine(color, COLOR_FRAME_TYPE);
    drawCanvas();
    toggleColorPicker(colorPicker);
}

//Update line font
function onUpdateFont(font) {
    if (!getMeme().isSelectedLine) return;
    drawSelectedImage();
    updateLine(font, FONT_TYPE);
    drawCanvas();
}

//Update line position on x and y axices 
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

// -- End Of update functions --//


//Remove a text line from canvas
function onRemoveLine() {
    removeSelectedLine();
    drawCanvas();
}

// ----- Check canvas borders ------//

//Check is text moved out of canvas height
function isMoveOutOfCanvasHieght(posChange) {
    const currLine = getSelectedLine();
    if (currLine.pos.y + currLine.size * posChange < 0 + currLine.size || currLine.pos.y + currLine.size * posChange > gCanvas.height) return false;
    else return true;
}

//Check is font size increase move it out of canvas height
function isFontOutOfCanvasHieght(sizeChange) {
    const currLine = getSelectedLine();
    if (currLine.pos.y + SIZE_CHANGE_FACTOR * sizeChange < 0 + currLine.size) return false;
    else return true;
}

//Check is text moved out of canvas width
function isOutOfCanvasWidth() {
    const currLine = getSelectedLine();
    const txtxWidth = gCtx.measureText(currLine.txt).width;
    if (currLine.pos.x - txtxWidth < 0 || currLine.pos.x + txtxWidth > gCanvas.width) return false;
    else return true;
}

// ----- Check Text borders functions ------//

// Get font height of the line
function getLineFontHeight() {
    const currLine = getSelectedLine();
    let fontOfLine = currLine.size + 'pt' + ' ' + currLine.font;
    return parseInt(fontOfLine);
}

// Get font width of the line
function getLineTextWidth() {
    const currLine = getSelectedLine();
    return gCtx.measureText(currLine.txt).width;
}

//Get text width
function geTextWidth(text) {
    return gCtx.measureText(text).width;
}

// Change vbetween the color picker and tha fas icons
function toggleColorPicker(itemId) {
    const iconAndInput = document.querySelectorAll('#' + itemId);
    iconAndInput.forEach(item => {
        item.classList.toggle('hidden');
    });
}

// Share on facebook of both canvas and saved memes
function onShareImgFacebook(imgSource, elForm, ev) {
    if (imgSource === 'CANVAS') {
        var memeImg = gCanvas.toDataURL('image/jpeg');
        var isCanvas = true;
    } else {
        var image = new Image();
        image.src = imgSource;
        gCtx.drawImage(image, 0, 0, gCanvas.width, gCanvas.height);
        memeImg = gCanvas.toDataURL('image/jpeg');
        clearCanvas();
        isCanvas = false;
    }
    uploadImg(isCanvas, memeImg, elForm, ev);

}

// Download meme from canvas
function onDownloadMeme(elLink) {
    const data = gCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-image.jpg';
}
