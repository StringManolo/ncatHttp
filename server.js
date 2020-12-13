import * as std from "std";
import * as os from "os";

const address = "127.0.0.1";
const port = 8080;

std.popen(`echo "#!/usr/bin/env bash
qjs server.js" > .runServer.sh && chmod +775 .runServer.sh`, "r")

if (scriptArgs[1] == "start") {
  let aux = `~/../usr/bin/nc -lvk ${address} ${port} -e .runServer.sh `;
  let prog = std.popen(aux, "r");

} else {
   
  let request = "", r;
  while ((r = std.in.getline()) != "\r") {

    request += r + "\n";
  }

 /* console.log(`HTTP/1.1 200 ok

Request:
${request}`);*/

  request = request.split("\n");
  let firstLine = request.splice(0, 1);
  firstLine = firstLine.toString().split(" ");
  if (firstLine.length > 3 ) {
    throw "Bad Request At First Line";
  }

  let method = firstLine[0].toLowerCase();
  let path = firstLine[1];
  let protocol = firstLine[2].replace(/\r\n|\r|\n/g, "");
  let body = "";
  let headers = {}
  headers.unknown = [];

  for (let i in request) {
    switch(request[i].split(":")[0].toLowerCase()) {
      case "host":
	headers.host = request[i].replace(/\r\n|\r|\n/g, "");
      break;

      case "user-agent":
	headers.userAgent = request[i].replace(/\r\n|\r|\n/g, "");

      case "accept":
	headers.accept = request[i].replace(/\r\n|\r|\n/g, "");
      break;

      case "content-length":
	headers.contentLength = request[i].replace(/\r\n|\r|\n/g, "");
      break;

      case "content-type":
	headers.contentType = request[i].replace(/\r\n|\r|\n/g, "");
      break;

      default:
	headers.unknown.push(request[i].replace(/\r\n|\r|\n/g, ""));
    }
  }

  if (method == "post") { 
    if (headers.contentLength) {
      body = std.in.readAsString(+headers.contentLength.split(":")[1]);
    }
  }

  
  console.log(`HTTP/1.1 200 ok

Info:
method ${method}
path ${path}
protocol ${protocol}
body ${body}
headers ${JSON.stringify(headers)}
`);


}

