const http = require('http');

http.createServer((req, res) => {
	console.log(req.url, req.headers.cookie);
	res.writeHead(200, { 'Set-Cookie': 'mycookie=test' });
	res.end('Hello Cookie');
})
	.listen(3000, () => {
		console.log('3000번 포트에서 서버 대기중입니다');
	});