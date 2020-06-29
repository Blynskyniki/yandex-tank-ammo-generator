export function isScriptBuilder(b: ScriptBuilder | string): b is ScriptBuilder {
  return true;
}

export class ScriptBuilder {
  public static Math = {
    generateMaxFunction: (valuesPath: string[]) => {
      let tmp = `Math.max(0,`;
      tmp += valuesPath.map(item => `params['_source']${item}`).join(',');
      tmp += ')';
      return tmp;
    },
    generateMaxFunctionOfArray: (cities: string[]) => {
      let tmp = 'def price=0; for( city in [';
      tmp += cities.map(item => `'${item}'`).join(',');

      tmp += `]){ if(params['_source']['cities'][city] !== null){price = Math.max(params['_source']['cities'][city]['price'],price) }} return price;`;
      return tmp;
    },
    generateMinFunction: (valuesPath: string[]) => {
      let tmp = `Math.min(999999,`;
      tmp += valuesPath.map(item => `params['_source']${item}`).join(',');
      tmp += ')';
      return tmp;
    },
  };

  public static isScriptBuilder(b: ScriptBuilder | string): b is ScriptBuilder {
    return typeof b !== 'string';
  }
  private _scripts = {
    script_fields: {},
  };

  /**
   * Добавить свой скрипт
   * @param fieldName
   * @param source
   * @return {this}
   */
  public addCustomField(fieldName: string, source: string) {
    this._scripts.script_fields[fieldName] = {
      script: {
        source,
      },
    };
    return this;
  }

  /**
   * Билд
   * @return {{script_fields: {currentPrice: {script: {source: string}}}}}
   */
  public build() {
    return this._scripts;
  }
}
