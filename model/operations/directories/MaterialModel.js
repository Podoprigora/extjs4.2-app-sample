Ext.define('App.model.operations.directories.MaterialModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'code', type : 'string'},
        {name : 'name', type : 'string'},
        {name : 'price', type : 'float'},
        {name : 'updated', type : 'date', dateFormat : 'Y-m-d H:i:s'},
        {name : 'updated_user_id', type : 'int'},
        
        {name : 'amount_in_packaging', type : 'float'},
        {name : 'package_length', type : 'float'},
        {name : 'package_width', type : 'float'},
        {name : 'package_height', type : 'float'},
        {name : 'package_weight', type : 'float'},
        {name : 'stack_area', type : 'float', persist : false},
        {name : 'number_of_boxes_in_stack', type : 'int'}
    ],
    
    validations : [
        {field : 'code', type : 'presence'},
        {field : 'name', type : 'presence'}
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            create : Settings.urls.getUrl('directories.materials.save'),
            update : Settings.urls.getUrl('directories.materials.save'),
            destroy : Settings.urls.getUrl('directories.materials.destroy')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    },
    
    set : function(field, value) {
        
        this.callParent(arguments);
        
        if (field == 'package_length' || field == 'package_width') {
            this.set('stack_area', this.getStackArea());
        }
    },
    
    getStackArea : function() {
        return this.get('package_length') * this.get('package_width') / 1000000;  
    }
    
});