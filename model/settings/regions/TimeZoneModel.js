Ext.define('App.model.settings.regions.TimeZoneModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields: [{
        name: "id",
        type: "string"
    },
    {
        name: "name",
        type: "string"
    }],
    
    proxy: {
        type: "memory",
        reader: {
            type: "json"
        }
    }
    
});