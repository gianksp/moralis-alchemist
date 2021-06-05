const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()
const { exec } = require("child_process");

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
    const { applicationId, subdomain, func, ...params } = req.query

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

app.get('/contract', (req, res) => {
    
  // Extract mandatory query params
  const params = req.query
  const contractAddress = params.address
  const func = params.func
  const isCall = params.isCall
  
  // if query para includes isCall then it will attempt to sign
  const commandType = isCall ? 'call' : 'query'
  // Only used for signing
  const callCmdParams = isCall ? '--pem="hyperfabric.pem" --gas-limit=2000000  --recall-nonce --send' : ''

  const cmd = `erdpy --verbose contract ${commandType} ${contractAddress} --function="${func}" --proxy="https://testnet-api.elrond.com" ${callCmdParams}`
  console.log(`Invoking ${cmd}`)
  exec(cmd, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          res.send(error.message)
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          res.send(stderr)
          return;
      }
      console.log(`stdout: ${stdout}`);
      res.send(stdout)
  });
});

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
