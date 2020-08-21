const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require('axios');

// estou dizendo para o express usar o ejs como view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// rotas
app.get("/",(req, res) => {
    var resposta = req.params.resposta;
    if(resposta){
        resposta = true;
    }else{
        resposta = false;
    }
    var url = "https://api.hgbrasil.com/finance/quotations?key=58db6e68";
    axios.get(url).then(resp => {
        var cotacao =  resp.data.results.currencies;
        res.render("index", {
            cotacao: cotacao,
            resposta: resposta
        });
    });
});

app.post("/cotacao", (req, res) => {
    var ativo = req.body.Ticker.toUpperCase();
    var url = "https://api.hgbrasil.com/finance/stock_price?&fields=only_results&key=58db6e68&symbol=" + ativo;
    axios.get(url).then(resp => {
        var cotacao =  resp.data[ativo];
        if(cotacao.symbol != ativo){  
            res.redirect("/");
        }else{
            res.render("cotacao", {
                cotacao: cotacao,
                ativo: ativo
            });
        };
    });
});

app.get("/moedas",(req, res) => {
    var url = "https://api.hgbrasil.com/finance/quotations?key=58db6e68";
    axios.get(url).then(resp => {
	    var cotacao =  resp.data.results;
	    res.render("moedas", {
            cotacao: cotacao
        })
    })
});

app.listen(8080, () => {
    console.log("app rodando!");
});