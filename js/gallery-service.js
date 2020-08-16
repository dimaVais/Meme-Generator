'use strict';

var gStartIdx = 0;
var gMyMemes;
var gGalleryMode;

var gKeywords = { 'happy': 12, 'funny puk': 1 } //Not in use for now

//Gallery array of images
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
    { id: 18, url: 'img/18.jpg', keywords: ['happy'] } //loop
];


// ----------- GALLERY FUNCTIONS --------------------

//Get gallery array of images according to curren page
function getGallery() {
    return gImgs.slice(gStartIdx, gStartIdx + PAGE_SIZE);
}

//Set the mode of the rendered data on gallery, images or My-memes
function setGalleryMode(mode) {
    gGalleryMode = mode;
    gStartIdx = 0;
}

//Get current data which on gallery images or My-memes
function getGalleryMode() {
    return gGalleryMode;
}

//Set current page on gallery and on meme-gallery
function setCurrentPage(movePageIdx) {
    let activeGalleryArr = (gGalleryMode === GALLERY_MODE) ? gImgs : gMyMemes;

    gStartIdx += PAGE_SIZE * movePageIdx;
    if (gStartIdx >= activeGalleryArr.length) gStartIdx = 0;
    else if (gStartIdx < 0) {
        if (activeGalleryArr.length <= PAGE_SIZE) gStartIdx = 0;
        else {
            gStartIdx = ((activeGalleryArr.length - PAGE_SIZE) % PAGE_SIZE === 0) ? activeGalleryArr.length - PAGE_SIZE :
                activeGalleryArr.length - (activeGalleryArr.length - PAGE_SIZE) % PAGE_SIZE;
        }
    }
}

// ----------- MEMES GALLERY FUNCTIONS --------------------

//Save new meme in the meme list
function addToMyMemes(memeFile) {
    const meme = {
        id: makeId(),
        meme: memeFile
    }
    gMyMemes.push(meme);
    saveToStorage(MY_MEMES_KEY, gMyMemes);
}

//remove meme from meme list
function removeMeme(memeId) {
    const memeIdxToRemove = gMyMemes.findIndex(meme => meme.id === memeId);
    gMyMemes.splice(memeIdxToRemove, 1);
    saveToStorage(MY_MEMES_KEY, gMyMemes);
}

//Get meme list from storage, if no meme reset it as empty array
function getMyMemesFromStorage() {
    gMyMemes = loadFromStorage(MY_MEMES_KEY);
    if (!gMyMemes) gMyMemes = [];
}

//Get gallery array of memes according to curren page
function getMyMemes() {
    return gMyMemes.slice(gStartIdx, gStartIdx + PAGE_SIZE);
}

