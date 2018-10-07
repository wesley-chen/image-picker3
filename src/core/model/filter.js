class RangeLimit {
    constructor(min, max, includedUnknown) {
        this.min = min;
        this.max = max;
        this.includedUnknown = includedUnknown;
    }

    isInRange(value) {
        let isLargeThanMin = (!Number.isFinite(this.min) || !Number.isFinite(value) || this.min < value);
        let isLessThanMax = (!Number.isFinite(this.max) || !Number.isFinite(value) || this.max > value);
        //debugger;
        return isLargeThanMin && isLessThanMax;
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

        let selectedDomains = this.domains.filter(d => d.selected).map(d => d.name);
        let selectedTypes = this.imageTypes.filter(t => t.selected).map(t => t.name);

        let selectedImages = images.filter(img => this.sizeLimit.isInRange(img.size))
            .filter(img => this.widthLimit.isInRange(img.width))
            .filter(img => this.heightLimit.isInRange(img.height))
            .filter(img => selectedDomains.includes(img.domain))
            .filter(img => selectedTypes.includes(img.type));

        //debugger;

        return selectedImages;
    }

    static createDefaultFilter() {
        return new Filter([], [], new RangeLimit(null, null, true), new RangeLimit(null, null, true), new RangeLimit(null, null, true))
    }
}

export { RangeLimit, Category, Filter }