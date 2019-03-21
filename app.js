const request = require('request');
const fs = require('fs');

let url = "http://nodejs.org/dist/index.json";

// request(url, (err, res, body) => {
//   if(err) throw err;

//   console.log(res.statusCode);
//   console.log(body);
//   fs.writeFileSync('log.txt', body);
// });

let getSitePage = (arr) => {
  let nameFile = "";

  let sendRequest = (url) => {
    request(url, (err, res, body) => {
      console.log(url);
      if(err) throw err;
      nameFile = url.split("//");
      fs.writeFileSync(nameFile[1]+".html", body);
    });
  }

  for (i in arr){
    sendRequest(arr[i]);
  }

  return true;
}



arr = ['https://www.1ditis.ru', 'https://yandex.ru', 'https://google.com', 'https://youtube.com'];

getSitePage(arr);