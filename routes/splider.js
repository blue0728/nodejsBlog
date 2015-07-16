/**
 * Created by Administrator on 2015/4/14 0014.
 */
var request = require('request'),
    marked = require('marked'),             //markdown 解析
    cheerio = require('cheerio'),
    http = require('http'),
    url = require('url'),
    BufferHelper = require('bufferhelper'),
    Iconv = require('iconv-lite'),
    Post = require('../modles/post');

var host = 'http://digi.ithome.com/';// 文章列表

module.exports = function (app) {

    var parms = {
        url: host
    }

    app.get('/splider', function (req, res) {
        request(parms, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                var $ = cheerio.load(body);
                var $list = $('.cate_list').find('li');
                var urlList = [];
                var len = $list.length;

                for (var i = 0; i < len - 1; i++) {
                    urlList.push($list.find('a.list_thumbnail').eq(i).attr('href'));
                }

                res.render('splider', {
                    title: '主页',
                    user: req.session.user,
                    posts: urlList
                });

                //return;

                var m = 0;
                var timer = setInterval(function () {
                    console.log('正在抓去第'+ m +'条文章')

                    if (m > len) {
                        clearInterval(timer);
                        console.log('抓取完毕');
                        return;
                    }
                    request({url: urlList[m], encoding: null}, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var html = Iconv.decode(body, 'gb2312')
                            var $ = cheerio.load(html, {decodeEntities: false});
                            $('#paragraph').find('script').remove();
                            $('#paragraph').find('.s_tag').remove();
                            var title = $('.post_title h1').text();
                            var content = $('#paragraph').html();
                            var posts = {
                                title: title,
                                post: content
                            }

                            var currentUser = req.session.user.name,
                                _title = posts.title,
                                _post = posts.post.replace(/&nbsp;/ig, ''),
                                _summary = removeHTMLTag(marked(_post)).substr(0, 200);

                            var post = new Post(currentUser, _title, _post, _summary);

                            post.save(function (err) {
                                if (err) {
                                    console.log('添加到数据库里面失败');
                                    return;
                                }
                                console.log('添加到数据库里面成功');
                            });

                        }
                    });
                    m++;
                }, 3000);


            }
        });
    });

    /*格式化html*/
    function removeHTMLTag(str) {
        str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
        str = str.replace(/[ | ]*\n/g, ''); //去除行尾空白
        str = str.replace(/\n[\s| | ]*\r/g, ''); //去除多余空行
        str = str.replace(/&nbsp;/ig, '');//去掉&nbsp;
        return str;
    }
}


