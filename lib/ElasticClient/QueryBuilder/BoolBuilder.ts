import { IFilterTypes, IFindTypes, IRangeFilter } from './index';
interface IQueryBool {
  bool: {
    must: any[];
    must_not: any[];
    should: any[];
  };
}
export class BoolBuilder {
  private _query: IQueryBool = {
    bool: {
      must: [],
      must_not: [],
      should: [],
    },
  };
  public addBool(type: IFindTypes, bool: BoolBuilder) {
    this._query.bool[type].push(bool.build());
    return this;
  }

  /**
   * Проверка на наличие добавленых критериев
   * @return {boolean}
   */
  public isNotEmty(): boolean {
    return this._query.bool.must.length > 0 || this._query.bool.must_not.length > 0 || this._query.bool.should.length > 0;
  }

  /**
   * Указать диапазон поиска по индексу
   * @param type
   * @param field
   * @param value
   * @return {this}
   */
  public addRange(type: IFindTypes, field: string, value: IRangeFilter) {
    this._query.bool[type].push({
      [IFilterTypes.RANGE]: { [field]: value },
    });
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
    this._query.bool[type].push({
      [IFilterTypes.BY_TERMIN]: { [field]: value },
    });
    return this;
  }

  /**
   * Текстовый поиск
   * @param type
   * @param field
   * @param value
   * @return {this}
   */
  public addMatch(type: IFindTypes, field: string, value: number | Date | string | boolean) {
    this._query.bool[type].push({
      [IFilterTypes.MATCH]: { [field]: value },
    });
    return this;
  }
  public addMatchText(type: IFindTypes, field: string, value: string): this {
    this._query.bool[type].push({
      [IFilterTypes.MATCH]: {
        [field]: {
          query: value,
          fuzziness: 'AUTO',
          operator: 'and',
        },
      },
    });
    return this;
  }

  /**
   * Фраза для поиска
   * @param type
   * @param field
   * @param value
   * @return {this}
   */
  public addMatchPhrase(type: IFindTypes, field: string, value: string): this {
    this._query.bool[type].push({
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
  public addTermsArray(type: IFindTypes, field: string, values: string[]) {
    this._query.bool[type].push({
      [IFilterTypes.BY_ARRAY_TERMS]: { [field]: values },
    });
    return this;
  }

  public build() {
    const cond: any = {
      bool: {},
    };
    this._query.bool.must.length > 0 && (cond.bool['must'] = this._query.bool.must);
    this._query.bool.must_not.length > 0 && (cond.bool['must_not'] = this._query.bool.must_not);
    this._query.bool.should.length > 0 && (cond.bool['should'] = this._query.bool.should);
    return cond;
  }
}
