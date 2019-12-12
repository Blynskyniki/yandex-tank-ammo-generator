/**
 * Типы поиска
 * @enum
 */
import { BoolBuilder } from './BoolBuilder';
import { ScriptBuilder } from './ScriptBuilder';
import { MAX_SAMPLE_SIZE } from '../constants';

export enum IFindTypes {
  MUST = 'must',
  MUST_NOT = 'must_not',
  SHOULD = 'should',
}
/**
 * Критерии фильтрации
 * @enum
 */
export enum IFilterTypes {
  RANGE = 'range',
  EXISTS = 'exists',
  BY_ARRAY_TERMS = 'terms',
  BY_TERMIN = 'term',
  MATCH_PHRASE = 'match_phrase',
  MATCH = 'match',
}

/**
 * Критерии для поиска диапазонов
 * @interface
 */
export interface IRangeFilter {
  gt?: range;
  gte?: range;
  lt?: range;
  lte?: range;
}
/**
 * Тип для диапазонов
 * @type
 */
export type range = number | Date;

/**
 * Варианты сортировки
 * @enum
 */
export enum SortTypes {
  ASC = 'asc',
  DESC = 'desc',
}
/**
 * Обьект сортировки
 * @interface
 */
export interface ISortPArams {
  [field: string]: {
    order: SortTypes;
  };
}
export interface IRawQuery {
  size?: number;
  query: {
    bool: {
      must: any[];
      must_not: any[];
      should: any[];
    };
  };
}

/**
 * @Class QueryBuilder
 * @Classdesc Билдер запросов к elasticSearch
 */
export class QueryBuilder {
  /**
   * Хранилище запроса
   * @private
   */
  private _query: IRawQuery = {
    query: {
      bool: {
        must: [],
        must_not: [],
        should: [],
      },
    },
  };
  private _agg = {
    aggs: {},
  };
  private _script = {};

  /**
   * Сортировка
   * @param args
   * @return {this}
   */
  public sort(...args: ISortPArams[]) {
    this._query['sort'] = args;
    return this;
  }
  /**
   * Сортировка
   * @param args[]
   * @return {this}
   */
  public sortOfArray(args: ISortPArams[]) {
    this._query['sort'] = args;
    return this;
  }

  /**
   * Указать критерий поиска по индексу (термин, например articul = 10001)
   * @param type
   * @param field
   * @param value
   * @return {this}
   */
  public addTerm(type: IFindTypes, field: string, value: number | Date | string | boolean) {
    this._query['query']['bool'][type].push({
      [IFilterTypes.BY_TERMIN]: { [field]: value },
    });
    return this;
  }
  public addMatch(type: IFindTypes, field: string, value: number | Date | string | boolean) {
    this._query['query']['bool'][type].push({
      [IFilterTypes.MATCH]: { [field]: value },
    });
    return this;
  }

  /**
   * Указать набор критериев через Bool
   * @param type
   * @param bool
   * @return {this}
   */
  public addBool(type: IFindTypes, bool: BoolBuilder) {
    this._query['query']['bool'][type].push(bool.build());
    return this;
  }

  /**
   * Фраза для поиска
   * @param type
   * @param field
   * @param value
   * @return {this}
   */
  public addTextPhrase(type: IFindTypes, field: string, value: string): this {
    this._query['query']['bool'][type].push({
      [IFilterTypes.MATCH_PHRASE]: { [field]: value },
    });
    return this;
  }

  /**
   * Указать массив критериев поиска (аналогия выше) по индексу
   * @param type
   * @param field
   * @param values
   * @return {this}
   */
  public addTermsArray(type: IFindTypes, field: string, values: string[] | number[]) {
    this._query['query']['bool'][type].push({
      [IFilterTypes.BY_ARRAY_TERMS]: { [field]: values },
    });
    return this;
  }

