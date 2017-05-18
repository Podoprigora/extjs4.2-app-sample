Ext.define('App.ux.util.DateDiff', {
    statics : {
        
        inMinutes: function(d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();
    
            return parseInt((t2-t1)/(60*1000));
        },
        
        inHours: function(d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();
    
            return parseInt((t2-t1)/(3600*1000));
        },
        
        inDays: function(d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();
    
            return parseInt((t2-t1)/(24*3600*1000));
        },
        
        formatDHM : function(d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();
            
            days = App.ux.util.DateDiff.inDays(d1, d2);
            
            hours = parseInt((t2-(days*24*3600*1000)-t1)/(3600*1000));
            minutes = parseInt((t2-(days*24*3600*1000)-(hours*3600*1000)-t1)/(60*1000));
            
            var cls = (hours < 0 || minutes < 0) ? 'x-cell-red' : '',
                res = ((hours < 0 || minutes < 0) ? "-" : "") + Math.abs(days) + ' д. ' + Math.abs(hours) + ' ч. ' + Math.abs(minutes) + ' мин.'
            
            
            return Ext.String.format('<div class="{0}">{1}</div>', cls, res);
        },
        
        formatHM : function(d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();
            
            hours = parseInt((t2-t1)/(3600*1000));
            minutes = parseInt((t2-(hours*3600*1000)-t1)/(60*1000));
            
            var cls = (hours < 0 || minutes < 0) ? 'x-cell-red' : 'x-cell-green',
                res = ((hours < 0 || minutes < 0) ? "-" : "") + Math.abs(hours) + ' ч. ' + Math.abs(minutes) + ' мин.';
            
            
            return Ext.String.format('<div class="%{0}">{1}</div>', cls, res);
        }
    }
});