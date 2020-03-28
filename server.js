//Install express server
const express = require('express');
const path = require('path');
const basicAuth = require('express-basic-auth')
 
const app = express();

app.use(basicAuth({
    users: { 'youcode': 'youcode18' },
    challenge: true,
    realm: 'Imb4T3st4pp',
}))
 
// Serve only the static files form the dist directory
// Replace the '/dist/<to_your_project_name>'
app.use(express.static(__dirname + '/dist/covitest'));


 
app.get('*', function(req,res) {
  res.sendFile(path.join(__dirname + '/dist/covitest/index.html'));
});

app.listen(process.env.PORT || 8080);