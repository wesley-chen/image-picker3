class Image {
  constructor(webImage) {
    this.id = webImage.id;
    this.src = webImage.src;
    this.height = webImage.height;
    this.width = webImage.width;
    this.top = webImage.imageTop;

    // Get the domain of URL
    let url = new URL(decodeURIComponent(this.src));
    this.domain = url.hostname;

    // Get file name from path
    let reg = /([^\/('"\\]+)\.(\w+)/;
    let result = reg.exec(url.pathname);
    if (result != null) {
      this.fileName = result[1];
      this.type = result[2]; // the file ext
    } else {
      // try to look from the Query string
      let regQ = /=(.+)\.(\w+)/;
      let resultQ = reg.exec(url.pathname);
      if (resultQ != null) {
        this.fileName = result[1];
        this.type = result[2];
      }
    }

    // Use the last part as file name
    if (!this.fileName) {
      let urlParts = url.pathname.split('/');
      this.fileName = urlParts.length > 0 ? urlParts[urlParts.length - 1] : 'Unknown';
      this.type = 'jpg'; // use JPG as the default file ext
    }
    this.fileFullName = this.fileName + '.' + this.type;

    // fetch file size from remote
    this.fileSize = 0;
    this.fetchImage(this);
  }

  fetchImage(image) {
    const url = image.src;
    const loader = new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open('GET', url);
      req.responseType = 'blob';
      req.onload = () => {
        let imgType = req.getResponseHeader('Content-Type').split('/')[1];
        let imgSize = parseInt(req.getResponseHeader('Content-Length'), 10);

        resolve({
          imgType,
          imgSize,
          response: req.response,
        });
      };

      req.onerror = () => {
        reject(new Error(this.statusText));
      };
      req.send();
    });

    loader
      .then(function(result) {
        // Update image size
        // console.log('Update image size to %d for %s', result.imgSize, image.fileFullName);
        image.fileSize = result.imgSize;
      })
      .catch(function(error) {
        console.warn('Loaded image failed! URL=%s, Error: %s', image.src, error);
      });
  }
}

class ImageViewSession {
  constructor(allImages, tabTitle, tabUrl) {
    this.allImages = allImages;
    this.userLikeImages = new Set();
    this.userUnLikeImages = new Set();
    this.tabTitle = tabTitle;
    this.tabUrl = tabUrl;
  }

  addLikeImages(image) {
    this.userLikeImages.add(image);
    this.userUnLikeImages.delete(image);
  }

  addUnLikeImages(image) {
    this.userUnLikeImages.add(image);
    this.userLikeImages.delete(image);
  }

  getSelectedImages(filteredImages) {
    let images = new Set(filteredImages);
    this.userLikeImages.forEach(x => images.add(x));
    this.userUnLikeImages.forEach(x => images.delete(x));
    return {
      images: Array.from(images),
      selectedCount: images.size,
      unselectedCount: this.allImages.length - images.size,
    };
  }

  getUnSelectedImages(filteredImages) {
    let images = new Set(this.allImages);
    filteredImages.forEach(x => images.delete(x));
    this.userUnLikeImages.forEach(x => images.add(x));
    this.userLikeImages.forEach(x => images.delete(x));
    return {
      images: Array.from(images),
      selectedCount: this.allImages.length - images.size,
      unselectedCount: images.size,
    };
  }
}

export { Image, ImageViewSession };
