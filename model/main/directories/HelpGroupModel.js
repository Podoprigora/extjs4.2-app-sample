Ext.define('App.model.main.directories.HelpGroupModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'name', type : 'string'},
        {name : 'priority', type : 'int'}
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            read : Settings.urls.getUrl('main.directories.help_groups.read'),
            create : Settings.urls.getUrl('main.directories.help_groups.save'),
            update : Settings.urls.getUrl('main.directories.help_groups.save'),
            destroy : Settings.urls.getUrl('main.directories.help_groups.destroy')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});