Ext.define('App.model.main.directories.NewsModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'date', type : 'date', dateFormat : 'Y-m-d'},
        {name : 'region_id', type : 'int', useNull : true},
        {name : 'region', type : 'string', persist : false},
        {name : 'title', type : 'string'},
        {name : 'preview', type : 'string'},
        {name : 'text', type : 'string'},
        {name : 'is_active', type : 'int', defaultValue : 1}
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            read : Settings.urls.getUrl('main.directories.news.read'),
            create : Settings.urls.getUrl('main.directories.news.save'),
            update : Settings.urls.getUrl('main.directories.news.save'),
            destroy : Settings.urls.getUrl('main.directories.news.destroy')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});