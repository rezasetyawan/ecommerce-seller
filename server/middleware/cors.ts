export default defineEventHandler((event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*', // or set to the actual origin of your client
        'Cross-Origin-Resource-Policy': 'same-origin',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Content-Security-Policy': "default-src 'self'; base-uri 'self'; font-src 'self' https: data:; form-action 'self'; frame-ancestors 'self'; img-src 'self' data:; object-src 'none'; script-src 'self'; script-src-attr 'none'; style-src 'self' https: 'unsafe-inline'; upgrade-insecure-requests",
        'X-XSS-Protection': '1',
    };

    console.log('HELP ME')
    setHeaders(event, headers);
});
