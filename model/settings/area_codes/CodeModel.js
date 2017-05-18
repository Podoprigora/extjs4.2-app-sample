Ext.define('App.model.settings.area_codes.CodeModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'parent_id', type : 'int'},
        {name : 'code', type : 'int'},
        {name : 'depth', type : 'int'},
        {name : 'expanded', type: 'boolean', defaultValue: true, persist: false},
        {name : 'group', type : 'int', convert : function(v, record){
            return record.get('code')-record.get('code')%1000000;
        }},
        {name : 'users'}
    ],
    
    validations : [
        {field : 'code', type : 'presence'}
    ],
    
    hasMany : [
        {
            model : 'App.model.settings.area_codes.CodeUserModel', 
            name : 'getUsers',
            associationKey : 'users'
        }
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            create : Settings.urls.getUrl('settings.area_codes.save'),
            update : Settings.urls.getUrl('settings.area_codes.save'),
            destroy : Settings.urls.getUrl('settings.area_codes.destroy')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});