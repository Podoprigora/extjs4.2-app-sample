Ext.define('App.model.plan.ScriptModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'name', type : 'string'},
        {name : 'rules', type : 'auto'},
        {name : 'updated', type : 'date', dateFormat : 'Y-m-d H:i:s', persist : false}
    ],
    
    validations : [
        {field : 'name', type : 'presence'}
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            read: Settings.urls.getUrl("plan.scripts.read"),
            create: Settings.urls.getUrl("plan.scripts.save"),
            update: Settings.urls.getUrl("plan.scripts.save"),
            destroy: Settings.urls.getUrl("plan.scripts.destroy")
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});