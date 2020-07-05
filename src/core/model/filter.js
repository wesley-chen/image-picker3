class RangeLimit {
  constructor(setting) {
    this.min = setting.min;
    this.max = setting.max;
    this.includedUnknown = setting.includedUnknown;
  }

  isInRange(value) {
    let isLargeThanMin =
      !Number.isFinite(this.min) || !Number.isFinite(value) || this.min < value;
    let isLessThanMax =
      !Number.isFinite(this.max) || !Number.isFinite(value) || this.max > value;
    //debugger;
    return isLargeThanMin && isLessThanMax;
  }

  copyTo(setting) {
    setting.min = this.min;
    setting.max = this.max;
    setting.includedUnknown = this.includedUnknown;
  }
}

class Category {
  constructor(name, count, selected) {
    this.name = name;
    this.count = count;
    this.selected = selected;
  }
}

class Filter {
  constructor(domains, imageTypes, sizeLimit, widthLimit, heightLimit) {
    this.domains = domains;
    this.imageTypes = imageTypes;
    this.sizeLimit = sizeLimit;
    this.widthLimit = widthLimit;
    this.heightLimit = heightLimit;
  }

  filter(images) {
    // Reset status
    images.forEach(img => {
      img.matched = false;
    });

    let selectedDomains = this.domains.filter(d => d.selected).map(d => d.name);
    let selectedTypes = this.imageTypes
      .filter(t => t.selected)
      .map(t => t.name);

    let selectedImages = images
      .filter(img => {
        if (img.fileSize) {
          const fileSize = img.fileSize / 1000; // treat as KB
          return this.sizeLimit.isInRange(img.fileSize / 1000);
        } else {
          // Unknown size
          return true;
        }
      })
      .filter(img => this.widthLimit.isInRange(img.width))
      .filter(img => this.heightLimit.isInRange(img.height))
      .filter(img => selectedDomains.includes(img.domain))
      .filter(img => selectedTypes.includes(img.type));

    //debugger;
    selectedImages.forEach(img => {
      img.matched = true;
    });

    return selectedImages;
  }

  static createDefaultFilter() {
    return new Filter(
      [],
      [],
      new RangeLimit({ min: null, max: null, includedUnknown: true }),
      new RangeLimit({ min: null, max: null, includedUnknown: true }),
      new RangeLimit({ min: null, max: null, includedUnknown: true })
    );
  }
}

export { RangeLimit, Category, Filter };
