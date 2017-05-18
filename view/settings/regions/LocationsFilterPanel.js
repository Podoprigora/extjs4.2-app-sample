Ext.define("App.view.settings.regions.LocationsFilterPanel", {
    extend : "Ext.form.Panel",
    alias : "widget.LocationsFilterPanel",
    
    title : 'Зона ответственности',
    bodyCls : 'x-container-body',
    border : false,
    ui : 'plain',
    margin : 5,
    bodyPadding : '10 5 0 5',
    defaults : {
        anchor : '100%'
    },
    
    initComponent : function(){
        
        this.items = this.buildItems();
        
        this.callParent(arguments);
        
        this.addEvents('setfilter');
    },
    
    buildItems : function() {
        return  [
            {
                xtype : 'uxCombo',
                name : 'region_id',
                store : Ext.create('App.store.settings.regions.RegionsStore', {
                    filters : [
                        {property : 'dependent_access', value : true}
                    ]
                }),
                emptyText : 'Выберите регион',
                enableReset : true,
                listeners : {
                    scope : this,
                    select : this.onChangeRegion,
                    reset : this.onChangeRegion
                }
            },
            {
                xtype : 'uxCombo',
                name : 'city_id',
                store : Ext.create('App.store.settings.regions.CitiesStore', {
                    filters : [
                        {property : 'dependent_access', value : true}
                    ]
                }),
                enableReset : true,
                emptyText : 'Выберите город',
                minWidth : 120,
                disabled : true,
                listeners : {
                    scope : this,
                    select : this.onChangeCity,
                    reset : this.onChangeCity 
                }
            },
            {
                xtype : 'uxCombo',
                name : 'warehouse_id',
                store : Ext.create('App.store.operations.directories.WarehousesStore', {
                    buffered : false,
                    pageSize : 1000,
                    filters : [
                        {property : 'dependent_access', value : true}
                    ]
                }),
                displayField : 'list_name',
                enableReset : true,
                emptyText : 'Выберите склад',
                minWidth : 140,
                flex : 1,
                disabled : true,
                listeners : {
                    scope : this,
                    select : function(field, record) {
                        this.fireEvent('setfilter', this, {property : 'warehouse_id', value : record[0].get('id')});
                    },
                    reset : function() {
                        this.fireEvent('setfilter', this, {property : 'warehouse_id', value : null});    
                    }
                }
            }
        ]
    },
    
    onChangeRegion : function(field, records) {
        var basicForm = this.getForm(),
            cityField = basicForm.findField('city_id'),
            warehouseField = basicForm.findField('warehouse_id'),
            record = (records) ? records[0] : null;
        
        cityField.reset();
        warehouseField.reset();
        
        cityField.setDisabled(true);
        warehouseField.setDisabled(true);
        
        if (record) {
            cityField.setDisabled(false);
            cityField.getStore().addFilter('region_id', record.get('id'));
            this.fireEvent('setfilter', this, {property : 'region_id', value : record.get('id')});
        } else {
            this.fireEvent('setfilter', this, [{property : 'region_id', value : null}, {property : 'city_id', value : null}, {property : 'warehouse_id', value : null}]);   
        } 
    },
    
    onChangeCity : function(field, records) {
        var basicForm = this.getForm(),
            warehouseField = basicForm.findField('warehouse_id'),
            record = (records) ? records[0] : null;
        
        warehouseField.reset();
        warehouseField.setDisabled(true);
        
        if (record) {
            warehouseField.setDisabled(false);
            warehouseField.getStore().addFilter('city_id', record.get('id'));
            this.fireEvent('setfilter', this, {property : 'city_id', value : record.get('id')});
        } else {
            this.fireEvent('setfilter', this, [{property : 'city_id', value : null}, {property : 'warehouse_id', value : null}]);   
        }
    }
    
});