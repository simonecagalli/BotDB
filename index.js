var mysql = require('mysql');

var TelegramBot = require('node-telegram-bot-api'),
// Be sure to replace YOUR_BOT_TOKEN with your actual bot token on this line.
        telegram = new TelegramBot("410107682:AAFenV_RV7F4hW-kcPIU0VKYY20KMye6GY8", {
            polling: true

        });

var con = mysql.createConnection({
    host: "eu-cdbr-west-01.cleardb.com",
    user: "b30bac3a8b6eaa",
    password: "13ff7d6f",
    database: "heroku_8eeec60b9a5a4e8"
});
con.connect(function (err) {
    if (err)
        throw err;
});

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
;
var utenti = ["SimoneCagalli", "MegaFigo"];
telegram.on("text", (message) => {
    if (!(utenti.indexOf(message.from.username)===-1)) {

        if (message.text.toLowerCase().match("/start")) {

            telegram.sendMessage(message.chat.id, "Benvenuto, @"+message.from.username+"! Per cominciare usa i comandi.");
        }

        if (message.text.toLowerCase().indexOf("/show") === 0) {
            var lol = message.text.split(" ");
            var arg1 = null;
            if (lol[2] === undefined) {
                arg1 = lol[1];
            } else {
                arg1 = lol[1] + " " + lol[2];
            }

            con.query("select if(count(*)=0 ,'non trovato','trovato') from heroku_8eeec60b9a5a4e8.oggetti where nome regexp '" + arg1 + "'", function (err, result) {
                if (err)
                    throw err;
                var sc = JSON.stringify(result);
                var sc = sc.replace("\[{\"if(count(*)=0 ,'non trovato','trovato')\":", "");
                if (arg1 === undefined) {
                    con.query("SELECT * FROM heroku_8eeec60b9a5a4e8.oggetti", function (err, result) {
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
                    con.query("select nome from heroku_8eeec60b9a5a4e8.oggetti where nome regexp '" + arg1 + "'", function (err, result) {
                        if (err)
                            throw err;
                        var dc = JSON.stringify(result);
                        var dc = dc.replace("[", "Ti mancano:\n");
                        var dc = dc.replace(/{"nome":"/g, "- ");
                        var dc = dc.replace(/}|{|"/g, "");
                        var dc = dc.substring(0, dc.length - 1);
                        con.query("select quantita from heroku_8eeec60b9a5a4e8.oggetti where nome regexp '" + arg1 + "'", function (err, result2) {
                            if (err)
                                throw err;
                            var dc2 = JSON.stringify(result2);
                            var dc2 = dc2.replace(/{"quantita":/g, " x");
                            var dc2 = dc2.replace(/}|{|"|\[|\]/g, "");
                            dc = dc.split(",");
                            dc2 = dc2.split(",");
                            ss = "";
                            for (var c in dc) {
                                ss = ss + dc[c] + dc2[c] + "\n";
                            }
                            telegram.sendMessage(message.chat.id, "" + ss);
                        });
                    }
                    );
                } else {
                    telegram.sendMessage(message.chat.id, "Al momento non stai cercando questo oggetto.\nO hai sbagliato a scrivere? ¯\\_(ツ)_/¯");
                }
            });
        }
        ;


        if (message.text.toLowerCase().indexOf("/sub") === 0) {
            var lol = message.text.split(" ");
            var arg1 = lol[1];
            var arg2 = lol[2];
            con.query("select if(count(*)=0 ,'non trovato','trovato') from heroku_8eeec60b9a5a4e8.oggetti where nome regexp '" + arg2 + "'", function (err, result) {
                if (err)
                    throw err;
                var aa = JSON.stringify(result);
                var aa = aa.replace("\[{\"if(count(*)=0 ,'non trovato','trovato')\":", "");
                con.query("select if(count(*)=0 ,'non trovato','trovato') from heroku_8eeec60b9a5a4e8.oggetti where nome regexp '" + arg1 + "'", function (err, result) {
                    if (err)
                        throw err;
                    var bb = JSON.stringify(result);
                    var bb = bb.replace("\[{\"if(count(*)=0 ,'non trovato','trovato')\":", "");
                    if (arg1 === undefined) {
                        telegram.sendMessage(message.chat.id, "Ma togliere cosa?\n/sub [n] <oggetto>");
                    } else if (isNumeric(arg1) && aa === "\"trovato\"}]") {
                        if (arg1 > 0) {
                            con.query("select quantita from heroku_8eeec60b9a5a4e8.oggetti where nome regexp '" + arg2 + "'", function (err, result) {
                                if (err)
                                    throw err;
                                var aa = JSON.stringify(result);
                                cc = aa.split(",");
                                if (cc.length > 1) {
                                    telegram.sendMessage(message.chat.id, cc.length + " risultati trovati! Sii più specifico :P");
                                } else {
                                    var aa = aa.substring(0, aa.length - 2);
                                    var aa = aa.replace("[{\"quantita\":", "");
                                    var aa = parseInt(aa);
                                    var aa = aa - arg1;
                                    con.query("update heroku_8eeec60b9a5a4e8.oggetti set quantita=" + aa + " where nome regexp '" + arg2 + "'", function (err, result) {
                                        if (err)
                                            throw err;
                                        telegram.sendMessage(message.chat.id, "Ora ne cerchi solo " + aa + ".");
                                        if (aa <= 0) {
                                            con.query("delete from heroku_8eeec60b9a5a4e8.oggetti where oggetti.nome like '" + arg2 + "'", function (err, result) {
                                                if (err)
                                                    throw err;
                                                con.query("select nome from heroku_8eeec60b9a5a4e8.oggetti where oggetti.nome like '" + arg2 + "'", function (err, result) {
                                                    if (err)
                                                        throw err;
                                                    var dc = JSON.stringify(result);
                                                    var dc = dc.replace("[", "\"");
                                                    var dc = dc.replace(/{"nome":"/g, "");
                                                    var dc = dc.replace(/}|{|"/g, "");
                                                    var dc = dc.substring(0, dc.length - 1);
                                                    telegram.sendMessage(message.chat.id, "\"" + arg2 + "\" è stato rimosso dalla lista.");
                                                });
                                            });
                                        }
                                        ;
                                    });
                                }
                                ;
                            });
                        } else {
                            telegram.sendMessage(message.chat.id, "Deve essere un numero positivo, piccolo birbantello.");
                        }
                    } else if (isNumeric(arg1) && aa === "\"non trovato\"}]" || !isNumeric(arg1) && bb === "\"non trovato\"}]") {
                        telegram.sendMessage(message.chat.id, "L'oggetto non è nella lista.");
                    } else if (!isNumeric(arg1) && bb === "\"trovato\"}]") {
                        con.query("select quantita from heroku_8eeec60b9a5a4e8.oggetti where nome regexp '" + arg1 + "'", function (err, result) {
                            if (err)
                                throw err;
                            var aa = JSON.stringify(result);
                            cc = aa.split(",");
                            if (cc.length > 1) {
                                telegram.sendMessage(message.chat.id, cc.length + " risultati trovati! Sii più specifico :P");
                            } else {
                                var aa = aa.substring(0, aa.length - 2);
                                var aa = aa.replace("[{\"quantita\":", "");
                                var aa = parseInt(aa);
                                var aa = aa - 1;
                                con.query("update heroku_8eeec60b9a5a4e8.oggetti set quantita=" + aa + " where nome regexp '" + arg1 + "'", function (err, result) {
                                    if (err)
                                        throw err;
                                    telegram.sendMessage(message.chat.id, "Ora ne cerchi solo " + aa + ".");
                                    if (aa <= 0) {
                                        con.query("delete from heroku_8eeec60b9a5a4e8.oggetti where oggetti.nome like '" + arg1 + "'", function (err, result) {
                                            if (err)
                                                throw err;
                                            con.query("select nome from heroku_8eeec60b9a5a4e8.oggetti where oggetti.nome like '" + arg1 + "'", function (err, result) {
                                                if (err)
                                                    throw err;
                                                var dc = JSON.stringify(result);
                                                var dc = dc.replace("[", "\"");
                                                var dc = dc.replace(/{"nome":"/g, "");
                                                var dc = dc.replace(/}|{|"/g, "");
                                                var dc = dc.substring(0, dc.length - 1);
                                                telegram.sendMessage(message.chat.id, "'" + arg1 + "' è stato rimosso dalla lista.");
                                            });
                                        });
                                    }
                                    ;
                                });
                            }
                            ;
                        });

                    }
                    ;
                });
            });
        }


        if (message.text.toLowerCase().indexOf("/listino") === 0) {
            telegram.sendPhoto(message.chat.id, "http://imghost.io/images/2017/11/04/a9d28557-df37-479a-a60e-5f01ae5e6b26.jpg");
        }


        if (message.text.toLowerCase().indexOf("/del") === 0) {
            var lol = message.text.split(" ");
            var arg1 = lol[1];
            con.query("select if(count(*)=0 ,'non trovato','trovato') from heroku_8eeec60b9a5a4e8.oggetti where nome = '" + arg1 + "'", function (err, result) {
                if (err)
                    throw err;
                var aa = JSON.stringify(result);
                var aa = aa.replace("\[{\"if(count(*)=0 ,'non trovato','trovato')\":", "");
                if (arg1 === undefined) {
                    telegram.sendMessage(message.chat.id, "Cosa vuoi eliminare?\n/del <oggetto>");
                } else if (aa === "\"trovato\"}]") {
                    con.query("delete from heroku_8eeec60b9a5a4e8.oggetti where oggetti.nome like '" + arg1 + "'", function (err, result) {
                        if (err)
                            throw err;
                        telegram.sendMessage(message.chat.id, "'" + arg1 + "' eliminato dalla lista.");
                    });
                } else if (aa === "\"non trovato\"}]") {
                    telegram.sendMessage(message.chat.id, "\"" + arg1 + "\" Non trovato!\nUsa /show per vedere gli oggetti presenti nella lista.");
                }

            });
        }

        if (message.text.toLowerCase().indexOf("/ins") === 0) {
            var lol = message.text.split(" ");
            var arg1 = lol[1];
            var arg2 = lol[2];
            con.query("select if(count(*)=0 ,'non trovato','trovato') from heroku_8eeec60b9a5a4e8.oggetti where nome = '" + arg1 + "'", function (err, result) {
                if (err)
                    throw err;
                var aa = JSON.stringify(result);
                var aa = aa.replace("\[{\"if(count(*)=0 ,'non trovato','trovato')\":", "");
                con.query("select if(count(*)=0 ,'non trovato','trovato') from heroku_8eeec60b9a5a4e8.oggetti where nome = '" + arg2 + "'", function (err, result) {
                    if (err)
                        throw err;
                    var bb = JSON.stringify(result);
                    var bb = bb.replace("\[{\"if(count(*)=0 ,'non trovato','trovato')\":", "");
                    if (arg1 === undefined) {
                        telegram.sendMessage(message.chat.id, "Cosa vuoi inserire?\n/new [n] <oggetto>");
                    } else if (isNumeric(arg1) && bb === "\"trovato\"}]" || !isNumeric(arg1) && aa === "\"trovato\"}]") {
                        telegram.sendMessage(message.chat.id, "È già presente nella lista!");
                    } else if (!isNumeric(arg1) && aa === "\"non trovato\"}]") {
                        con.query("INSERT INTO heroku_8eeec60b9a5a4e8.oggetti (nome,quantita) VALUES ('" + arg1 + "',1);", function (err, result) {
                            if (err)
                                throw err;
                            telegram.sendMessage(message.chat.id, "Aggiunto '" + arg1 + "' x1 alla lista!");
                        });
                    } else if (isNumeric(arg1) && bb === "\"non trovato\"}]") {
                        if (arg1 > 0) {
                            con.query("INSERT INTO heroku_8eeec60b9a5a4e8.oggetti (nome,quantita) VALUES ('" + arg2 + "'," + arg1 + ");", function (err, result) {
                                if (err)
                                    throw err;
                                telegram.sendMessage(message.chat.id, "Aggiunto '" + arg2 + "' x" + arg1 + " alla lista!");
                            });
                        } else {
                            telegram.sendMessage(message.chat.id, "Deve essere un numero positivo, piccolo birbantello.");
                        }
                    }
                });
            });
        }

        if (message.text.toLowerCase().indexOf("/avviso") === 0) {
            var lol = message.text.split(" ");
            var arg1 = lol[1];
            if (arg1 === undefined) {
                telegram.sendMessage(message.chat.id, "Cosa vuoi fissare?");
            } else {
                var st = message.text.substr(8);
                st = st.replace(/'/g, "''");
                st = st.replace(/\n/g, "\n");
                con.query("update heroku_8eeec60b9a5a4e8.inline set messaggio='" + st + "' where colonnainutile=1", function (err, result) {
                    if (err)
                        throw err;
                    telegram.sendMessage(message.chat.id, "Messaggio fissato.");
                });
            }
        }
        ;
    } else {
        telegram.sendMessage(message.chat.id, "@"+message.from.username+", non hai il permesso di usare questo bot!");
    }
});

telegram.on("inline_query", (query) => {
    con.query("select messaggio from heroku_8eeec60b9a5a4e8.inline where colonnainutile=1", function (err, result) {
        if (err)
            throw err;
        var aa = JSON.stringify(result);
        var bb = aa.substr(15);
        var cc = bb.substring(0, bb.length - 3);
        var dd = cc.replace(/\n/g, /\n/);
        telegram.answerInlineQuery(query.id, [
            {

                type: "article",
                id: "testarticle",
                title: "#cerco:..." + dd,
                input_message_content: {
                    message_text: "#cerco:" + dd
                }
            }
        ]);
    });
});
