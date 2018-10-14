class Image {
  constructor(webImage) {
    this.id = webImage.id;
    this.src = webImage.src;
    this.height = webImage.height;
    this.width = webImage.width;
    this.top = webImage.imageTop;
    this.fileSize = 0;

    // Get the domain of URL
    let url = new URL(decodeURIComponent(this.src));
    this.domain = url.hostname;
    // let urlParts = url.replace('http://', '').replace('https://', '').split(/[/?#]/);
    // this.domain = (urlParts.length > 0 ? urlParts[0] : "Unknown domain");

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
  }
}

class ImageViewSession {
  constructor(allImages, tabTitle) {
    this.allImages = allImages;
    this.userLikeImages = new Set();
    this.userUnLikeImages = new Set();
    this.tabTitle = tabTitle;
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