  /**
   * Указать критерий поиска на существование колонки
   * @param type
   * @param fieldName
   * @return {this}
   */
  public addExistsTerm(type: IFindTypes, fieldName: string) {
    this._query['query']['bool'][type].push({
      [IFilterTypes.EXISTS]: { field: fieldName },
    });
    return this;
  }

  /**
   * Указать диапазон поиска по индексу
   * @param type
   * @param field
   * @param value
   * @return {this}
   */
  public addRange(type: IFindTypes, field: string, value: IRangeFilter) {
    this._query['query']['bool'][type].push({
      [IFilterTypes.RANGE]: { [field]: value },
    });
    return this;
  }
  public addAggsTerms(key: string, field: string,missing:any = null) {
    let m ={};
    if(missing !== null){
      m['missing'] = missing
    }
    this._agg['aggs'][key] = {
      terms: { field,...m },
    };
    return this;
  }
  public addAggsMax(key: string, field: string) {
    this._agg['aggs'][key] = {
      max: { field, missing: 0 },
    };
    return this;
  }
  public addAggsMaxScript(key: string, b: ScriptBuilder | string) {
    if (ScriptBuilder.isScriptBuilder(b)) {
      this._agg['aggs'][key] = {
        max: {
          script: b.build(),
        },
      };
    } else {
      this._agg['aggs'][key] = {
        max: {
          script: b,
        },
      };
    }

    return this;
  }
  public addAggsMinScript(key: string, b: ScriptBuilder | string) {
    if (ScriptBuilder.isScriptBuilder(b)) {
      this._agg['aggs'][key] = {
        min: {
          script: b.build(),
        },
      };
    } else {
      this._agg['aggs'][key] = {
        min: {
          script: b,
        },
      };
    }

    return this;
  }
  public addAggsMin(key: string, field: string) {
    this._agg['aggs'][key] = {
      min: { field, missing: 0 },
    };
    return this;
  }

  public addFieldScript(b: ScriptBuilder | string) {
    if (ScriptBuilder.isScriptBuilder(b)) {
      this._script = b.build();
    } else {
      this._script = b;
    }
    return this;
  }

  /**
   * Свой запрос
   * @param type
   * @param filterType
   * @param filter
   * @return {this}
   */
  public addCustomFilter(type: IFindTypes, filterType: IFilterTypes, filter: any) {
    if (!this._query['query']['bool'].hasOwnProperty(type)) {
      this._query['query']['bool'][type] = [];
    }
    if (!this._query['query']['bool'].hasOwnProperty(type)) {
      this._query['query']['bool'][type] = [];
    }
    this._query['query']['bool'][type].push({
      [filterType]: filter,
    });
    return this;
  }

  /**
   * Вернуть запрос
   * @return {object}
   */
  public buildQuery(): object {
    const cond: any = {
      query: {
        bool: {},
      },
    };
    this._query.query.bool.must.length > 0 && (cond.query.bool['must'] = this._query.query.bool.must);
    this._query.query.bool.must_not.length > 0 && (cond.query.bool['must_not'] = this._query.query.bool.must_not);
    this._query.query.bool.should.length > 0 && (cond.query.bool['should'] = this._query.query.bool.should);
    this._query.size && (cond.size = this._query.size);
    (this._query as any ).sort && (cond.sort = (this._query as any ).sort);
    // console.log('cond', JSON.stringify(cond, null, 2));
    return {
      ...cond,
      ...this._agg,
      ...this._script,
    };
  }

  /**
   * Запрос для получения колличества записей
   * @return {Pick<any, Exclude<keyof any, "sort">>}
   */
  public buildCountQuery(): object {
    const { sort, ...all } = <any>this._query;
    return all;
  }

  /**
   * Получить сырой запрос
   * @return {string}
   * @private
   */
  public _getPrettyQuery() {
    return this.buildQuery();
  }

  /**
   * Установить максимальный размер выборки
   */
  public maxSampleSize() {
    this._query = { ...this._query, size: MAX_SAMPLE_SIZE };
    return this;
  }
}
