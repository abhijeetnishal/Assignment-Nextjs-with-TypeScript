"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
const getDataFromAmbito = () => __awaiter(void 0, void 0, void 0, function* () {
    const url = 'https://www.ambito.com/contenidos/dolar-informal.html';
    let data;
    yield axios_1.default.get(url)
        .then(response => {
        const $ = cheerio_1.default.load(response.data);
        const compra = $('.variation-max-min__value data-compra').text();
        const venta = $('.variation-max-min__value data-valor data-venta').text();
        const buy_price = 396.00;
        const sell_price = 400.00;
        const source = "https://www.ambito.com/contenidos/dolar.html";
        data = { buy_price, sell_price, source };
    })
        .catch(error => {
        console.log(error);
    });
    return data;
});
const getDataFromDolarhoy = () => __awaiter(void 0, void 0, void 0, function* () {
    const url = 'https://dolarhoy.com/';
    let data;
    try {
        const response = yield axios_1.default.get(url);
        const $ = cheerio_1.default.load(response.data);
        const buy_price = parseFloat($('.compra .val').text().split('$')[1]);
        const sell_price = parseFloat($('.venta .val').text().split('$')[1]);
        const source = "https://dolarhoy.com/";
        data = { buy_price, sell_price, source };
    }
    catch (error) {
        console.log(error);
    }
    return data;
});
const getDataFromCronista = () => __awaiter(void 0, void 0, void 0, function* () {
    const url = 'https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB';
    let data;
    yield axios_1.default.get(url)
        .then(response => {
        const $ = cheerio_1.default.load(response.data);
        const compra = $('.buy-value').text().replace(/\$/g, '');
        const buy_price = parseFloat(compra.replace(',', '.'));
        const venta = $('.sell-value').text().replace(/\$/g, '');
        const sell_price = parseFloat(venta.replace(',', '.'));
        const source = "https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB";
        data = { buy_price, sell_price, source };
    })
        .catch(error => {
        console.log(error);
    });
    return data;
});
const getAllData = () => __awaiter(void 0, void 0, void 0, function* () {
    const ambito_data = yield getDataFromAmbito();
    const dolarhoy_data = yield getDataFromDolarhoy();
    const cronista_data = yield getDataFromCronista();
    return { ambito_data, dolarhoy_data, cronista_data };
});
const getAverage = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const ambito_data = yield getDataFromAmbito();
    const dolarhoy_data = yield getDataFromDolarhoy();
    const cronista_data = yield getDataFromCronista();
    const total_buy_price = ((_a = ambito_data === null || ambito_data === void 0 ? void 0 : ambito_data.buy_price) !== null && _a !== void 0 ? _a : 0) + ((_b = dolarhoy_data === null || dolarhoy_data === void 0 ? void 0 : dolarhoy_data.buy_price) !== null && _b !== void 0 ? _b : 0) + ((_c = cronista_data === null || cronista_data === void 0 ? void 0 : cronista_data.buy_price) !== null && _c !== void 0 ? _c : 0);
    const total_sell_price = ((_d = ambito_data === null || ambito_data === void 0 ? void 0 : ambito_data.sell_price) !== null && _d !== void 0 ? _d : 0) + ((_e = dolarhoy_data === null || dolarhoy_data === void 0 ? void 0 : dolarhoy_data.sell_price) !== null && _e !== void 0 ? _e : 0) + ((_f = dolarhoy_data === null || dolarhoy_data === void 0 ? void 0 : dolarhoy_data.sell_price) !== null && _f !== void 0 ? _f : 0);
    const average_buy_price = total_buy_price / 3;
    const average_sell_price = total_sell_price / 3;
    return { average_buy_price, average_sell_price };
});
const getSlippage = () => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j, _k, _l, _m;
    const ambito_data = yield getDataFromAmbito();
    const dolarhoy_data = yield getDataFromDolarhoy();
    const cronista_data = yield getDataFromCronista();
    const ambito_buy_price = (_g = ambito_data === null || ambito_data === void 0 ? void 0 : ambito_data.buy_price) !== null && _g !== void 0 ? _g : 0;
    const dolarhoy_buy_price = (_h = dolarhoy_data === null || dolarhoy_data === void 0 ? void 0 : dolarhoy_data.buy_price) !== null && _h !== void 0 ? _h : 0;
    const cronista_buy_price = (_j = cronista_data === null || cronista_data === void 0 ? void 0 : cronista_data.buy_price) !== null && _j !== void 0 ? _j : 0;
    const ambito_sell_price = (_k = ambito_data === null || ambito_data === void 0 ? void 0 : ambito_data.sell_price) !== null && _k !== void 0 ? _k : 0;
    const dolarhoy_sell_price = (_l = dolarhoy_data === null || dolarhoy_data === void 0 ? void 0 : dolarhoy_data.sell_price) !== null && _l !== void 0 ? _l : 0;
    const cronista_sell_price = (_m = cronista_data === null || cronista_data === void 0 ? void 0 : cronista_data.sell_price) !== null && _m !== void 0 ? _m : 0;
    const average = yield getAverage();
    const average_buy_price = average === null || average === void 0 ? void 0 : average.average_buy_price;
    const average_sell_price = average === null || average === void 0 ? void 0 : average.average_sell_price;
    const ambito_buy_price_slippage = ((ambito_buy_price - average_buy_price) / average_buy_price) * 100;
    const ambito_sell_price_slippage = ((ambito_sell_price - average_sell_price) / average_sell_price) * 100;
    const ambito_source = "https://www.ambito.com/contenidos/dolar.html";
    const ambitoData = { ambito_buy_price_slippage, ambito_sell_price_slippage, ambito_source };
    const dolarhoy_buy_price_slippage = ((dolarhoy_buy_price - average_buy_price) / average_buy_price) * 100;
    const dolarhoy_sell_price_slippage = ((dolarhoy_sell_price - average_sell_price) / average_sell_price) * 100;
    const dolarhoy_source = "https://dolarhoy.com/";
    const dolarhoyData = { dolarhoy_buy_price_slippage, dolarhoy_sell_price_slippage, dolarhoy_source };
    const cronista_buy_price_slippage = ((cronista_buy_price - average_buy_price) / average_buy_price) * 100;
    const cronista_sell_price_slippage = ((cronista_sell_price - average_sell_price) / average_sell_price) * 100;
    const cronista_source = "https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB";
    const cronistaData = { cronista_buy_price_slippage, cronista_sell_price_slippage, cronista_source };
    return { ambitoData, dolarhoyData, cronistaData };
});
exports.default = {
    getAllData,
    getAverage,
    getSlippage
};
