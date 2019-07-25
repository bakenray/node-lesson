var superagent = require('superagent')
var cheerio = require('cheerio')
var url = require('url')
var async = require('async')

var condeUrl = 'https://cnodejs.org/'



superagent.get(condeUrl).end(function(err,res){
    var topicUrls = []
    if(err){return console.log(err)}
    var $ = cheerio.load(res.text)
    $('.topic_title').each(function(idx,element){
        var href = url.resolve(condeUrl,$(element).attr('href'))
        topicUrls.push(href)
    })

    // var concurrencyCount = 0
    var fetchUrl = function(url,callback){
        // var delay = parseInt((Math.random() * 10000000) % 2000,10)
        // concurrencyCount++
        // console.log('现在的并发数是',concurrencyCount,'正在抓取的是',url,'耗时',delay,'毫秒'))

        superagent.get(url).end(function(err,res){
            if(err){return console.log(err)}
            var $2 = cheerio.load(res.text)
            var comment  = $2('.reply_content').eq(0).text().trim()
        
            callback(null,comment)
        })  

    }   
    async.mapLimit(topicUrls,5,function(url,callback){
        fetchUrl(url,callback)
    },function(err,result){
        if(err){
            console.log(err)
            return
        }

        console.log('final:')
        console.log(result)   
    })

})


// var concurrencyCount = 0
// var fetchUrl = function(url,callback){
//     var delay = parseInt((Math.random() * 10000000) % 2000,10)
//     concurrencyCount++
//     console.log('现在的并发数是',councurrencyCount,'正在抓取的是',url,'耗时',delay,'毫秒')
//     setTimeout(function(){
//         concurrencyCount--
//         callback(null,url + 'html content')
//     },delay)
// }


// var urls = []
// for(var i =0;i<30;i++){
//     urls.push('http://xxxx' + i)
// }

// async.mapLimit(urls,5,function(url,callback){
//     fetchUrl(url,callback)
// },function(err,result){
//     if(err){
//         console.log(err)
//         return
//     }
//     console.log('final:')
//     console.log(result)   
// })

