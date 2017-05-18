Ext.define('App.model.main.directories.HelpArticleModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'group_id', type : 'int'},
        {name : 'group_name', type : 'string', persist : false},
        {name : 'title', type : 'string'},
        {name : 'text', type : 'string'},
        {name : 'priority', type : 'int'},
        {name : 'is_active', type : 'int', defaultValue : 1},
        {name : 'is_visible_on_dashboard', type : 'int', defaultValue : 0}
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            read : Settings.urls.getUrl('main.directories.help_articles.read'),
            create : Settings.urls.getUrl('main.directories.help_articles.save'),
            update : Settings.urls.getUrl('main.directories.help_articles.save'),
            destroy : Settings.urls.getUrl('main.directories.help_articles.destroy')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});