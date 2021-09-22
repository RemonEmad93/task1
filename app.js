const express= require("express");
const morgan = require('morgan'); 
const mongoose= require('mongoose');
const bodyParser= require("body-parser");
const axios = require("axios").default;
const blogRoutes= require('./routes/blogRoutes');

const app= express();

app.use(bodyParser.urlencoded({extended: true}));

const dburl= "mongodb+srv://netninja:test1234@nodetuts.lb02x.mongodb.net/node-tuts?retryWrites=true&w=majority";

mongoose.connect(dburl, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result)=> app.listen(process.env.PORT || 3000,function(){
    console.log("the server in running");}))
.catch((err)=>console.log(err));

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));

app.get("/covid19",function(req,res){
    res.render("covid19Data",{title:'covid19 details'});
});  



app.post("/", function(req,res){
    var cname= req.body.countryName;
    var options = {
        method: 'GET',
        url: 'https://covid-19-data.p.rapidapi.com/country',
        params: {name: cname, format: 'json'},
        headers: {
          'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
          'x-rapidapi-key': '43424c14f6msh8c5d51faf76d38cp1f8151jsn0d7cde46d386'
        }
    };

    axios.request(options)
        .then(function (response) {

            res.render("covid19post",{title:'covid19 details',
                                        cName: response.data[0].country, 
                                        confirmed: response.data[0].confirmed,
                                        recoverd: response.data[0].recovered,
                                        deaths: response.data[0].deaths});

            res.send();})
        .catch(function (error) {
            console.error(error);
    });
});

app.get("/",function(req, res){
    res.redirect('/blogs');
});

app.get("/about",function(req, res){
    res.render('about',{title:'About'});
});

app.use('/blogs',blogRoutes);

app.use((req, res)=>{
    res.status(404).render('404');
});


