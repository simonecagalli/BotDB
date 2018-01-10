var mysql = require('mysql');

var TelegramBot = require('node-telegram-bot-api'),
// Be sure to replace YOUR_BOT_TOKEN with your actual bot token on this line.
        telegram = new TelegramBot("410107682:AAFenV_RV7F4hW-kcPIU0VKYY20KMye6GY8", {
            polling: true
        });


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "mydb"
});
con.connect(function (err) {
    if (err)
        throw err;
});

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
;

function dataBase(myq) {
    con.query(myq, function (err, result) {
        if (err)
            throw err;
        JSON.stringify(result);
    });
}
;


telegram.on("text", (message) => {

    if (message.text.toLowerCase().indexOf("/show") === 0) {
        var lol = message.text.split(" ");
        var arg1 = lol[1];
        con.query("select if(count(*)=0 ,'non trovato','trovato') from mydb.oggetti where nome regexp '" + arg1 + "'", function (err, result) {
            if (err)
                throw err;
            var sc = JSON.stringify(result);
            var sc = sc.replace("\[{\"if(count(*)=0 ,'non trovato','trovato')\":", "");
            if (arg1 === undefined) {
                con.query("SELECT * FROM oggetti", function (err, result) {
                    if (err)
                        throw err;
                    var tre = JSON.stringify(result);
                    var lol = tre.replace(/{"nome":"/g, "- ");
                    var lol1 = lol.replace(/","quantita":/g, " x");
                    var lol2 = lol1.replace(/,/g, "\n");
                    var lol2_1 = lol2.replace(/}|{/g, "");
                    var lol3 = lol2_1.replace("[", "Al momento ti mancano:\n");
                    var lol3 = lol3.substring(0, lol3.length - 1);
                    telegram.sendMessage(message.chat.id, lol3);
                });
            } else if (sc === "\"trovato\"}]") {
                con.query("select nome from mydb.oggetti where nome regexp '" + arg1 + "'", function (err, result) {
                    if (err)
                        throw err;
                    var dc = JSON.stringify(result);
                                        var dc = dc.replace("[", "Ti mancano:\n");
                    var dc = dc.replace(/{"nome":"/g, "- ");
                    var dc = dc.replace(/}|{|"/g, "");
                    var dc = dc.substring(0, dc.length - 1);
                    con.query("select quantita from mydb.oggetti where nome regexp '" + arg1 + "'", function (err, result2) {
                        if (err)
                            throw err;
                        var dc2 = JSON.stringify(result2);
                        var dc2 = dc2.replace(/{"quantita":/g, " x");
                        var dc2 = dc2.replace(/}|{|"|\[|\]/g, "");
                        dc = dc.split(",");
                        dc2 = dc2.split(",");
                        ss = "";
                        for (var c in dc){
                         ss=ss+dc[c]+dc2[c]+"\n";
                         }
                         telegram.sendMessage(message.chat.id, "" + ss);
                    });
                }
                );
            }
            ;
        });
    }
});


telegram.on("text", (message) => {
    if (message.text.toLowerCase().indexOf("/sub") === 0) {
        var lol = message.text.split(" ");
        var arg1 = lol[1];
        var arg2 = lol[2];
        con.query("select if(count(*)=0 ,'non trovato','trovato') from mydb.oggetti where nome regexp '" + arg2 + "'", function (err, result) {
            if (err)
                throw err;
            var aa = JSON.stringify(result);
            var aa = aa.replace("\[{\"if(count(*)=0 ,'non trovato','trovato')\":", "");
            if (arg1 === undefined) {
                telegram.sendMessage(message.chat.id, "Ma togliere cosa?\n/sub [n] <oggetto>");
            } else if (isNumeric(arg1) && aa === "\"trovato\"}]") {
                if (arg1 > 0) {





                }
            }
        });
    }
});
telegram.on("text", (message) => {

    if (message.text.toLowerCase().indexOf("/listino") === 0) {
        telegram.sendPhoto(message.chat.id, "http://imghost.io/images/2017/11/04/a9d28557-df37-479a-a60e-5f01ae5e6b26.jpg");
    }
});
