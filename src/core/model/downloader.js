import { toValidFileName } from './utils';
const EXTENSION_NAME = 'Image Picker v3';

class Downloader {
  constructor() {
    // This is a name holder
    this.downloadFolder = { name: null };
  }

  init(downloadFolderName) {
    const validFolder = toValidFileName(downloadFolderName);

    if (this.downloadFolder.name == null) {
      // First init (Chrome allow 1 addListener() call only)
      this.downloadFolder.name = validFolder;
      const folderNameHolder = this.downloadFolder;
      chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
        console.log('DownloadItem %o', item);
        if (item.byExtensionName != EXTENSION_NAME) {
          return;
        }

        let filePath = item.filename;
        if (folderNameHolder.name && folderNameHolder.name != '') {
          filePath = folderNameHolder.name + '/' + item.filename;
        }
        suggest({
          filename: filePath,
          conflictAction: 'uniquify',
        });
      });
    }

    // Update the name attribute every time
    this.downloadFolder.name = validFolder;
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

    console.log('Saving %d images to %s', images.length, this.downloadFolder.name);

    images.forEach(img => {
      chrome.downloads.download(
        {
          url: img.src,
          filename: img.fileFullName,
          saveAs: false,
          conflictAction: 'uniquify',
        },
        function(downloadId) {
          console.log('Saved image: %s', img.src);
        }
      );
    });
  }
}

const instance = new Downloader(); // export as singleton object
export default instance;
