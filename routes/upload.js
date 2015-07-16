/**
 * Created by Administrator on 2015/7/16.
 */

module.exports = function (app) {
    app.get('/upload', function (req,res) {
        res.render('upload',{user: req.session.user});
    })
}