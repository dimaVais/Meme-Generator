'use strict';

//Gets data for upload from the meme-controller
function uploadImg(isCanvas, memeImg, elForm, ev) {
    ev.preventDefault();
    if(isCanvas) {
        document.getElementById('imgData').value = memeImg;
    }
    else {
        document.getElementById('imgDataIcon').value = memeImg;
    }
    doUploadImg(elForm, onSuccess);

    //Share the image on facebook in case of success
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`); return false;
    }
}

//Make the http request
function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('https://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(function (res) {
            return res.text()
        })
        .then(onSuccess)
        .catch(function (err) {
            console.error(err)
        })
}


