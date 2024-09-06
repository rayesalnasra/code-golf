const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const firebase = require('firebase/app');
require('firebase/auth');
const admin = require('firebase-admin');

const port = 3000;

// Initialize Firebase
const firebaseConfig = {
//Edit In
};

firebase.initializeApp(firebaseConfig);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(), // Replace with your credentials if needed
    });
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Serve static files like HTML, CSS, JS
    const filePath = pathname === '/' ? '/index.html' : pathname;
    const ext = path.extname(filePath);
    const contentTypeMap = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
    };

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

    // API endpoint for login
    if (pathname === '/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const params = new URLSearchParams(body);
            const email = params.get('username');
            const password = params.get('password');

            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    return userCredential.user.getIdToken();
                })
                .then((idToken) => {
                    res.writeHead(200, {
                        'Content-Type': 'application/json',
                        'Set-Cookie': `token=${idToken}; HttpOnly; Path=/`
                    });
                    res.end(JSON.stringify({ message: 'Logged in successfully' }));
                })
                .catch((error) => {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid Username or Password' }));
                });
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

server.listen(port, () => {
    console.log(`HTTP server is listening on port ${port}`);
});
