const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

// let url = "http://nodejs.org/dist/index.json";

let getSitePage = (arr) => {
  let nameFile = "";

  let sendRequest = (url) => {
    request(url, (err, res, body) => {
      console.log(url);

      if(err) throw err;
      
      let $ = cheerio.load(body);
      let text = $("body").text();
      arrData = text.split(' ');
      // arrData = JSON.stringify(arrData);
      for(let i in arrData){
        if(arrData[i]=="" || arr[i]==" " || arrData[i]==null){
          arrData.splice(i, 1);
        }
      }
      console.log(arrData[1]);
      // console.log(arrData);
      fs.writeFileSync(nameFile+':log.txt', arrData);
      
     
    });
  }

  for (i in arr){
    sendRequest(arr[i]);
  }

  return true;
}



arr = ["https://ria.ru/20190315/1551813506.html?in=t", "http://1ditis.ru"];

getSitePage(arr);