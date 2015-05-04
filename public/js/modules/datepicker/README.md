### 日历使用说明   

  
```
<input type="text" id="date" readonly="true" value="2015-01-07">  

require(['datepicker'], function(datepicker){
    $('#date').on('focus', function(){
        datepicker({
            minDate:'%y-%M-{%d}',
            maxDate:'%y-%M-{%d+20}',
            onpicked:function(dp){
                //其他地方赋值
                var date = dp.cal.getNewDateStr();
                $('#其他id').val(date);
            }
        });
    });
});

```