import colors from 'colors';

const logger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const methodColor = {
            GET: 'green',
            POST: 'blue',
            PUT: 'yellow',
            DELETE: 'red',
        };
        const coloredMethod = req.method[methodColor[req.method]]
            ? req.method[methodColor[req.method]]
            : req.method;
        console.log(`${coloredMethod} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
    next();
}

export default logger;
