
const http = require('http');
const fs = require('fs');

const getTimeStamp = date => ({
    unix: date.getTime(),
    utc: date.toUTCString()
})

const requestHandler = (req, res) => {
    // console.log(req.url);
    if(req.url === '/'){
        fs.readFile('views/index.html', 'utf-8', (err, html) => {
            if(err) throw err;
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.end(html);
        })
    }
    else if (req.url.startsWith('/api/timestamp')){
        const dateString = req.url.split('/api/timestamp/')[1];
        let timestamp;

        if(dateString === undefined || dateString.trim() === ""){ //per user story #3
            timestamp = getTimeStamp (new Date());
        }
        else{
            const date = !isNaN(dateString) ? new Date(parseInt(dateString)) : new Date(dateString);

            if(!isNaN(date.getTime())){
                timestamp = getTimeStamp(date);
            }
            else{ //per user story #5
                timestamp = {
                    error: "invalid date" 
                };
            }
        }
        res.writeHead(200, {'Content-Type' : 'application/json'});
        res.end(JSON.stringify(timestamp));
    }
    else{
        fs.readFile('views/404.html', (err, html) => {
            if (err) throw err;
            res.writeHead(404, {'Content-Type' : 'text/html'});
            res.end(html);
        })
    }
    // res.end('This is what the server is sending')
};

const server = http.createServer(requestHandler);

server.listen(process.env.PORT || 4100, err => {
    if(err) throw err;

    console.log(`Server running on PORT ${server.address().port}`)
})