const hapi = require("hapi");
const cheerio = require("cheerio");
const fs = require("fs");
const request = require("request");
const pdfFile = require("pdfkit");

const server = hapi.Server({
  host: "localhost",
  port: 3000
});

const init = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

server.route({
  method: "GET",
  path: "/",
  handler: (request, h) => {
    arr = ["http://1ditis.ru", "https://yandex.ru"];
    
    getSitePage(arr);
    // arr = request.query.array.split(",");

  }
});

init();

let topWords = [];
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
      
      if(err) throw err;

      let $ = cheerio.load(body);
      let text = $("body").text();
      let arrText = [];
      let arrFilterString = [];

      arrText = text.split(" ");

      for(i in arrText){
        arrFilterString.push(filterString(arrText[i]));
      }

      let stringSites = url + " - " + getTopWords(arrFilterString).join(" | ")+";"+"\n";

      // for(i in arr){
        topWords.push(stringSites);
      // }

      
      // fs.appendFileSync("sites.pdf", topWords);
    });
    topWords.join(";");
    return topWords;
  }

  pdf = new pdfFile;
  pdf.pipe(fs.createWriteStream("sites.pdf"));
  pdf.font("fonts/OpenSans/OpenSans-Regular.ttf");

  for(i in arr){
    // sendRequest(arr[i]);
    pdf.fontSize(14).text(sendRequest(arr[i]));
  }
  // pdf.font()
  // pdf.addPage().text(topWords);
  // pdf.text(topWords);
  pdf.end();

}