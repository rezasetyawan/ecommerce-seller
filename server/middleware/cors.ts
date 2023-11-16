export default defineEventHandler((event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*', // or set to the actual origin of your client
    };
    setHeaders(event, headers);
});
