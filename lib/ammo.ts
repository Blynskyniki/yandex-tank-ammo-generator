import * as fs from 'fs';
export function createAmmo(method: string, host: string, path: string, agent: string, body: string): string {
  function getBytes(string) {
    return string.length;
  }

  let tmpFile = '';

  tmpFile += `${method.toUpperCase().trim()} ${path} HTTP/1.1\n`;
  tmpFile += `Host: ${host}\n`;
  tmpFile += `User-Agent: ${agent}\n`;
  tmpFile += `Content-Type: application/json\n`;
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
