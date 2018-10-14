import { Category } from './filter';

function initData() {
  let domains = ['google.com', 'qq.com', '163.com'];
  let imageTypes = ['jpg', 'gif', 'png'];
  let images = [];
  for (let i = 0; i < 20; i++) {
    let imgId = 1000 + i;
    let domainIdx = Math.floor(Math.random() * Math.floor(domains.length));
    let typeIdx = Math.floor(Math.random() * Math.floor(imageTypes.length));
    let img = {
      id: imgId,
      src: 'https://unsplash.it/150/300?image=' + imgId,
      type: imageTypes[typeIdx],
      domain: domains[domainIdx],
      size: 1000 + 10 * i,
      width: 800 + 100 * i,
      height: 600 + 50 * i,
    };
    images.push(img);
  }
  return images;
}

function getImageDomains(images) {
  // Stats by domain
  let imageCountMap = new Map();
  let imageWeightMap = new Map();
  for (const img of images) {
    // Collect image count
    let count = imageCountMap.get(img.domain);
    if (count == null) {
      count = 0;
    }
    imageCountMap.set(img.domain, count + 1);

    // Collect image weight
    let weight = imageWeightMap.get(img.domain);
    if (weight == null) {
      weight = 0;
    }
    imageWeightMap.set(img.domain, weight + img.width * img.height);
  }
  let domains = [];
  for (const [key, value] of imageCountMap.entries()) {
    let domain = new Category(key, value, false);
    domain.weight = imageWeightMap.get(key);
    domains.push(domain);
  }

  // Select the domain which have most weight images by default
  domains.sort((a, b) => b.weight - a.weight);
  if (domains.length > 0) {
    domains[0].selected = true;
  }

  return domains;
}

function getImageTypes(images) {
  // Stats by type
  let typeMap = new Map();
  for (const img of images) {
    let count = typeMap.get(img.type);
    if (count == null) {
      count = 0;
    }
    typeMap.set(img.type, count + 1);
  }
  let types = [];
  for (const [key, value] of typeMap.entries()) {
    types.push(new Category(key, value, true));
  }
  // Select the domain which have most images by default
  // types.sort((a, b) => b.count - a.count);
  // if (types.length > 0) {
  //     types[0].selected = true;
  // }

  return types;
}

/**
 * Attempt to convert the given originalName to a valid directory/file name
 *
 * @method toValidName
 * @param {String}
 *            originalName the original name to be converted.
 * @return {String} a valid directory/file name for the given originalName
 */
function toValidFileName(originalName) {
  var validName = originalName;

  // replace special char: [,\,/,:,*,.,?,",<,>,|,]
  var reg = new RegExp('[\\/:*?"<>|]', 'g');
  validName = validName.replace(reg, '');
  validName = validName.substr(0, 100);

  // trim
  validName = validName.replace(/^\s*/, '').replace(/\s*$/, '');

  return validName;
}

export { initData, getImageDomains, getImageTypes, toValidFileName };
