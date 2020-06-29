export interface IHit<T> {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: T;
  _version?: number;
  _explanation?: IExplanation;
  fields?: any;
  highlight?: any;
  inner_hits?: any;
  matched_queries?: string[];
  sort?: string[];
}
export type IBulkResponse = any;
export interface ISearchResponse<T, A> {
  took: number;
  timed_out: boolean;
  _scroll_id?: string;
  _shards: IShardsResponse;
  hits: {
    total: number;
    max_score: number;
    hits: Array<IHit<T>>;
  };
  aggregations?: A;
}
interface IExplanation {
  value: number;
  description: string;
  details: IExplanation[];
}
interface IShardsResponse {
  total: number;
  successful: number;
  failed: number;
  skipped: number;
}
export interface ICountResponse {
  _shards: IShardsResponse;
  headers: {
    [name: string]: string;
  };
  count: number;
  statusCode: number;
}
