const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('=== DIAGNOSTIC TEST STARTING ===');
console.log('Node version:', process.version);
console.log('Working directory:', process.cwd());
console.log('__dirname:', __dirname);

// Check if .next folder exists
const nextPath = path.join(__dirname, '.next');
if (fs.existsSync(nextPath)) {
    console.log('✅ .next folder exists');
    const contents = fs.readdirSync(nextPath);
    console.log('Contents:', contents.slice(0, 5));
} else {
    console.log('❌ .next folder MISSING - Build required!');
}

// Check if package.json exists
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
    console.log('✅ package.json exists');
} else {
    console.log('❌ package.json MISSING');
}

// Start simple HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('=== Diagnostic Info ===\n');
    res.write(`Time: ${new Date().toISOString()}\n`);
    res.write(`Node: ${process.version}\n`);
    res.write(`CWD: ${process.cwd()}\n`);
    res.write(`Has .next: ${fs.existsSync(nextPath)}\n`);
    res.write('\nRequest URL: ' + req.url);
    res.end();
});

const PORT = 30005;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Diagnostic server running on port ${PORT}`);
    console.log(`Test with: curl http://localhost:${PORT}`);
});

server.on('error', (err) => {
    console.error('❌ Server error:', err.message);
});