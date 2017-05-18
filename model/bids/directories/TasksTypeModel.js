Ext.define('App.model.bids.directories.TasksTypeModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'name', type : 'string'},
        {name : 'position', type : 'int'},
        {name : 'updated', type : 'date', dateFormat : 'Y-m-d H:i:s'}
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            read : Settings.urls.getUrl('bids.tasks_types.read'),
            create : Settings.urls.getUrl('bids.tasks_types.save'),
            update : Settings.urls.getUrl('bids.tasks_types.save'),
            destroy : Settings.urls.getUrl('bids.tasks_types.destroy')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});