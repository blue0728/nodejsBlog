/**
 * Created by Administrator on 2015/7/16.
 */

module.exports = function (app) {
    app.get('/upload', function (req,res) {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        res.render('upload', {
            title: 'ͼƬ�ϴ�',
            user: req.session.user
        });
    })
}