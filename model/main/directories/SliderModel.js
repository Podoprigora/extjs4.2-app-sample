Ext.define('App.model.main.directories.SliderModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'region_id', type : 'int', useNull : true},
        {name : 'region', type : 'string', persist : false},
        {name : 'name', type : 'string'},
        {name : 'text', type : 'string'},
        {name : 'image_path', type : 'string'},
        {name : 'priority', type : 'int'},
        {name : 'is_active', type : 'int', defaultValue : 1}
    ],
    
    validations : [
        {field : 'image_path', type : 'presence', message : 'Выберите изображение!'}
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            read : Settings.urls.getUrl('main.directories.sliders.read'),
            create : Settings.urls.getUrl('main.directories.sliders.save'),
            update : Settings.urls.getUrl('main.directories.sliders.save'),
            destroy : Settings.urls.getUrl('main.directories.sliders.destroy')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});