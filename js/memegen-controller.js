'use strict';

var gCanvas;
var gCtx;
var gIsImg = false;
var gIsMouseDown;
var gIsMobile;


// Init the meme-generator
function init() {
    gCanvas = document.getElementById('meme-canvas');
    gCtx = gCanvas.getContext('2d');
    resetMeme();
    getMyMemesFromStorage();
    renderGallery();
    setGalleryMode(GALLERY_MODE);
    onSelectLineByClick();
    // onSelectLineByTouch();
    onDragAndDropMouseEvents();
    onDragAndDropTouchEvents();
}


//Complete draw of the canvas after all data is set
function drawCanvas() {
    clearCanvas();
    drawSelectedImage();
    const meme = getMeme()
    meme.lines.forEach(line => {
        if (meme.selectedLineIdx === line.id) {
            gCtx.fillStyle = 'rgba(128, 255, 0, 0.7)';
            gCtx.lineWidth = '3';
            gCtx.rect(0, line.pos.y + 5, CANVSA_WIDTH, - getSelectedLineFontHeight());
            gCtx.fill();
            setInputLineText();
        }
        gCtx.beginPath();
        gCtx.strokeStyle = line.frameColor;
        gCtx.fillStyle = line.color
        gCtx.lineWidth = '2';
        gCtx.font = line.size + 'px' + ' ' + line.font;
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


// ********* Drag & Drop and On Canvas click functions ********* //

// Select/Unselect Line by clicking on the canvas
function onSelectLineByClick() {
    gCanvas.addEventListener("click", ev => {
        let lines = getMeme().lines;
        lines.forEach((line, idx) => {
            if (ev.offsetY < line.pos.y && ev.offsetY > line.pos.y - getLineFontHight(line)) {
                if (!getMeme().isSelectedLine || getSelectedLine().id !== line.id) setSelectedLinebyIdx(idx);
                else setUnSelectLines();
                drawCanvas();
            };
        });
    });
}

// Select/Unselect Line by touching on the canvas
function onSelectLineByTouch() {
    gCanvas.addEventListener("touchstart", ev => {
        ev.preventDefault();
        let lines = getMeme().lines;
        lines.forEach((line, idx) => {
            if (ev.touches[0].clientY < line.pos.y + 100 && ev.touches[0].clientY > line.pos.y - 100 - getLineFontHight(line)) {
                if (!getMeme().isSelectedLine || getSelectedLine().id !== line.id) setSelectedLinebyIdx(idx);
                else setUnSelectLines();
                drawCanvas();
            };
        });
    });
}

// Defines Drag&Drop event listeners for the mouse
function onDragAndDropMouseEvents() {
    const canvas = document.querySelector('#meme-canvas');
    gCanvas.addEventListener("mousedown", ev => {
        let lines = getMeme().lines;
        lines.forEach((line) => {
            if (ev.offsetY < line.pos.y && ev.offsetY > line.pos.y - getLineFontHight(line) &&
                ev.offsetX > findTextX(line).start && ev.offsetX < findTextX(line).end &&
                getSelectedLine().id === line.id) {
                if (ev) gIsMouseDown = true;
                gIsMobile = false;
                canvas.classList.add('grab');
            };
        });

    });
    gCanvas.addEventListener("mouseup", ev => {
        if (ev) gIsMouseDown = false;
        gIsMobile = false;
        canvas.classList.remove('grab');
    });
}

// Defines Drag&Drop event listeners for the touch evenst
function onDragAndDropTouchEvents() {
    gCanvas.addEventListener("touchmove", ev => {
        ev.preventDefault();
        let lines = getMeme().lines;
        lines.forEach((line) => {
            if (ev.touches[0].clientY < line.pos.y + 100 && ev.touches[0].clientY > line.pos.y - 100 - getLineFontHight(line) &&
                ev.touches[0].clientX > findTextX(line).start && ev.touches[0].clientX < findTextX(line).end &&
                getSelectedLine().id === line.id) {
                if (ev) gIsMouseDown = true;
                gIsMobile = true;
            };
        });
    })
    gCanvas.addEventListener("touchend", ev => {
        ev.preventDefault();
        if (ev) gIsMouseDown = false;
        gIsMobile = true;
    })
}

// Helper function to find the X position of the text according to the align
function findTextX(line) {
    let align = line.align;
    var lineXLimits = {};
    if (align === 'right') {
        lineXLimits = { start: 0, end: getTextWidth(line) };
    } else if (line.align === 'left') {
        lineXLimits = { start: line.pos.x, end: CANVSA_WIDTH };
    } else {
        lineXLimits = { start: CANVSA_WIDTH / 2 - getTextWidth(line) / 2, end: CANVSA_WIDTH / 2 + getTextWidth(line) / 2 };
    }
    return lineXLimits;
}

// Drag & Drop function for mouse/touch move on canvas
function onDragAndDrop(ev) {
    if (!gIsMouseDown) return;
    let pos = { locX: 0, locY: 0 }
    if (gIsMobile) {
        pos.locX = ev.touches[0].clientX;
        pos.locY = ev.touches[0].clientY;
    } else {
        pos.locX = ev.offsetX;
        pos.locY = ev.offsetY;
    }
    updateLine(pos.locX, POS_TYPE_X);
    directUpdateLinePosY(pos.locY, getSelectedLineFontHeight());
    drawCanvas();
}



// ********* Buttons Controllers functions ********* //

//Add new text line to the canvas
function onAddLine() {
    let meme = getMeme();
    let memeLength = meme.lines.length; //memeLength
    if (!memeLength) var posY = getDefVals().lineSize; //if (!len)
    else if (memeLength === 1) posY = gCanvas.height - getDefVals().lineSize;
    else if (memeLength === 2) posY = gCanvas.height / 2;
    else if (memeLength === 3) posY = gCanvas.height / 3;
    else if (memeLength === 4) posY = gCanvas.height * (2 / 3);
    else posY = gCanvas.height;

    addLine(posY);
    setSelectedLinebyIdx(memeLength);
    drawCanvas();
}

//Select line on the canvas by their order
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
    if (getSelectedLineFontWidth() + getTextWidth(text) > gCanvas.width) {
        let currLine = getSelectedLine();
        directUpdateLinePosY(currLine.pos.y, getSelectedLineFontHeight)
    }
    updateLine(text, TXT_TYPE);
    drawCanvas();
}

//Update size
function onUpdateLineSize(sizeChange) {
    if (!getMeme().isSelectedLine) return;
    if (checkIfFontOutOfCanvasHieght(sizeChange) || sizeChange < 0) {
        updateLine(SIZE_CHANGE * sizeChange, SIZE_TYPE);
    }
    drawCanvas();
}

//Update aligmnet
function onUpdateLineAlign(align) {
    if (!getMeme().isSelectedLine) return;
    let newXPos = onUpdateLinePosOnAlign(align);
    updateLine(align, ALIGN_TYPE);
    updateLine(newXPos, POS_TYPE_X);
    drawCanvas();
}

// Helper func that calculates the chnage in position x after the align
function onUpdateLinePosOnAlign(align) {
    if (align === 'right') {
        var newPos = getSelectedLineFontWidth();
    } else if (align === 'left') {
        newPos = CANVSA_WIDTH - getSelectedLineFontWidth();
    } else {
        newPos = CANVSA_WIDTH / 2;
    }
    return newPos;
}

//update line fill color
function onUpdateLineColor(color, colorPicker) {
    if (!getMeme().isSelectedLine) return;
    updateLine(color, COLOR_TYPE);
    drawCanvas();
    toggleColorPicker(colorPicker);
}

//update line frame color
function onUpdateLineFrameColor(color, colorPicker) {
    if (!getMeme().isSelectedLine) return;
    updateLine(color, COLOR_FRAME_TYPE);
    drawCanvas();
    toggleColorPicker(colorPicker);
}

//Update line font
function onUpdateFont(font) {
    if (!getMeme().isSelectedLine) return;
    updateLine(font, FONT_TYPE);
    drawCanvas();
}

//Update line position on x and y axises 
function onUpdateLinePosY(posChange) {
    if (!getMeme().isSelectedLine) return;
    if (checkIfMoveOutOfCanvasHieght(posChange)) {
        updateLine(posChange, POS_TYPE_Y);
    } else {
        let borderY = (posChange < 0) ? 0 : gCanvas.height;
        directUpdateLinePosY(borderY, getSelectedLineFontHeight());
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
function checkIfMoveOutOfCanvasHieght(posChange) { //checkIfMoveOut...()
    const currLine = getSelectedLine();
    return !(currLine.pos.y + (currLine.size * posChange) < POS_CHANGE || currLine.pos.y + (POS_CHANGE * posChange) > gCanvas.height);
}

//Check is font size increase move it out of canvas height
function checkIfFontOutOfCanvasHieght(sizeChange) {
    const currLine = getSelectedLine();
    return !(currLine.pos.y + SIZE_CHANGE * sizeChange < 0 + currLine.size);
}

//Check is text moved out of canvas width
function checkIfOutOfCanvasWidth() {
    const currLine = getSelectedLine();
    const txtxWidth = gCtx.measureText(currLine.txt).width;
    return !(currLine.pos.x - txtxWidth < 0 || currLine.pos.x + txtxWidth > gCanvas.width);
}

// ----- Check Text borders functions ------//

// Get font height of the line
function getSelectedLineFontHeight() {
    const currLine = getSelectedLine();
    let fontOfLine = currLine.size + 'pt' + ' ' + currLine.font;
    return parseInt(fontOfLine);
}

// Get font width of the line
function getSelectedLineFontWidth() {
    const currLine = getSelectedLine();
    return gCtx.measureText(currLine.txt).width;
}

//Get text width
function getTextWidth(text) {
    return gCtx.measureText(text).width;
}

function getLineFontHight(line) {
    let fontOfLine = line.size + 'pt' + ' ' + line.font;
    return parseInt(fontOfLine);
}

// Change vbetween the color picker and tha fas icons
function toggleColorPicker(itemId) { //checkbox hack
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
