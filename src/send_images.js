console.log('Collecting images...');

function sendImages(imageElements, urlSet, tabTitle, tabUrl, batch) {
  // Convert to ImageInfo model
  let images = [];
  let guid = new Date().getTime();

  for (let i = 0; i < imageElements.length; i++) {
    let imgElement = imageElements[i];
    let isEmptyImage = (imgElement.style.width == '0px' && imgElement.style.height == '0px') || (imgElement.width == 0 && imgElement.height == 0);

    if (!imgElement.src || urlSet.has(imgElement.src) || isEmptyImage) {
      // filer empty or duplicate images
      continue;
    }
    urlSet.add(imgElement.src);

    var offsetTop = 0;
    // var top = imgElement.getBoundingClientRect().top + document.documentElement.scrollTop;
    console.log('Colleced image: ', imgElement.src);
    var image = {
      id: guid++,
      src: imgElement.src,
      width: imgElement.width,
      height: imgElement.height,
      imageTop: offsetTop,
    };
    images.push(image);
  }

  if (images.length > 0) {
    console.log('Sending %d images from %s ', images.length, tabTitle);
    chrome.runtime.sendMessage({
      images: images,
      title: tabTitle,
      tabUrl: tabUrl,
    });
    console.log('Sent the %d batch images done.', batch);
  }
}

let allUrlSet = new Set();

// Send the 1st batch images
let batch = 1;
let imageElements = [].slice.apply(document.getElementsByTagName('img'));
sendImages(imageElements, allUrlSet, document.title, location.href, batch++);

new MutationObserver(function(records) {
  var newImages = [];
  records.forEach(function(record) {
    let element = record.target;

    if (record.attributeName === 'src' && element.tagName == 'IMG') {
      // Image node
      console.log('Found 1 new image');
      newImages.push(element);
    } else if (element.nodeType == Node.ELEMENT_NODE) {
      // Container node
      record.addedNodes.forEach(parentNode => {
        // check container node
        if (parentNode.nodeType !== Node.ELEMENT_NODE) {
          return;
        }
        let imageNodes = parentNode.querySelectorAll('img');
        if (imageNodes.length > 0) {
          console.log('Found %d new images.', imageNodes.length);
          newImages.push(...imageNodes);
        }
      });
    }
  });

  if (newImages.length > 0) {
    sendImages(newImages, allUrlSet, document.title, location.href, batch++);
  }
}).observe(document.body, { childList: true, attributes: true, subtree: true });
