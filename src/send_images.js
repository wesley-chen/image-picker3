console.log("Collecting images...");

var imageElements = [].slice.apply(document.getElementsByTagName('img'));

// Convert to ImageInfo model
var images = [];
var guid = (new Date()).getTime();
var urlSet = new Set();
for (var i = 0; i < imageElements.length; i++) {
    var imgElement = imageElements[i];
    var isEmptyImage = (imgElement.style.width == '0px' && imgElement.style.height == '0px')
        || (imgElement.width == 0 && imgElement.height == 0);

    if (!imgElement.src || urlSet.has(imgElement.src) || isEmptyImage) { // filer empty or duplicate images
        continue;
    }
    urlSet.add(imgElement.src);

    var offsetTop = 0;
    // var top = imgElement.getBoundingClientRect().top + document.documentElement.scrollTop;
    console.log("Colleced image: ", imgElement.src);
    var image = {
        id: guid++,
        src: imgElement.src,
        width: imgElement.width,
        height: imgElement.height,
        imageTop: offsetTop
    };
    images.push(image);
}

if (images.length > 0) {
    console.log("Sending (%d) images...", images.length + " from " + document.title);
    chrome.runtime.sendMessage({
        "images": images,
        "title": document.title
    });
}