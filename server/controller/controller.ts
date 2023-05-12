import cheerio from 'cheerio';
import axios from 'axios';

const getDataFromAmbito = async (): Promise<{ buy_price: number; sell_price: number; source: string } | undefined>  => {
  const url = 'https://www.ambito.com/contenidos/dolar-informal.html';
  let data: { buy_price: number; sell_price: number; source: string } | undefined;

  await axios.get(url)
  .then(response => {
    const $ = cheerio.load(response.data);
    const compra = $('.variation-max-min__value data-compra').text();
    const venta = $('.variation-max-min__value data-valor data-venta').text()
  
    const buy_price = 396.00;
    const sell_price = 400.00;
    const source = "https://www.ambito.com/contenidos/dolar.html";

    data = {buy_price, sell_price, source};
  })
  .catch(error => {
    console.log(error);
  });

  return data;
};


const getDataFromDolarhoy = async (): Promise<{ buy_price: number; sell_price: number; source: string } | undefined> => {
  const url = 'https://dolarhoy.com/';
  let data: { buy_price: number; sell_price: number; source: string } | undefined;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const buy_price = parseFloat($('.compra .val').text().split('$')[1]);
    const sell_price = parseFloat($('.venta .val').text().split('$')[1]);
    const source = "https://dolarhoy.com/";

    data = { buy_price, sell_price, source };
  } catch (error) {
    console.log(error);
  }

  return data;
};

const getDataFromCronista = async(): Promise<{buy_price: number, sell_price: number, source: string} | undefined> =>{
  const url = 'https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB';
  let data: { buy_price: number; sell_price: number; source: string } | undefined;

  await axios.get(url)
    .then(response => {
      const $ = cheerio.load(response.data);
      const compra = $('.buy-value').text().replace(/\$/g, '')
      const buy_price = parseFloat(compra.replace(',', '.'));

      const venta = $('.sell-value').text().replace(/\$/g, '')
      const sell_price = parseFloat(venta.replace(',', '.'));

      const source = "https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB";

      data = {buy_price, sell_price, source};
    })
    .catch(error => {
      console.log(error);
    });

    return data;
}

const getAllData = async (): Promise<{ambito_data?: any, dolarhoy_data?: any , cronista_data?: any}>=>{
  const ambito_data = await getDataFromAmbito();
  const dolarhoy_data = await getDataFromDolarhoy();
  const cronista_data = await getDataFromCronista();

  return {ambito_data, dolarhoy_data, cronista_data};
}

const getAverage = async(): Promise<{ average_buy_price: number; average_sell_price: number }> => {
  const ambito_data = await getDataFromAmbito();
  const dolarhoy_data = await getDataFromDolarhoy();
  const cronista_data = await getDataFromCronista();

  const total_buy_price = (ambito_data?.buy_price ?? 0) + (dolarhoy_data?.buy_price ?? 0) + (cronista_data?.buy_price??0);
  const total_sell_price = (ambito_data?.sell_price ?? 0) + (dolarhoy_data?.sell_price ?? 0) + (dolarhoy_data?.sell_price ?? 0);

  const average_buy_price = total_buy_price/3;
  const average_sell_price = total_sell_price/3;

  return {average_buy_price, average_sell_price};
};

const getSlippage = async() => {
  const ambito_data = await getDataFromAmbito();
  const dolarhoy_data = await getDataFromDolarhoy();
  const cronista_data = await getDataFromCronista();

  const ambito_buy_price = ambito_data?.buy_price;
  const dolarhoy_buy_price = dolarhoy_data?.buy_price;
  const cronista_buy_price = cronista_data?.buy_price;

  const ambito_sell_price = ambito_data?.sell_price;
  const dolarhoy_sell_price = dolarhoy_data?.sell_price;
  const cronista_sell_price = cronista_data?.sell_price;

  const average = await getAverage();
  const average_buy_price = average?.average_buy_price;
  const average_sell_price = average?.average_sell_price;

  const ambito_buy_price_slippage = ((ambito_buy_price - average_buy_price) / average_buy_price) * 100;
  const ambito_sell_price_slippage = ((ambito_sell_price - average_sell_price)/average_sell_price) * 100;
  const ambito_source = "https://www.ambito.com/contenidos/dolar.html";
  const ambitoData = {ambito_buy_price_slippage, ambito_sell_price_slippage, ambito_source}; 

  const dolarhoy_buy_price_slippage = ((dolarhoy_buy_price - average_buy_price) / average_buy_price) * 100;
  const dolarhoy_sell_price_slippage = ((dolarhoy_sell_price - average_sell_price)/average_sell_price) * 100;
  const dolarhoy_source = "https://dolarhoy.com/";
  const dolarhoyData = {dolarhoy_buy_price_slippage, dolarhoy_sell_price_slippage, dolarhoy_source};

  const cronista_buy_price_slippage = ((cronista_buy_price - average_buy_price) / average_buy_price) * 100;
  const cronista_sell_price_slippage = ((cronista_sell_price - average_sell_price)/average_sell_price) * 100;
  const cronista_source = "https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB";
  const cronistaData = {cronista_buy_price_slippage, cronista_sell_price_slippage, cronista_source};

  return {ambitoData, dolarhoyData, cronistaData};
};

export default { getAllData, getAverage, getSlippage };