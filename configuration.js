module.exports = function() {
    //setting configuration
    var configuration = {
        //server rest
        serverProxy: {
            host: '113.130.229.165', //server ip vecui QA4
            port: 4002 //server port QA4
        },
        //headers that will be overwritten
        override_headers: {
            login_id: 'z132813_a' //login_id QA4
        },
        //headers that will be concatenated
        concat_headers: {
            cookie: '; momo=testCookie' //concatenating QA4 cookie required
        },
        //if any url requested contains these word it will be static content
        static_extensions: [
            ".js", ".html", ".css",
            ".gif", ".jpg", ".jpeg",
            ".mpg", ".mpge", ".ico",
            ".doc", ".xls", ".svg",
            ".txt", ".pdf", ".png",
            ".ico", ".woff", ".eot", "ttf", ".json"
        ],
        //static web server port
        static_content_port: 80,
        //static content directory (html,css,js,images,etc) 
        static_dir: 'C:/accurev/VEC_DEV04/vecweb'
    };
    return configuration;
};