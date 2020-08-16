'use strict';

// const GALLERY_MODE = 'GALERY';
// const MEMES_MODE = 'MEMES';


// Change the different sections on the page app
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
        } else if (elActive.getAttribute("id") === 'memes-btn') {
            setGalleryMode(MEMES_MODE);
            renderMyMemes();
        }
    }
}

//Open and close the hamburger menu on mobile mode
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

//Render the img gallery
function renderGallery() {
    const gallery = getGallery();
    var htmlImgs = gallery.map(item => {
        return `<img class="gallery-img" src="${item.url}" onclick="onSelectImge(${item.id})"   >`;
    });
    document.querySelector('.gallery-container').innerHTML = htmlImgs.join('');
}

// Render saved memes gallery
function renderMyMemes() {
    const myMemes = getMyMemes();
    var htmlImgs = myMemes.map(item => {
        return `<div class=" meme-img flex-row"> 
            <img class="meme-img" src="${item.meme}">
            <div class="meme-btn-container absolute flex-col space-between">
                <form action="" method="POST" enctype="multipart/form-data" onsubmit="onShareImgFacebook('${item.meme}',this,event)">
                    <button type="submit" class="meme-btn"><i class="meme-opt-icon fas fa-share-alt"></i></button>
                    <input name="img" id="imgDataIcon" type="hidden" />
                </form>
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

//Save meme to local storage
function onSaveMeme() {
    const memeFile = gCanvas.toDataURL('image/jpeg');
    addToMyMemes(memeFile);
}

//Remove meme from local storage
function onRemoveMeme(memeId) {
    removeMeme(memeId);
    renderMyMemes();
}

//Set current page of gallery and meme-gallery
function onSetCurrPage(changePage) {
    setCurrentPage(changePage);
    if (getGalleryMode() === GALLERY_MODE) renderGallery();
    else renderMyMemes();

}

//Scroll to the "About" section
function sctollToAbout() {
    var elAbout = document.querySelector('.about');
    var rect = elAbout.getBoundingClientRect();
    window.scrollTo({
        top: rect.top,
        left: rect.left,
        behavior: 'smooth'
    });
}