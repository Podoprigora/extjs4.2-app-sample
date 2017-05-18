Ext.define('App.ux.window.MessageBox', {
    extend : 'Ext.window.MessageBox',
    
    shadow : 'frame',
    shadowOffset : Ext.isIE8m ? 5 : 15,
    
    initComponent : function() {
        this.callParent(arguments);
    },
    
    notification : function(msg) {
        Ext.create('widget.uxNotification', {
            title: 'Уведомление',
            position: 't',
            ui : 'notification',
            spacing: 10,
            autoHeight : true,
            bodyPadding : 15,
            minWidth : 300,
            html: Ext.create('Ext.XTemplate', 
                '<div>' + msg + '</div>'
            )
        }).show();
    },
    
    confirm : function(msg, fn, scope) {
        this.show({
            title : '',
            msg : msg,
            buttons: Ext.Msg.YESNO,
            fn: fn,
            scope : scope,
            icon: Ext.Msg.QUESTION,
            minWidth: Ext.Msg.minWidth,
            modal: true,
            closable : false
        });
    },
    
    alert : function(msg, fn, scope) {
        this.show({
            title : '',
            msg : msg,
            buttons: Ext.Msg.OK,
            fn : fn,
            scope : scope,
            icon: Ext.Msg.WARNING,
            minWidth: Ext.Msg.minWidth,
            modal : true,
            closable : false
        });
    },
    
    info : function(msg, fn, scope) {
        this.show({
            title : '',
            msg : msg,
            buttons: Ext.Msg.OK,
            fn : fn,
            scope : scope,
            icon: Ext.Msg.INFO,
            minWidth: Ext.Msg.minWidth,
            modal : true,
            closable : false
        });
    },
    
    wait : function(msg, title, config) {
        var title = title || 'Пожалуйста подождите ...';
        var msg = msg || ' ';
        
        var config = Ext.apply({
            interval: 1,
            increment: 120
        }, config);
        
        this.show({
            title : title,
            msg : msg,
            buttons: false,
            closable: true,
            wait : true,
            modal:true,
            minWidth: Ext.Msg.minProgressWidth,
            waitConfig: {interval:200}
        });
    }
    
    
}, function(){
    App.ux.window.MessageBox = App.ux.Msg = new this();
});
