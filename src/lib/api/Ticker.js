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
                        id: 'BGPT-bitgamepro.com',
                        code: 'BGPT',
                        issuer: 'GDQI2N6MPTTJJ7ECE4UFM3HBQCOINVBJDHMEUL2BTPIAALSVD6KFO2IA',
                        domain: 'bitgamepro.com',
                        slug: 'BGPT-bitgamepro.com',
                        website: 'https://bitgamepro.com',
                        price_XLM: 1, // LOL 1 dogecoin = 1 dogecoin; 1 lumen = 1 lumen
                        price_USD: 1,
                    },
                    {
                        id: 'BGPUSD-bitgamepro.com',
                        code: 'BGPUSD',
                        issuer: 'GDQI2N6MPTTJJ7ECE4UFM3HBQCOINVBJDHMEUL2BTPIAALSVD6KFO2IA',
                        domain: 'bitgamepro.com',
                        slug: 'BGPUSD-bitgamepro.com',
                        website: 'https://bitgamepro.com',
                        price_XLM: 1, // LOL 1 dogecoin = 1 dogecoin; 1 lumen = 1 lumen
                        price_USD: 1,
                    },
                    {
                        id: 'BGPPromo-bitgamepro.com',
                        code: 'BGPPromo',
                        issuer: 'GDQI2N6MPTTJJ7ECE4UFM3HBQCOINVBJDHMEUL2BTPIAALSVD6KFO2IA',
                        domain: 'bitgamepro.com',
                        slug: 'BGPPromo-bitgamepro.com',
                        website: 'https://bitgamepro.com',
                        price_XLM: 1, // LOL 1 dogecoin = 1 dogecoin; 1 lumen = 1 lumen
                        price_USD: 1,
                    },
                ].concat(tickerData.assets);
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
