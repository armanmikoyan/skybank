import axios from "axios";

export default async function currencyConverter(from: string, to: string, amount: number) {
   const options = {
      method: 'GET',
      url: 'https://currency-conversion-and-exchange-rates.p.rapidapi.com/convert',
      params: { from, to, amount},
      headers: {
        'x-rapidapi-key': '491a7f1240mshfb17d28b7ecd191p1346ddjsndcfab97d1932',
        'x-rapidapi-host': 'currency-conversion-and-exchange-rates.p.rapidapi.com'
      }
    }; 
   const { data } = await axios.request(options);
   return data;
}