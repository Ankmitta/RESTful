const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");

const app=express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));



mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema={ title:String, content:String};

const Article=mongoose.model("Article",articleSchema);

//Requests targeting All articles

app.route("/articles")
                                                            //Chaining Method using route in EJS (get,post,delete are chained in single route)
.get(function(req,res){
  Article.find(function(err,foundarticles){
    if (!err)
    {res.send(foundarticles);}
    else {
      res.send(err);
    }
  });
})

.post(function(req,res){                                          //Triggers post request using PostMan and data is stored in MongoDB
  console.log();
  console.log();

  const newArticle=new Article({
    title:req.body.title,
    content:req.body.content
  })
  newArticle.save(function(err){                                        //Just saving and logging for errors if any.
    if(!err){
      res.send("Yehh Successfull");
    } else {
      res.send(err);
    };
  });
})

.delete(function(req,res){

  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all items")
    } else {
      res.send("Oops some error in deleting")
    }
  });

});
///////Requests Targeting specific articles

app.route("/articles/:articletitle")
  .get(function(req,res ){

    Article.findOne({title:req.params.articletitle},function(err,foundarticle){
      if(foundarticle){
        res.send(foundarticle);
      } else {
        res.send(err);
      }
    });

  })

  .put(function(req,res){
    Article.update({title:req.params.articletitle},
    {title:req.body.title,content:req.body.content},
  {overwrite:true}, function(err){
    if (!err){
      res.send("update success")
    }
    else {
      res.send("opps something wrong")
    };
  });
  })

  .patch(function(req,res){
    Article.update(
      {title:req.params.articletitle},
      {$set:req.body},
      function(err) {
        if(!err){
          res.send("Successfully updated ");
        } else{
          res.send(err);
        }
      }
    )
  })

  .delete(function(req,res){
    Article.deleteOne(
      {title:req.params.articletitle},
      function(err){
        if (!err){
          res.send("delete success");
        }else {
          res.send(err);
        }
      }
    )
  });





app.listen("3000",function(req,res){
  console.log("server started on this port");
})
