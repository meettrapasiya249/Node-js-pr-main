    
    const http = require('http');
    const fs = require('fs');
    const { toNamespacedPath } = require('path');
    const { networkInterfaces } = require('os');

    const server = http.createServer((req, res) => {
      let data = '';

      switch (req.url) {
        case '/':
          data = fs.readFileSync('./pages/home.html');
          break; 
        case '/odi':
          data = fs.readFileSync('./pages/odi.html');
          break; 
        case '/test':
          data = fs.readFileSync('./pages/test.html');
          break; 
        case '/t20':
          data = fs.readFileSync('./pages/t20.html');
          break; 
        case '/ipl':
          data = fs.readFileSync('./pages/ipl.html');
          break; 
        default:
          data = '<h1>404 Page Not Found</h1>';
      }
      res.end(data);
    }); 
    server.listen(5000, () => {
      console.log('Server running on port 5000');
    });


    onabort = () => {
      new Promise((resolve, reject) => {
        
      });
    }