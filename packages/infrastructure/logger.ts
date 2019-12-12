import * as Logger from 'pino';
import * as factory from 'pino-pretty';
// "pino": "=4.16.1",
// "pino-pretty": "=1.0.1",
const writable = process.stdout;

// // не юзается
// const dest = factory({
//   colorize: true, // --colorize
//   crlf: false, // --crlf
//   errorLikeObjectKeys: ['err', 'error', 'fatal'], // --errorLikeObjectKeys
//   errorProps: '', // --errorProps
//   levelFirst: false, // --levelFirst
//   messageKey: 'msg', // --messageKey
//   translateTime: false, // --translateTime
//   search: 'foo == `bar`', // --search
//   ignore: 'pid,hostname,level,time', // --ignore
// }).asMetaWrapper(writable);

/**
 * @Class Log
 * @Classdesc Логи с цветовой индикацией при отображении и уровнями логов.
 */

export class Log {
  private readonly _name: string = process.env.SERVICE_NAME || '';
  private _location: string;
  private _nativeLogger: Logger.Logger;
  private _cacheTimers: any = {};

  constructor() {
    this._nativeLogger = Logger({
      name: 'Kari',
      safe: true,
      level: (process.env.LOGLEVEL || 'debug').toString(),
      prettyPrint: true,
    });
  }
  public setLocation(locationOrHandlerName: string): Log {
    this._location = locationOrHandlerName || 'oldLog';
    return <Log>this;
  }
  public getLogger(): Log {
    this._location = 'oldLog';
    return <Log>this;
  }

  private toStringArray = (arr: any[]): string[] => arr.map(item => this.customStringify(item));
  private customStringify = (item: any): string => {
    if (!item) {
      return String(item);
    }
    if (typeof item === 'string') {
      return item;
    }
    if (item instanceof Error) {
      return JSON.stringify(item.stack ? item.stack.toString() : item.toString());
    }
    return JSON.stringify(item);
  };
  private getBody(args) {
    return JSON.stringify({
      service: this._name,
      location: this._location,
      data: this.toStringArray(args).join(' '),
    }).toString();
  }

  public time(timerName: string): void {
    this._cacheTimers[timerName] = new Date();
  }
  public timeEnd(timerName: string): void {
    if (this._cacheTimers.hasOwnProperty(timerName)) {
      this.debug(`Таймер ${timerName}. Результат  ${+new Date() - +this._cacheTimers[timerName]} ms`);
      this._cacheTimers[timerName] = undefined;
    }
    this.error(`Таймер ${timerName} не был установлен`);
  }
  public fatal = (...args: Array<string | any>): void => this._nativeLogger.fatal(this.getBody(args));
  public error = (...args: Array<string | any>): void => this._nativeLogger.error(this.getBody(args));
  public warn = (...args: Array<string | any>): void => this._nativeLogger.warn(this.getBody(args));
  public info = (...args: Array<string | any>): void => this._nativeLogger.info(this.getBody(args));
  public debug = (...args: Array<string | any>): void => this._nativeLogger.debug(this.getBody(args));
  public trace = (...args: Array<string | any>): void => this._nativeLogger.trace(this.getBody(args));
}

export const logger = new Log().setLocation('oldLog');
