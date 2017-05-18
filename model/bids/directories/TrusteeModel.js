Ext.define('App.model.bids.directories.TrusteeModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'fio1', type : 'string'},
        {name : 'fio2', type : 'string'},
        {name : 'position', type : 'string'},
        {name : 'basis', type : 'string'},
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
            read : Settings.urls.getUrl('bids.trustees.read'),
            create : Settings.urls.getUrl('bids.trustees.save'),
            update : Settings.urls.getUrl('bids.trustees.save'),
            destroy : Settings.urls.getUrl('bids.trustees.destroy')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});