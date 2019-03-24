const hapi = require("hapi");
const cheerio = require("cheerio");
const fs = require("fs");
const request = require("request");

const server = hapi.Server({
  host: "localhost",
  port: 3000
});

let getSitePage = (arr) => {

  let sendRequest = (url) => {

    request(url, (err, response, body) => {

      let filterString = (string) => {
        // Отфильтровывает строку от \n и пробелов
        let newString = "";
        
        for(i in string){
          if(string[i]=="\n" || string[i]==" "){
            newString = newString+"";
          }
          else{
            newString = newString+string[i];
          }
        }
        return newString;
      }

      let decreasingSort = (wordA, wordB) => {
        // Функция для сортировки массива по убыванию
        return wordB.score - wordA.score;
      }

      let getTopWords = (arr) => {
        // Возврщает массив трех топ-слов
        let arrData = [];
        let arrResult = [];
        let arrRaiting = [];
        let topWords = [];
        let raiting = {};

        for(i in arr){
          if(arr[i]!=""){
            arrData.push(arr[i]);
          }
        }
        
        for(i in arrData){
          if(arrData[i].length<4){
  
          }
          else{
            arrResult.push(arrData[i].toLowerCase());
          }
        }

        for (i in arrResult){
          let word = arrResult[i];
          if (raiting[word] != undefined){
            raiting[word]++;
          }
          else{
            raiting[word] = 1;
          }
        }

        for(key in raiting){
          arrRaiting.push(new Object({word: key, score: raiting[key]}));
        }
  
        arrRaiting.sort(decreasingSort);
  
        topWords = [arrRaiting[0].word, arrRaiting[1].word, arrRaiting[2].word];

        return topWords;
      }
      
      console.log(url);

      if(err) throw err;

      let $ = cheerio.load(body);
      let text = $("body").text();
      let arrText = [];
      let arrFilterString = [];

      arrText = text.split(" ");

      for(i in arrText){
        arrFilterString.push(filterString(arrText[i]));
      }

      let topWords = url + " - " + getTopWords(arrFilterString).join(" | ")+"\n";



      fs.appendFileSync("sites.pdf", topWords);

 

      


      

      

      // console.log(arrResult);
      console.log(getTopWords(arrFilterString));
    });
  }

  for(i in arr){
    sendRequest(arr[i]);
  }

}


arr = ["http://1ditis.ru", "https://yandex.ru"];

getSitePage(arr);

console.log(1);