// Stocks
import Base from "@stocks/base/api";
import NeteaseDataTransform from "@stocks/netease/dataTransform";
import NeteaseExchangeTransform from "@stocks/netease/exchangeTransform";

// Utils
import fetch from "@utils/fetch";

// Types
import Stock from "types/stock";

/**
 * 网易股票代码接口
 */
class Netease extends Base {
  /**
   * 构造函数
   */
  constructor() {
    super();
  }

  /**
   * 获取股票数据
   * @param code 需要获取的股票代码
   */
  async getStock(code: string): Promise<Stock> {
    const transform = (new NeteaseExchangeTransform).transform(code);

    const url = `https://api.money.126.net/data/feed/${transform},money.api?callback=topstock`;
    const res = await fetch.get(url);

    const items = JSON.parse(res.body.toString().replace(/\(|\)|;|(topstock)/g, ''));
    const params = items[transform];
    const data = (new NeteaseDataTransform(code, params));

    return {
      code: data.getCode(),
      name: data.getName(),
      percent: data.getPercent(),

      now: data.getNow(),
      low: data.getLow(),
      high: data.getHigh(),
      yesterday: data.getYesterday(),
    };
  }

  /**
   * 获取股票组数据
   * @param codes 需要获取的股票组代码
   */
  async getStocks(codes: string[]): Promise<Stock[]> {
    const transforms = (new NeteaseExchangeTransform).transforms(codes);

    const url = `https://api.money.126.net/data/feed/${transforms.join(',')},money.api?callback=topstock`;
    const res = await fetch.get(url);

    const items = JSON.parse(res.body.toString().replace(/\(|\)|;|(topstock)/g, ''));

    return codes.map(code => {
      const transform = (new NeteaseExchangeTransform).transform(code);
      const params = items[transform];
      const data = (new NeteaseDataTransform(code, params));

      return {
        code: data.getCode(),
        name: data.getName(),
        percent: data.getPercent(),

        now: data.getNow(),
        low: data.getLow(),
        high: data.getHigh(),
        yesterday: data.getYesterday(),
      }
    });
  }
}

export default Netease;
