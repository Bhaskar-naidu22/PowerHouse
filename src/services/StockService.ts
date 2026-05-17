import Config from "react-native-config";
import { StockProps } from "../components/StockCard";
import axios from "axios";

// console.log("BASE_URL Check:", Config.BASE_URL);
// console.log("API_KEY Check:", Config.STOCK_API_KEY ? "Found" : "Missing");
// const API_KEY = Config.STOCK_API_KEY
// const BASE_URL = Config.BASE_URL
const API_KEY = "cOj13HILbEH8sAVi5y8dRcrdA7v1s4gv"
const BASE_URL = "https://financialmodelingprep.com/stable/"

export const StockService = {
    searchStocks: async (query: string): Promise<StockProps[]> => {
        try {
            const response = await axios.get(`${BASE_URL}/search-name`, {
                params: {
                    query: query,
                    apikey: API_KEY,
                },
            });
            return response.data.filter((item: any) => item.exchange === 'NSE').
                map((item: any) => ({
                    symbol: item.symbol,
                    price: 0, // The search endpoint doesn't always provide price
                    change: 0,
                    name: item.name,
                    exchange: item.exchange
                }));

        } catch (error: any) {
            const message = error.response?.data?.['Error Message'] || "API Limit reached or Network Error";
            throw new Error(message);
        }
    },

    fetchPrices: async (query: string): Promise<StockProps[]> => {
        try {
            const response = await axios.get(`${BASE_URL}/profile`, {
                params: {
                    symbol: query,
                    apikey: API_KEY,
                },
            });
            debugger
            return response.data.filter((item: any) => item.exchange === 'NSE').
                map((item: any) => ({
                    symbol: item.symbol,
                    price: item.price, // The search endpoint doesn't always provide price
                    change: item.change,
                    name: item.name,
                }));


        } catch (error: any) {
            const message = error.response?.data?.['Error Message'] || "API Limit reached or Network Error";
            throw new Error(message);
        }
    }
}