import req from './req';
import Event from '../Event';
import * as EnvConsts from '../../env-consts';

const MAX_ATTEMPTS = 120;
const API_DATA = 'ticker.json';
const API_FEE_DATA = 'feeData.json';

export default class Ticker {

    constructor() {
        this.event = new Event();

        this.ready = false;
        this.data = {};
        this.feeValue = null;

        this.load();
        this.loadFeeData();
    }

    load() {
        return this.loadWithAttempts(() => req
            .getJson(`${EnvConsts.API_URL}${API_DATA}`)
            .then((tickerData) => {
                this.ready = true;
                this.data = tickerData;
                this.data.assets = [
                    {
                        activityScore: 27.559,
                        change24h_USD: -5.53,
                        change24h_XLM: 1.75,
                        code: "BGPT",
                        depth10_USD: 64.513,
                        depth10_XLM: 631,
                        domain: "bitgamepro.com",
                        id: "BGPT-GBLCXY2T5XR4G4TLZL3UAF3GV6IXDKZSTE3RSZZQYRE33I5X55Z34AXC",
                        issuer: "GBLCXY2T5XR4G4TLZL3UAF3GV6IXDKZSTE3RSZZQYRE33I5X55Z34AXC",
                        numAsks: 20,
                        numBids: 20,
                        numTrades24h: 387,
                        price_USD: 3.6709,
                        price_XLM: 35.904,
                        slug: "BGPT-bitgamepro.com",
                        spread: 0.001,
                        topTradePairSlug: "BGPT-bitgamepro.com/XLM-native",
                        volume24h_USD: 24892.53,
                        volume24h_XLM: 243471.53,
                        website: "https://bitgamepro.com",
                        _numTradeRecords24h: 62,
                    },
                    {
                        activityScore: 27.559,
                        change24h_USD: -5.53,
                        change24h_XLM: 1.75,
                        code: "BGPUSD",
                        depth10_USD: 64.513,
                        depth10_XLM: 631,
                        domain: "bitgamepro.com",
                        id: "BGPUSD-GBLCXY2T5XR4G4TLZL3UAF3GV6IXDKZSTE3RSZZQYRE33I5X55Z34AXC",
                        issuer: "GBLCXY2T5XR4G4TLZL3UAF3GV6IXDKZSTE3RSZZQYRE33I5X55Z34AXC",
                        numAsks: 20,
                        numBids: 20,
                        numTrades24h: 387,
                        price_USD: 1.001,
                        price_XLM: 9.702,
                        slug: "BGPUSD-bitgamepro.com",
                        spread: 0.001,
                        topTradePairSlug: "BGPUSD-bitgamepro.com/XLM-native",
                        volume24h_USD: 24892.53,
                        volume24h_XLM: 243471.53,
                        website: "https://bitgamepro.com",
                        _numTradeRecords24h: 62,
                    },
                    {
                        activityScore: 27.559,
                        change24h_USD: -5.53,
                        change24h_XLM: 1.75,
                        code: "BGPPromo",
                        depth10_USD: 64.513,
                        depth10_XLM: 631,
                        domain: "bitgamepro.com",
                        id: "BGPPromo-GBLCXY2T5XR4G4TLZL3UAF3GV6IXDKZSTE3RSZZQYRE33I5X55Z34AXC",
                        issuer: "GBLCXY2T5XR4G4TLZL3UAF3GV6IXDKZSTE3RSZZQYRE33I5X55Z34AXC",
                        numAsks: 20,
                        numBids: 20,
                        numTrades24h: 387,
                        price_USD: 1.001,
                        price_XLM: 9.702,
                        slug: "BGPPromo-bitgamepro.com",
                        spread: 0.001,
                        topTradePairSlug: "BGPPromo-bitgamepro.com/XLM-native",
                        volume24h_USD: 24892.53,
                        volume24h_XLM: 243471.53,
                        website: "https://bitgamepro.com",
                        _numTradeRecords24h: 62,
                    },
                ].concat(tickerData.assets);
                this.data.pairs = Object.assign({},
                    {
                        'BGPT/XLM-native': {
                            ask: 2.8318626,
                            baseBuying: {
                                code: "BGPT",
                                issuer: "GBLCXY2T5XR4G4TLZL3UAF3GV6IXDKZSTE3RSZZQYRE33I5X55Z34AXC",
                            },
                            bid: 2.8092981,
                            counterSelling: {
                                code: "XLM",
                                issuer: null,
                            },
                            depth10Amount: 36,
                            numTrades24h: 20,
                            price: 2.8205804,
                            spread: 0.008,
                            volume24h_XLM: 109.06,
                        },
                    }, this.data.pairs);
                console.log(this.data);
                console.log(`Loaded ticker. Data generated ${Math.round((new Date() - (this.data._meta.start * 1000)) / 1000)} seconds ago.`);

                this.event.trigger();
                setTimeout(() => this.load(), 61 * 5 * 1000); // Refresh every 5 minutes
            }), 'Unable to load ticker');
    }

    loadWithAttempts(promiseFunction, message = 'Error', attempt) {
        if (attempt >= MAX_ATTEMPTS) {
            return Promise.reject();
        }

        return promiseFunction()
            .catch((error) => {
                console.log(message, error);
                const nextAttempt = (attempt || 0) + 1;
                setTimeout(() => this.loadWithAttempts(promiseFunction, message, nextAttempt), 1000);
            });
    }

    loadFeeData() {
        return this.loadWithAttempts(() => req
            .getJson(`${EnvConsts.API_URL}${API_FEE_DATA}`)
            .then((feeData) => {
                this.feeValue = feeData.fee_value;
                this.event.triggerSpecial('fee-changed', this.feeValue);
                setTimeout(() => this.loadFeeData(), 61 * 1000); // Refresh every 1 minutes
            }), 'Unable to load fee stats');
    }
}
