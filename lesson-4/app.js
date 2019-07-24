var url = require('url')
var cheerio = require('cheerio')
var eventproxy = require('eventproxy')
var superagent = require('superagent')

var cnodeUrl = 'https://cnodejs.org'

superagent.get(cnodeUrl)
    .end(function(err,res){
        if(err){ return console.log(err)}

        var topicUrls = []
        var $ = cheerio.load(res.text)

        $('#topic_list .topic_title').each(function(idx,element){
            if(idx>=5){ return }

            var $element = $(element)
            var href = url.resolve(cnodeUrl,$element.attr('href'))
            topicUrls.push(href)
        })

        var ep = new eventproxy()
        ep.after('topic_arrs',topicUrls.length,function(topics){

            topics = topics.map(function(topicPair){
                var topicUrl = topicPair[0]
                var $ = topicPair[1]
                var score = topicPair[2]
              
                return({
                    thitle:$('.topic_full_title').text().trim(),
                    href:topicUrl,
                    comment1:$('.reply_content').eq(0).text().trim(),
                    author1:$('.user_avatar img').attr('title'),
                    score:score
                }) 
            })
            console.log('final:')
            console.log(topics)            
        })

        topicUrls.forEach(function(topicUrl){
            
            superagent.get(topicUrl)
                .end(function(err,res){
                    if(err){return console.log(err)}

                    var $ = cheerio.load(res.text)
                    var userPath = $('.user_avatar').attr('href')
                    var userUrl = url.resolve(cnodeUrl,userPath)
                    superagent.get(userUrl)
                        .end(function(err,res2){
                            if(err){ return console.log(err) }
                            var $2 = cheerio.load(res2.text)
                            var scores = $2('.user_profile .big').text()
                            ep.emit('topic_arr',[topicUrl,$,scores])
                    }) 
                })
        })
    })