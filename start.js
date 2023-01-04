require('@babel/register') ({ 
    presets: [ '@babel/present-env']
})
module.exports = require('./server.js')