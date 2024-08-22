const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const port = 3000;
const validUsername = 'Admin';
const validPassword = 'Pass';
// For simplicty, I hard coded these values
// Normally, you would have to access a database to check this

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    // Parse the URL; convert query String into an object for easier access

    const pathname = parsedUrl.pathname;
    // Extract the pathname from the parsedUrl Object

    const filePath = pathname === '/' ? '/index.html' : pathname;
    const ext = path.extname(filePath);
    // Determine the file path to serve
    // If it's root, serve 'index.html' otherwise its current path
    // 'ext' is the file extension of the file

    const contentTypeMap = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
    };
    // A map of file extensions to their corresponding Content-Type headers for serving files correctly
    
    if (['.html', '.css', '.js'].includes(ext)) {
        fs.readFile(path.join(__dirname, 'public', filePath), (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found');
                return;
            }
    
            res.writeHead(200, { 'Content-Type': contentTypeMap[ext] || 'text/plain' });
            res.end(data);
        });
        return;
    }
    // Check if the requested file has an extension that we can serve (HTML, CSS, or JS)
    // If it does, read the file from the 'public' directory and serve it
    // If the file is not found, respond with a 404 error and a 'File not found' message
    // If the file is found, respond with a 200 status and the appropriate Content-Type header
    

    if (pathname === '/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        // Async recieving of data from the POST request
        req.on('end', () => {
            const params = new URLSearchParams(body);
            const username = params.get('username');
            const password = params.get('password');
            // Parse and save the values of username and password

            if (username === validUsername && password === validPassword) {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Welcome Admin!');
            } else {
                res.writeHead(401, { 'Content-Type': 'text/plain' });
                res.end('Invalid Username or Password');
            }
            // Return response for client side
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    // Response for non existent url path
});

server.listen(port, () => {
    console.log(`HTTP server is listening on port ${port}`);
});
