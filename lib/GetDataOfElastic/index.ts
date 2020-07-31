import { ElasticClient } from '../ElasticClient';
import { IFindTypes, QueryBuilder, SortTypes } from '../ElasticClient/QueryBuilder';
export interface IMethod {
  method: string;
  route: string;
}
export interface IConfigShema {
  elastic: {
    auth: string;
    uri?: string;
  };

  host: string;
  index: string;
  limit: number;

  query: {
    sort: {
      field: string;
      type: SortTypes;
    };
  };
  routes: IMethod[];
}
export default async function (data: IConfigShema) {
  process.env.SEARCH_INDEX = data.index;
  process.env.ELASTIC_URI = data.elastic.uri;
  if (data.elastic.auth) {
    process.env.ELASTIC_AUTH = data.elastic.auth;
  } else {
    process.env.ELASTIC_AUTH = '';
  }
  const elastic = new ElasticClient();
  const responseArr: any[] = [];

  for (const item of data.routes) {
    const query = new QueryBuilder();
    query
      .addMatch(IFindTypes.MUST, 'route', item.route)
      .addMatch(IFindTypes.MUST, 'statusCode', 200)
      .addMatch(IFindTypes.MUST, 'method', item.method.toLowerCase());
    // .addMatch(IFindTypes.MUST, 'headers_host', data.host.trim());

    query.sort({
      [`${data.query.sort.field}`]: {
        order: data.query.sort.type,
      },
    });
    const res = await elastic.search<any>(query.buildQuery(), {
      index: data.index,
      size: data.limit,
      _source: ['path', 'method', 'route', 'headers_authorization', 'requestPayload_items', 'responseTime', 'message'],
    });

    if (res && res.statusCode === 200) {
      const preparedData = res.body.hits.hits.map((item) => {
        const obj = JSON.parse(item._source.message || '{}');
        const auth = obj.headers['authorization'] || '';
        switch (obj.method) {
          case 'post': {
            return {
              path: obj.path,
              tag: `POST_${obj.route}`,
              body: obj.requestPayload,
              method: 'POST',
              headers: {
                Authorization: auth,
              },
            };
          }
          case 'get': {
            const uri = Object.keys(obj.query).reduce((acc, key) => {
              const value = obj.query[key];
              let qq = value;
              if (Array.isArray(value)) {
                const q = value.map((item) => `\"${item}\"`);
                qq = '[' + q.join(',') + ']';
              }
              return acc.length === 0 ? acc + `?${key}=${qq}` : acc + `&${key}=${qq}`;
            }, '');
            const url = `${obj.path}${uri}`;
            return {
              path: url,
              tag: `GET_${obj.route}`,
              body: null,
              method: 'GET',
              headers: {
                Authorization: auth,
              },
            };
          }
        }
      });
      responseArr.push(...preparedData);
    }
  }

  const filename = `${data.host}_${new Date().toISOString()}`;

  return {
    name: filename,
    host: data.host,
    data: responseArr,
  };
}
