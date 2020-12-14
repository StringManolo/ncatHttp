class URL {
  /* Not implementing base argument. Expecting full url. */
  constructor(url) {
    this.url = url;

    /* https://stackoverflow.com/questions/736513/how-do-i-parse-a-url-into-hostname-and-path-in-javascript */
    let match = url.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);

    if (match) {
      this.protocol = match[1];
      this.host = match[2];
      this.hostname = match[3];
      this.port = match[4];
      this.pathname = match[5];
      this.search = match[6];
      this.hash = match[7];
    }
  }
}

export default URL;
