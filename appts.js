var hapi = require("hapi");
var ch = require("cheerio");
var fs = require("fs");
var request = require("request");
var pdfFile = require("pdfkit");
var server = hapi.Server({
    host: "localhost",
    port: 3000
});
var init = function () {
    server.start();
    console.log("Server running at: " + server.info.uri);
};
process.on("unhandledRejection", function (err) {
    console.log(err);
    process.exit(1);
});
server.route({
    method: "GET",
    path: "/",
    handler: function (request, h) {
        var arr = ["http://1ditis.ru", "https://yandex.ru", "https://vk.com"];
        getSitePage(arr, arr.length);
        var hello = "ReadMe \n This method for works with SiteTextAnalizator";
        return hello;
    }
});
init();
var getSitePage = function (arr, length) {
    var topWords = [];
    var pdf = new pdfFile;
    pdf.pipe(fs.createWriteStream("sites.pdf"));
    pdf.font("fonts/OpenSans/OpenSans-Regular.ttf");
    var sendRequest = function (url) {
        var countRequest = 0;
        request(url, function (err, response, body) {
            countRequest++;
            var filterString = function (string) {
                // Отфильтровывает строку от \n и пробелов
                var newString = "";
                for (var i in string) {
                    if (string[i] == "\n" || string[i] == " ") {
                        newString = newString + "";
                    }
                    else {
                        newString = newString + string[i];
                    }
                }
                return newString;
            };
            var decreasingSort = function (wordA, wordB) {
                // Функция для сортировки массива по убыванию
                return wordB.score - wordA.score;
            };
            var getTopWords = function (arr) {
                // Возврщает массив трех топ-слов
                var arrData = [];
                var arrResult = [];
                var arrRaiting = [];
                var topWords = [];
                var raiting = {};
                for (var i in arr) {
                    if (arr[i] != "") {
                        arrData.push(arr[i]);
                    }
                }
                for (var i in arrData) {
                    if (arrData[i].length < 4) {
                    }
                    else {
                        arrResult.push(arrData[i].toLowerCase());
                    }
                }
                for (var i in arrResult) {
                    var word = arrResult[i];
                    if (raiting[word] != undefined) {
                        raiting[word]++;
                    }
                    else {
                        raiting[word] = 1;
                    }
                }
                for (var key in raiting) {
                    arrRaiting.push(new Object({ word: key, score: raiting[key] }));
                }
                arrRaiting.sort(decreasingSort);
                topWords = [arrRaiting[0].word, arrRaiting[1].word, arrRaiting[2].word];
                return topWords;
            };
            if (err)
                throw err;
            var $ = ch.load(body);
            var text = $("body").text();
            var arrText = [];
            var arrFilterString = [];
            arrText = text.split(" ");
            for (var i in arrText) {
                arrFilterString.push(filterString(arrText[i]));
            }
            pdf.fontSize(14).text(url + " - " + getTopWords(arrFilterString).join(" | ") + ";" + "\n");
            if (countRequest == length) {
                pdf.end();
            }
        });
    };
    for (var i in arr) {
        sendRequest(arr[i]);
    }
};
