import * as fs from 'fs';
export function createAmmo(method: string, host: string, path: string, agent: string, body: string,headers): string {
  function getBytes(string) {
    return string.length;
  }

  let tmpFile = '';

  tmpFile += `${method.toUpperCase().trim()} ${path} HTTP/1.1\n`;
  tmpFile += `Host: ${host}\n`;
  tmpFile += `User-Agent: ${agent}\n`;
  tmpFile += `Content-Type: application/json\n`;
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
      tmpFile += `Content-Length: ${body.length}\n\r\n`;
      tmpFile += body;
      break;
    }
  }

  return `${getBytes(tmpFile.trim())}\n` + tmpFile.trim() + '\n\r\n';
}
