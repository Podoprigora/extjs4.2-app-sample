Ext.define('App.ux.grid.header_filters.NumberMenu', {
    extend: 'App.ux.grid.header_filters.PriceMenu',

    fieldLabels: {
        gt: 'Больше',
        lt: 'Меньше',
        eq: 'Равно'
    },
    

    menuItemCfgs : {
        selectOnFocus: false,
        width: 140
    },

    menuItems : ['eq', '-',  'gt', 'lt'],

    constructor : function (config) {
        
        this.callParent(arguments);
    },
    
    buildFields : function() {
        return {
            gt : {
                field : 'Ext.form.field.Number'    
            },
            lt : {
                field : 'Ext.form.field.Number'     
            },
            eq : {
                field : 'Ext.form.field.Number'     
            }
        }
    }
});