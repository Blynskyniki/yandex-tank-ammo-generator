import { ApiResponse, Client, RequestParams } from '@elastic/elasticsearch';
import { Log } from '../../packages/infrastructure/logger';
import { IBulkResponse, ICountResponse, ISearchResponse } from './interfaces';

const log = new Log().setLocation('ELASTIC CLIENT');

export class ElasticClient {
  get client(): Client {
    return this._client;
  }
  private _client: Client;
  //
  private _index: string = (process.env.SEARCH_INDEX || 'catalog').toString();
  constructor() {
    if (!process.env.hasOwnProperty('ELASTIC_URI') || !process.env.hasOwnProperty('ELASTIC_AUTH')) {
      throw new Error('Не заданы переменные окружения для подключения к ELASTIC');
    }
    const auth = (process.env.ELASTIC_AUTH || 'username:Password').split(':');
    if (auth[0] !== 'username') {
      this._client = new Client({
        nodes: process.env.ELASTIC_URI!.toString().split(','),
        auth: {
          password: auth[1],
          username: auth[0],
        },
        compression: 'gzip',
      });
    } else {
      this._client = new Client({
        nodes: process.env.ELASTIC_URI!.toString().split(','),
        compression: 'gzip',
      });
    }
  }
  public async index(params: RequestParams.Index): Promise<ApiResponse> {
    return this._client.index(params);
  }

  public async putSettings(params) {
    return this._client.indices.put_settings(params);
  }
  public async catIndices(params: RequestParams.CatIndices) {
    return this._client.cat.indices(params);
  }
  public async ping(): Promise<ApiResponse<any>> {
    return this._client.ping();
  }
  public async bulk(params: RequestParams.Bulk<any>): Promise<ApiResponse<any, any>> {
    return this._client.bulk(params);
  }
  public async search<T = any>(searchParams, requestParams: RequestParams.Search): Promise<ApiResponse<ISearchResponse<T, any>>> {
    return this._client.search(this.prepareRawQuery(searchParams, requestParams));
  }
  public async aggregate<T = any>(
    searchParams,
    requestParams: RequestParams.Search,
  ): Promise<ApiResponse<ISearchResponse<any, T>>> {
    return this._client.search(this.prepareRawQuery(searchParams, requestParams));
  }
  public async searchAndAggregate<T, A>(
    searchParams,
    requestParams: RequestParams.Search,
  ): Promise<ApiResponse<ISearchResponse<T, A>>> {
    return this._client.search(this.prepareRawQuery(searchParams, requestParams));
  }
  public async count(searchParams): Promise<ApiResponse<ICountResponse>> {
    return this._client.count({
      index: this._index,
      body: searchParams,
    });
  }
  public async executeBulk(bulk: any[]): Promise<ApiResponse<IBulkResponse[]>> {
    return this._client.bulk({
      body: bulk,
      error_trace: true,
      pretty: true,
    });
  }
  public async maping(mapping): Promise<ApiResponse<any>> {
    return this._client.indices.put_mapping({
      index: this._index,
      body: {
        properties: mapping,
      },
    });
  }

  public prepareBulkErrors(bulkResponse: ApiResponse, bulk) {
    const erroredDocuments: any[] = [];
    bulkResponse.body.items.forEach((action, i) => {
      const operation = Object.keys(action)[0];
      if (action[operation].error) {
        erroredDocuments.push({
          status: action[operation].status,
          error: action[operation].error,
          document: bulk[i * 2 + 1],
        });
      }
    });

    return erroredDocuments;
  }
  private prepareRawQuery(query, requestParams: RequestParams.Search): RequestParams.Search<any> {
    return {
      index: this._index,
      ...requestParams,
      body: query,
    };
  }
}
