import { toValidFileName } from './utils';

class Downloader {
  constructor() {
    this.downloaderIdSet = new Set();
    this.downloadFolder == null;
  }

  init(downloadFolderName) {
    const validFolder = toValidFileName(downloadFolderName);
    const downloaderIdSetForCallBack = this.downloaderIdSet;

    if (this.downloadFolder == null) {
      // First init (Chrome allow 1 addListener() call only)

      chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
        const filePath = validFolder + '/' + item.filename;
        suggest({
          filename: filePath,
          conflictAction: 'uniquify',
        });
      });
    }

    this.downloadFolder = validFolder;
  }

  download(images, refer) {
    chrome.webRequest.onBeforeSendHeaders.addListener(
      function(details) {
        var headers = details.requestHeaders;
        headers.push({
          name: 'Referer',
          value: refer,
        });
        // console.log('headers: %o', Headers);
        return { requestHeaders: headers };
      },
      {
        urls: ['<all_urls>'],
      },
      ['blocking', 'requestHeaders']
    );

    const downloadFolderForCallBack = this.downloadFolder;
    const downloaderIdSetForCallBack = this.downloaderIdSet;

    console.log('Saving %d images to %s', images.length, this.downloadFolder);

    images.forEach(img => {
      const filePath = 'abc/' + img.fileFullName;
      console.log('Saving image %s to %s from %s ', filePath, downloadFolderForCallBack, img.src);
      chrome.downloads.download(
        {
          url: img.src,
          filename: filePath,
          saveAs: false,
          conflictAction: 'uniquify',
        },
        function(downloadId) {
          downloaderIdSetForCallBack.add(downloadId);
        }
      );
    });
  }
}

const instance = new Downloader(); // export as singleton object
export default instance;
