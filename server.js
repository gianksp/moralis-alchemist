const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()

app.use(cors())

// Constants
const PORT = 8080
const HOST = '0.0.0.0'

/**
 * Example how to use this to forward the request to Moralis
 * Required query params:
 * - subdomain: of your moralis server
 * - func: name of the function you want to call
 * - appId: application identifier
 * 
 * e.g.
 * http://localhost:8080/forward?appId=wxBfC0OKuSn5XjHjTvE1CSOOTkguwpZXgYjWwOlW&message=hellothere&subdomain=svzayzygttuw&func=hello&pasta=1
 * 
 * All other query parameters you include will be forwarded to the CF in moralis and query params as well.
 * 
 * This is a prototype middleware... bare minimum code, no validations, no nothing
 */
app.get('/forward', (req, res) => {
    
    // Extract mandatory query params
    const params = req.query
    const applicationId = params.appId
    const subdomain = params.subdomain
    const func = params.func
    
    // Sanitize request params
    delete params.appId
    delete params.subdomain
    delete params.fun

    // Build remaining query params into forwarded request
    const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&')

    // Build moralis CF target
    const moralisCFUrl = `https://${subdomain}.moralis.io:2053/server/functions/${func}?${queryString}`
    var data = JSON.stringify({"_ApplicationId":applicationId});

    var config = {
      method: 'post',
      url: moralisCFUrl,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios(config).then(function (response) {
      res.send(JSON.stringify(response.data))
    })
    .catch(function (error) {
      res.send(error)
    });
    
});

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)