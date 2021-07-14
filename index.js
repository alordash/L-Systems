var path = require('path');
var express = require('express');

var staticSiteOptions = {
    maxAge: 1000 * 60 * 15
};

let app = express();

app.use(express.static(
    path.join(__dirname, 'static'),
    staticSiteOptions
)).listen(process.env.PORT, () => {
    console.log('Server launched');
});
