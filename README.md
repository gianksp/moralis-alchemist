### Moralis Alchemist
Redirects [GET] requests done to `/forward` to moralis cloud function specified in query params

e.g

```
Calling ->

http://localhost:8080/forward?appId=<MORALIS_APP_ID>&message=<MESSAGE>&subdomain=<SUBDOMAIN>&func=<CLOUD_FUNCTION_NAME>

Will effectively execute ->

curl --location --request POST 'https://<SUBDOMAIN>.moralis.io:2053/server/functions/<CLOUD_FUNCTION_NAME>?message=<MESSAGE> \
--header 'Content-Type: application/json' \
--data-raw '{
    "_ApplicationId": "wxBfC0OKuSn5XjHjTvE1CSOOTkguwpZXgYjWwOlW"
}'

```

### Required params

- subdomain: of your moralis server
- func: name of the function you want to call
- appId: application identifier

All other query parameters you include will be forwarded to the CF in moralis and query params as well.

This is a prototype middleware... bare minimum code, no validations, no nothing

### Run locally
```
npm install
npm start
```

### Dockerize it
```
docker build . -t <your username>/moralis-alchemist
docker run -p 49160:8080 -d <your username>/moralis-alchemist
```