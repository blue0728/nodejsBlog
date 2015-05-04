/*
** 全局通用JS文件
*/

// require模块请求配置
require.config({
    urlArgs: 'v=20150407',
    /*模块路径*/
    baseUrl: '/js/modules/', //你大爷
    paths: {
        'markdown': 'markdown/editor',
        'marked': 'markdown/marked',
        'editor': 'kindeditor/kindeditor',
        'jcrop': 'jcrop/jcrop',
        'tip': 'popup/tip',
        'dialog': 'dialog/dialog',
        'datepicker': 'datepicker/datepicker'
    },
    map: {
        '*': {
            'css': 'css'
        }
    }
});


