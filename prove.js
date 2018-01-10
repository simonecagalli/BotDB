/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


telegram.on("text", (message) => {
    if (message.text.toLowerCase().indexOf("/sub") === 0) {
        var lol = message.text.split(" ");
        var arg1 = lol[1];
        var arg2 = lol[2];
        var sql2 = "select if(count(*)=0 ,'non trovato','trovato') from mydb.oggetti where nome regexp '" + arg2 + "'";
        var sql1 = "select if(count(*)=0 ,'non trovato','trovato') from mydb.oggetti where nome regexp '" + arg1 + "'";
        var sql3 = "select quantita from mydb.oggetti where nome regexp '" + arg1 + "'";
        var sql4 = "select quantita from mydb.oggetti where nome regexp '" + arg2 + "'";
        var ll = operazioni(sql4);
        if (arg1 === undefined) {
            telegram.sendMessage(message.chat.id, "Ma togliere cosa?\n/sub [n] <oggetto>");
        } else if (isNumeric(arg1) && operazioni(sql2) === "trovato") {
            if (arg1 > 0) {
                var sub = ll - arg1;
                operazioni("update mydb.oggetti set quantita=" + sub + " where nome regexp '" + arg2 + "'");
                telegram.sendMessage(message.chat.id, "Ora cerchi: " + operazioni("select nome from oggetti.nome where nome regexp '" + arg2 + "'") + " x" + operazioni(sql4));
                var gg = operazioni("select * from mydb.oggetti");
                for (var val in gg) {
                    if (gg[val] <= 0) {
                        telegram.sendMessage(message.chat.id, "\"" + operazioni("select nome from oggetti.nome where nome regexp '" + arg2 + "'") + "\" è stato rimosso dalla lista!");
                        operazioni("delete from mydb.oggetti where oggetti.quantita <=0");
                    }
                }
            } else {
                telegram.sendMessage(message.chat.id, "Deve essere un numero positivo, piccolo birbantello.");
            }
        } else if (!isNumeric(arg1) && operazioni(sql1) === "trovato") {
            var decr = ll - 1;
            operazioni("update mydb.oggetti set quantita=" + decr + " where nome regexp '" + arg1 + "'");
            telegram.sendMessage(message.chat.id, "Ora cerchi: " + operazioni("select nome from oggetti.nome where nome regexp '" + arg1 + "'") + " x" + operazioni(sql3));
            var hh = operazioni("select * from mydb.oggetti");
            for (var val in hh) {
                if (hh[val] <= 0) {
                    telegram.sendMessage(message.chat.id, "\"" + operazioni("select nome from oggetti.nome where nome regexp '" + arg1 + "'") + "\" è stato rimosso dalla lista!");
                    operazioni("delete from mydb.oggetti where oggetti.quantita <=0");
                }
            }
        } else if (isNumeric(arg1) && operazioni(sql2) === "non trovato") {
            telegram.sendMessage(message.chat.id, "\"" + arg2 + "\" non è nella lista!");
        } else if (!isNumeric(arg1) && operazioni(sql1) === "non trovato") {
            telegram.sendMessage(message.chat.id, "\"" + arg1 + "\" non è nella lista!");
        }
        ;


    }});