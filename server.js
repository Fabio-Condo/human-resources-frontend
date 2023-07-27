const express = require('express');
const app = express();


app.use(express.static(__dirname + '/dist/wherehouse-ui'));

app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/dist/wherehouse-ui/index.html');
});

console.log("Preparando para iniciar o servidor JS...")

app.listen(process.env.PORT || 4200);  // Escutando a porta do ambiente se tiver sido configurada, caso nao, vou escutar a 4200

console.log("Servidor JS escutando a porta configurada...")

// ng build --configuration=production
// node server.js