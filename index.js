const buildQueryString = require('d8-jsonapi-querystring').buildQueryString

class SubRequests {

  constructor(endpoint) {
    this.autoincrementedId = 0
    this.endpoint = endpoint
    this.requests = []
  }

  add (request) {
    // only add this request if this requestId is not already in the pipe
    const existing = this.requests.find(item => item.requestId == request.requestId)
    if (existing) return
    const defaultOptions = {
      action: "view",
      headers: {
        Accept: "application/json"
      }
    }
    const subrequest = Object.assign(defaultOptions, request)

    if (subrequest.options) {
      subrequest.uri = subrequest.uri + '?' + buildQueryString(subrequest.options)
    }
    // generate automatically a requestId if needed
    if (subrequest.requestId === undefined) {
      subrequest.requestId = ++this.autoincrementedId
    }
    this.requests.push(subrequest)
  }

   textToBinary(string) {
    return string.split('').map(function (char) {
        return char.charCodeAt(0).toString(2);
    }).join(' ');
   }

  /**
   * @param {string} response : raw *body* of the http response sended by subrequests drupal module
   */
  parseResponse (responseBody) {
    const boundary = responseBody.split('\n')[0].trim()
    const responses = responseBody.split(boundary).filter(v => v !== "" && v !== '--').map(v => JSON.parse(v.split("\n\r")[1]))
    return responses
  }

  getUrl() {
    const blueprint = JSON.stringify(this.requests)
    const url = this.endpoint + '&query=' + encodeURIComponent(blueprint)
    return url
  }

}

module.exports = SubRequests
