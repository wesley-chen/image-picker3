console.log('Init image_collector.js');

class ImageCollector {
  constructor() {
    this.collectSingleImageEnalbed = true;
  }

  generateID() {
    return (
      Math.random()
        .toString(16)
        .slice(2) +
      new Date().getTime() +
      Math.random()
        .toString(16)
        .slice(2)
    );
  }

  // Convert image from HTMLImage to ImageInfo model
  convertImage(imgElement, offsetTop) {
    let guid = this.generateID();
    var image = {
      id: guid,
      src: imgElement.src,
      width: imgElement.width,
      height: imgElement.height,
      imageTop: offsetTop,
    };
    return image;
  }

  convertAndFilterImages(imageElements, collectedImageUrls) {
    // Convert to ImageInfo model
    let images = [];

    for (let i = 0; i < imageElements.length; i++) {
      let imgElement = imageElements[i];
      let isEmptyImage = (imgElement.style.width == '0px' && imgElement.style.height == '0px') || (imgElement.width == 0 && imgElement.height == 0);

      if (!imgElement.src || collectedImageUrls.has(imgElement.src) || isEmptyImage) {
        // filer empty or duplicate images
        continue;
      }
      collectedImageUrls.add(imgElement.src);

      var offsetTop = 0;
      // var top = imgElement.getBoundingClientRect().top + document.documentElement.scrollTop;
      console.log('Colleced image: ', imgElement.src);
      let image = this.convertImage(imgElement, offsetTop);
      images.push(image);
    }
    return images;
  }

  sendImages(images) {
    if (images.length > 0) {
      console.log('Sending %d images from %s ', images.length, document.title);
      chrome.runtime.sendMessage({
        type: 'BatchDownload',
        images: images,
      });
    }
  }

  collectAllImages() {
    let collectedImageUrls = new Set();

    // Send the loaded images (1st batch)
    let batch = 1;
    let imageElements = [].slice.apply(document.getElementsByTagName('img'));
    let images = this.convertAndFilterImages(imageElements, collectedImageUrls);
    this.sendImages(images);
    console.log('Sent the %d batch images done.', batch);

    // Collect loading images
    let imageCollector = this;
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
            if (parentNode.nodeType != Node.ELEMENT_NODE) {
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
        let images = imageCollector.convertAndFilterImages(newImages, collectedImageUrls);
        imageCollector.sendImages(images);
        console.log('Sent the %d batch images done.', batch++);
      }
    }).observe(document.body, { childList: true, attributes: true, subtree: true });
  }

  addListener(imageElements) {
    for (let i = 0; i < imageElements.length; i++) {
      let imgElement = imageElements[i];
      console.log('Adding event to %s', imgElement.src);
      imgElement.addEventListener('click', function(event) {
        alert('Click ' + imgElement.src);
        chrome.runtime.sendMessage({
          type: 'SingleDownload',
          src: imgElement.src,
          event: {
            click: true,
            ctrlKey: event.ctrlKey,
            altKey: event.altKey,
            shiftKey: event.shiftKey,
          },
        });
      });
    }
  }
}

const gImageCollector = new ImageCollector();

chrome.runtime.onMessage.addListener(function(message, sender) {
  console.log('Received: %o', message);
  if (message.type == 'CollectAllImages') {
    gImageCollector.collectAllImages();
  } else if (message.type == 'RegisterImageListener') {
    gImageCollector.collectSingleImageEnabled = true;
  } else if (message.type == 'UnregisterImageListener') {
    gImageCollector.collectSingleImageEnabled = false;
  } else {
    console.warn('Unknown %o message type', message);
  }
});

// Listen to all images by default
let imageElements = [].slice.apply(document.getElementsByTagName('img'));
gImageCollector.addListener(imageElements);
