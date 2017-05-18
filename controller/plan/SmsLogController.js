Ext.define('App.controller.plan.SmsLogController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'plan.SmsLogModel'
    ],
    
    stores : [
        'plan.SmsLogStore'
    ],
    
    views : [
        'plan.smslog.GridPanel'    
    ],
    
    init : function() {
    
    }
    
});