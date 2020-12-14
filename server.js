import * as std from "std";
import * as os from "os";
import URL from "./modules/internal/URL/url.mjs"; 

let DEBUG = arg => std.popen(`echo "${arg}" >> debug.log`, "r");

const address = "127.0.0.1";
const port = 8080;
const publicPath = "/public";
const [cwd] = os.getcwd();
const absolutePublicPath = cwd + publicPath;

let errorPage = (title, favicon, errorNumber, errorDescription) => `<!DOCTYPE html>
<head>
<meta charset="utf-8">
<title>${title}</title>
${favicon ? '<link rel="icon" href="data:;base64,iVBORw0KGgo=">' : ""}
</head>
<body>
<h1>${errorNumber}</h1>
<p>${errorDescription}</p>
</body>
</html>`;


let formatedDate = () => {
  let d = new Date().toString().split(" ");
  return `${d[0]}, ${d[2]} ${d[1]} ${d[3]} ${d[4]} ${d[5].split("+")[0]}`;
};

const serverName = "ncatHttp (https://github.com/StringManolo/ncatHttp)";
const staticHeaders = `Date: ${formatedDate()}
Server: ${serverName}`;


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

  
DEBUG(request);

 /* Log raw request here ?
console.log(`HTTP/1.1 200 ok

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


  let response = "";
  if (!headers.host) {
    console.log(`HTTP/1.1 400 Bad Request
${staticHeaders}

${errorPage("Error - 400 - Bad Request", true, "400", "Bad Request")}
`);
    throw "Bad Request"; 
  }


  let url = new URL(`${((headers.host.split(":").length > 2 ? headers.host.split(":")[2] : null) == 443 ? "https" : "http")}://${headers.host.split(":")[1].trim()}${path}`);

  


  if (method == "get" || method == "head") {
    let aux = std.open(
      absolutePublicPath + 
      (url.pathname === "/" ? "/index.html" : url.pathname) , "r");
    
    if (aux) {
      response += `HTTP/1.1 200 OK
${staticHeaders}

${method == "get" ? aux.readAsString() : ""}
`;
    } else {
      response += `HTTP/1.1 400 Not Found
${staticHeaders}

${method == "get" ? errorPage("Error - 404 - Not Found", true, "404", "Resource Not Found") : ""}
`;
    }
  }


  console.log(response);
/*
  console.log(`HTTP/1.1 200 ok

Info:
method ${method}
path ${path}
url {
  url: ${url.url}
  protocol: ${url.protocol}
  host: ${url.host}
  hostname: ${url.hostname}
  port: ${url.port}
  pathname: ${url.pathname}
  search: ${url.search}
  hash: ${url.hash}
}
protocol ${protocol}
body ${body}
headers ${JSON.stringify(headers)}
`);*/


}

