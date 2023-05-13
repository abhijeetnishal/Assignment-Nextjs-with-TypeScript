"use client";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import styles from './page.module.css';

const ENDPOINT = "http://localhost:4000";
const socket = io(ENDPOINT);

const Page: React.FC = () => {
  const [quotes, setQuotes] = useState<any>(null);
  const [average, setAverage] = useState<any>(null);
  const [slippage, setSlippage] = useState<any>(null);

  useEffect(() => {
      socket.on("connect", () => {
        console.log("Connected to server");
        socket.emit("getQuotes");
        socket.emit("getAverage");
        socket.emit("getSlippage");
      });

      const intervalId = setInterval(() => {

        socket.on("quotes", (data) => {
          //console.log("Received quotes:", data);
          setQuotes(data);
        });
    
        socket.on("average", (data) => {
          //console.log("Received average:", data);
          setAverage(data.value);
        });
    
        socket.on("slippage", (data) => {
          //console.log("Received slippage:", data);
          setSlippage(data);
        });
    
        return () => {
          socket.disconnect();
          console.log("Disconnected from server");
        };
     }, 500);
    
      return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.app}>
      <h1 className={styles.heading}>Quotes</h1>
      <div>
        {
          quotes? (quotes.cronista_data ? 
            (
            <div className={styles.quotes}>
              <div className={styles.cronista}>
                <div className="">
                  cronista_data
                </div>
                <div>
                  buy_price: {quotes.cronista_data?.buy_price} USD
                </div>
                <div>
                  sell_price: {quotes.cronista_data?.sell_price} USD
                </div>
                <div>
                  source: {quotes.cronista_data?.source}
                </div>
              </div>
              <div className={styles.cronista}>
                <div>
                dolarhoy_data
                </div>
                <div>
                  buy_price: {quotes.dolarhoy_data?.buy_price} USD
                </div>
                <div>
                  sell_price: {quotes.dolarhoy_data?.sell_price} USD
                </div>
                <div>
                  source: {quotes.dolarhoy_data?.source}
                </div>
              </div>
              <div className={styles.cronista}>
                <div>
                  ambito_data
                </div>
                <div>
                  buy_price: {quotes.ambito_data?.buy_price} USD
                </div>
                <div>
                  sell_price: {quotes.ambito_data?.sell_price} USD
                </div>
                <div>
                  source: {quotes.ambito_data?.source}
                </div>
              </div>
            </div>
            ) :
            (
              <div className={styles.loading}>
                Loading...
              </div>
            )
            ) 
          :
          (<div className={styles.loading}>
            Loading...
          </div>)
        }
      </div>

      <h1 className={styles.heading}>Average</h1>
      <div>
        {
          average?
          (
            <div className={styles.average}> 
              <div className={styles.buy}>
                Average Buy Price: {average.average_buy_price} USD
              </div>
              <div className={styles.sell}>
                Average Sell Price: {average.average_sell_price} USD
              </div>
            </div>
          ):
          (
            <div className={styles.loading}>Loading...</div>
          )
        }
      </div>

      <h1 className={styles.heading}>Slippage</h1>
      <div>
        {
          slippage? (slippage.ambitoData ? 
            (
            <div className={styles.quotes}>
              <div className={styles.cronista}>
                <div>
                  cronista_data
                </div>
                <div>
                  buy_price_slippage: {slippage.cronistaData.cronista_buy_price_slippage}
                </div>
                <div>
                  sell_price_slippage: {slippage.cronistaData.cronista_sell_price_slippage}
                </div>
                <div>
                  source: {slippage.cronistaData.cronista_source}
                </div>
              </div>
              <div className={styles.cronista}>
                <div>
                dolarhoy_data
                </div>
                <div>
                  buy_price_slippage: {slippage.dolarhoyData.dolarhoy_buy_price_slippage}
                </div>
                <div>
                  sell_price_slippage: {slippage.dolarhoyData.dolarhoy_sell_price_slippage}
                </div>
                <div>
                  source: {slippage.dolarhoyData.dolarhoy_source}
                </div>
              </div>
              <div className={styles.cronista}>
                <div>
                  ambito_data
                </div>
                <div>
                  buy_price_slippage: {slippage.ambitoData.ambito_buy_price_slippage}
                </div>
                <div>
                  sell_price_slippage: {slippage.ambitoData.ambito_sell_price_slippage}
                </div>
                <div>
                  source: {slippage.ambitoData.ambito_source}
                </div>
              </div>
            </div>
            ) :
            (
              <div className={styles.loading}>
                Loading...
              </div>
            )
            ) 
          :
          (<div className={styles.loading}>
            Loading...
          </div>)
        }
      </div>
    </div>
  )
}

export default Page