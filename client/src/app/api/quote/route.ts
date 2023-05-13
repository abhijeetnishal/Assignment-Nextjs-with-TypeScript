import { NextResponse } from "next/server";
import cheerio from "cheerio";

// const ambitoData = async ()=>{
//     try{
//         const source = 'https://www.ambito.com/contenidos/dolar.html';
//         const response = await fetch(source);
//         const html = await response.text();
        
//         const $ = cheerio.load(html);
//         const buy_price = $('.data-valor.data-venta').text();
//         const sell_price = $('.venta .val').text();

//         return {buy_price, sell_price, source};
//     }
//     catch(error){
//         console.log(error);
//     }
// }

const getDolarhoyData = async ()=>{
    try{
        const source = 'https://dolarhoy.com/'
        const response = await fetch(source);
        const html = await response.text();
        
        const $ = cheerio.load(html);
        const buy_price = parseFloat($('.compra .val').text().split('$')[1]);
        const sell_price = parseFloat($('.venta .val').text().split('$')[1]);

        return {buy_price, sell_price, source};
    }
    catch(error){
        console.log(error);
    }
}

const getCronistaData = async ()=>{
    try{
        const source = 'https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB'
        const response = await fetch(source);
        const html = await response.text();
        
        const $ = cheerio.load(html);
        const compra = $('.buy-value').text().replace(/\$/g, '')
        const buy_price = parseFloat(compra.replace(',', '.'));

        const venta = $('.sell-value').text().replace(/\$/g, '')
        const sell_price = parseFloat(venta.replace(',', '.'));

        return {buy_price, sell_price, source};
    }
    catch(error){
        console.log(error);
    }
}

const data = async() =>{
    const dolarhoyData = getDolarhoyData();
    const cronistaData = getCronistaData();
    
    //parrallel data fetching
    const [dolarhoy, cronista] = await Promise.all([dolarhoyData, cronistaData]);
    const quoteData = {dolarhoy, cronista};

    //average
    const total_buy_price = (dolarhoy?.buy_price ?? 0) + (cronista?.buy_price ?? 0);
    const total_sell_price = (dolarhoy?.sell_price ?? 0) + (cronista?.sell_price?? 0);
    const average_buy_price = total_buy_price/2;
    const average_sell_price = total_sell_price/2;
    const averageData = {average_buy_price, average_sell_price};

    //slippage
    const dolarhoy_buy_price_slippage = (((dolarhoy?.buy_price ?? 0) - average_buy_price) / average_buy_price) * 100;
    const dolarhoy_sell_price_slippage = (((dolarhoy?.sell_price ?? 0) - average_sell_price) / average_sell_price) * 100;
    const dolarhoy_source = "https://dolarhoy.com/";
    const dolarhoySlippageData = {dolarhoy_buy_price_slippage, dolarhoy_sell_price_slippage, dolarhoy_source};

    const cronista_buy_price_slippage = (((cronista?.buy_price ?? 0) - average_buy_price) / average_buy_price) * 100;
    const cronista_sell_price_slippage = (((cronista?.sell_price ?? 0) - average_sell_price) / average_sell_price) * 100;
    const cronista_source = "https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB";
    const cronistaSlippageData = {cronista_buy_price_slippage, cronista_sell_price_slippage, cronista_source};

    const slippageData = {dolarhoySlippageData, cronistaSlippageData};

    return NextResponse.json([quoteData, averageData, slippageData]);
}

export default data;