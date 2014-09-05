var httpProxy = require('http-proxy'),
    connect = require('connect'),
    proxy = new httpProxy.RoutingProxy(),
    app = connect();
var configuration = require('./configuration')();

//app.use(connect.logger('dev'));
app.use(function(req, res, next) {
    var send = require('send'),
        utils = require('connect/lib/utils'),
        parse = utils.parseUrl,
        url = require('url');

    options = {};
    var found = false;
    //if  url contains static_extensions it will be static request
    for (ex in configuration.static_extensions) {
        if (req.url.indexOf(configuration.static_extensions[ex]) != -1) {
            found = true;
            break;
        }
    }
    //extension not found
    if (!found) {
        //overriding headers
        for(i in configuration.override_headers){
            req.headers[i]=configuration.override_headers[i];
        }
        //concatenating headers
        for(i in configuration.concat_headers){
            req.headers[i]+=configuration.concat_headers[i];
        }
        console.log("[-- rest service: " + req.url + " --]");
        //doing a rest service call to proxy server
        proxy.proxyRequest(req, res, configuration.serverProxy);
    } else {
        // extension found
        // logic to static request
        if ('GET' != req.method && 'HEAD' != req.method) return next();
        var originalUrl = url.parse(req.originalUrl);
        var path = parse(req).pathname;
        var pause = utils.pause(req);

        if (path == '/' && originalUrl.pathname[originalUrl.pathname.length - 1] != '/') {
            return directory();
        }

        function resume() {
            next();
            pause.resume();
        }

        function directory() {
            if (!redirect) return resume();
            var target;
            originalUrl.pathname += '/';
            target = url.format(originalUrl);
            res.statusCode = 303;
            res.setHeader('Location', target);
            res.end('Redirecting to ' + utils.escape(target));
        }

        function error(err) {
            if (404 == err.status) {
                return resume();
            }
            next(err);
        }

        send(req, path)
            .maxage(options.maxAge || 0)
            .root(configuration.static_dir)
            .index(options.index || 'index.html')
            .hidden(options.hidden)
            .on('error', error)
            .on('directory', directory)
            .pipe(res);
    }
}).listen(configuration.static_content_port);
console.log('started')