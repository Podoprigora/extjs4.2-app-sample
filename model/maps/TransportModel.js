Ext.define('App.model.maps.TransportModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'name', type : 'string'},
        {name : 'driver', type : 'string'},
        {name : 'login', type : 'string'},
        {name : 'password', type : 'string'},
        {name : 'type', type : 'int'},
        {name : 'is_hidden', type : 'int', convert : function(v){
            return (v == true || v == 1) ? 1 : 0;
        }},
        {name : 'area_codes'},
        {name : 'updated', type : 'date', dateFormat : 'Y-m-d H:i:s'}
    ],
    
    hasMany : [
        {
            model : 'App.model.bids.directories.AreaCodeModel',
            name : 'getCodes',
            associationKey : 'area_codes'
        }
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            read : Settings.urls.getUrl('maps.transports.read'),
            create : Settings.urls.getUrl('maps.transports.save'),
            update : Settings.urls.getUrl('maps.transports.save'),
            destroy : Settings.urls.getUrl('maps.transports.destroy')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});