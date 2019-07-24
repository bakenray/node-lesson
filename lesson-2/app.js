var express = require('express')
var utility = require('utility')

var app = express()
app.get('/',function(req,res){
    console.log(req.query)
    var q = req.query.q
    var md5Value = utility.md5(q)
    res.send(md5Value)
})
app.listen(3000,function(){
    console.log('app is running at port 3000')
})

// 挑战，输入sha1值

// var express = require('express')
// var utility = require('utility')

// var app = express()

// app.get('/',function(req,res){
//     let q = req.query.q
//     var sha1Value = utility.sha1(q)
//     res.send(sha1Value)
// })
// app.listen(3000,function(){
//     console.log('listeing at 3000ss')
// })