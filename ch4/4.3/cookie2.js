const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '') =>  // 문자열 => 객체 로 변환
	cookie
		.split(';')
		.map(v => v.split('='))
		.reduce((acc, [k, v]) => {
			acc[k.trim()] = decodeURIComponent(v);
			return acc;
		}, {});

http.createServer(async (req, res) => {
	const cookies = parseCookies(req.headers.cookie); // { mycookie : 'test' }
	//주소가 /login 으로 시작하는 경우
	if (req.url.startsWith('/login')) {
		const { query } = url.parse(req.url); //parse 메소드는 url 문자열을 url 객체로 변환하여 리턴   
		const { name } = qs.parse(query);
		console.log(req.url); //  /login?name=seokjun
		console.log(query);//     name=seokjun
		console.log(name);//      seokjun
		const expires = new Date();
		//쿠키 유효 시간을 현재시간 + 5분으로 설정.
		expires.setMinutes(expires.getMinutes() + 5);
		res.writeHead(302, {
			Location: '/', 'Set-Cookie': `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
		});
    	res.end();
	} else if (cookies.name) {
		res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
		res.end(`${cookies.name}님 안녕하세요`);
	} else {
		try {
			const data = await fs.readFile('./cookie2.html');
			res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
			res.end(data);
		} catch (err) {
			res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
			res.end(err.message);
		}
	}
})
	.listen(3000, () => {
		console.log('3000번 포트에서 서버 대기중');	
	})