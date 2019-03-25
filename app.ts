const hapi = require("hapi");
const ch = require("cheerio");
const fs = require("fs");
const request = require("request");
const pdfFile = require("pdfkit");

const server = hapi.Server({
  host: "localhost",
  port: 3000,
});


const init = async () => {

  process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
  });

  server.route({
    method: "GET",
    path: "/getSitePage",
    handler: (request, h) => {
      let arr = request.query.array.split(";");
      getSitePage(arr, arr.length);
      return "<a href='"+server.info.uri+"/sites.pdf'>"+server.info.uri+"/sites.pdf</a>"
    }
  });

  server.route({
    method: "GET",
    path: "/sites.pdf",
    handler: (request, h) => {
      return h.file("sites.pdf");
    }
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return h.file("static/index.html");
    }
  });

  await server.start();
  server.register(require("inert"));
  console.log(`Server running at: ${server.info.uri}`);

}

init();

declare let countRequest;

let getSitePage = (arr, length) => {

  let pdf = new pdfFile;
  pdf.pipe(fs.createWriteStream("sites.pdf"));
  pdf.font("fonts/OpenSans/OpenSans-Regular.ttf");

  let sendRequest = (url:string) => {

    countRequest = 0;
    
    request(url, (err, response, body:string) => {
      countRequest++;

      let filterString = (string) => {
        // Отфильтровывает строку от \n и пробелов
        let newString = "";
        
        for(let i in string){
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

        for(let i in arr){
          if(arr[i]!=""){
            arrData.push(arr[i]);
          }
        }
        
        for(let i in arrData){
          if(arrData[i].length<4){
  
          }
          else{
            arrResult.push(arrData[i].toLowerCase());
          }
        }

        for (let i in arrResult){
          let word = arrResult[i];
          if (raiting[word] != undefined){
            raiting[word]++;
          }
          else{
            raiting[word] = 1;
          }
        }

        for(let key in raiting){
          arrRaiting.push(new Object({word: key, score: raiting[key]}));
        }
  
        arrRaiting.sort(decreasingSort);
  
        topWords = [arrRaiting[0].word, arrRaiting[1].word, arrRaiting[2].word];

        return topWords;
      }
      
      if(err) throw err;

      let $ = ch.load(body);
      let text = $("body").text();
      let arrText = [];
      let arrFilterString = [];

      arrText = text.split(" ");

      for(let i in arrText){
        arrFilterString.push(filterString(arrText[i]));
      }

      pdf.fontSize(14).text(url + " - " + getTopWords(arrFilterString).join(" | ")+";"+"\n");
      if(countRequest== length){
        pdf.end();
      }
    });
  }

  for(let i in arr){
    sendRequest(arr[i]);
  }
}