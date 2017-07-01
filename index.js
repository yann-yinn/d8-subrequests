const axios = require('axios')
const { buildQueryString } = require('d8-jsonapi-querystring').buildQueryString

class SubRequests {

  constructor(endpoint) {
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
      },
      options: {}
    }
    if (request.options) {
      request.uri = request.uri + '?' + buildQueryString(request.options)
    }
    const subrequest = Object.assign(defaultOptions, request)
    this.requests.push(subrequest)
  }

  /**
   * @param response : axios response object
   */
  parseMultipartResponse (response) {
    const boundary = response.headers['content-type'].match(/"([^']+)"/)[1]
    const responses = response.data.split('--' + boundary).filter(v => v !== "" && v !== '--').map(v => JSON.parse(v.split("\n\r")[1]))
    return responses
  }

  send () {
    const blueprint = JSON.stringify(this.requests)
    return axios.post(this.endpoint, blueprint)
      .then(response => {
        return this.parseMultipartResponse(response)
      })
  }

}

module.exports = SubRequests
