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

      let deleteElem = (arr, index) => {
        arr.splice(index-1, 1);
        return arr;
      }
      
      console.log(url);

      if(err) throw err;

      let $ = cheerio.load(body);
      let text = $("body").text();
      let arrText = [];
      let arrFilterString = [];
      let arrData = [];
      arrText = text.split(" ");

      for(i in arrText){
        arrFilterString.push(filterString(arrText[i]));
      }

      for(i in arrFilterString){
        if(arrFilterString[i]!=""){
          arrData.push(arrFilterString[i]);
        }
      }

      for(i in arrData[i]){

      }

      console.log(arrData);
    });
  }

  for(i in arr){
    sendRequest(arr[i]);
  }

}


arr = ["http://1ditis.ru"];

getSitePage(arr);

console.log(1);