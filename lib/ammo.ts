export function createAmmo(method: string, host: string, path: string,tag:string, agent: string, body: string,headers): string {
  function getBytes(string) {
    return  Buffer.from(string).length
  }

  let tmpFile = '';

  tmpFile += `${method.toUpperCase().trim()} ${encodeURI(path)} HTTP/1.1\n`;
  tmpFile += `Host: ${host}\n`;
  tmpFile += `User-Agent: ${agent}\n`;
  tmpFile += `Content-Type: application/json; charset=utf-8\n`;
  const headersKeys = Object.keys(headers);
  if(headersKeys.length){
    for(const item of headersKeys){
      tmpFile += `${item}: ${headers[item]}\n`;
    }
  }
  switch (method.toUpperCase()) {
    case 'GET':
    case 'DELETE':
    case 'PUT':
    case 'POST': {

      tmpFile += `Content-Length: ${getBytes(body)}\n\r\n`;
      tmpFile += body;
      break;
    }
  }

  console.log('enc =>> ','orig ===>',tmpFile.length)
  return `${getBytes(tmpFile)+1} ${tag||''} \n`+ tmpFile + '\n\r\n';
}
