Ext.define("App.view.settings.users.AccessAreasEditorGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.UserAccessAreasEditorGridPanel",
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.settings.users.AccessAreasLocalStore');
        this.columns = this.buildColumns();
        this.dockedItems = this.buildDockedItems(); 
        this.cls += " x-no-dirty";
        
        this.callParent(arguments);
        
        this.addEvents('createbtnclick', 'deletebtnclick');
    },
    
    buildColumns : function() {
        return [
            {
                xtype : 'actioncolumn',
                width : 30,
                align : 'center',
                items : [
                    {
                        iconCls : 'icon-delete',
                        tooltip : 'Удалить',
                        scope : this,
                        handler : this.onDeleteRow
                    }
                ]
            },
            {
                header : 'Регион',
                dataIndex : 'region',
                flex : 1,
                sortable : false
            },
            {
                header : 'Город',
                dataIndex : 'city',
                flex : 1,
                sortable : false,
                renderer : this.columnRenderer
            },
            {
                header : 'Склад',
                dataIndex : 'warehouse',
                flex : 1,
                sortable : false,
                renderer : this.columnRenderer
            }
        ];
    },
    
    buildDockedItems : function() {
        return [
            {
                dock : 'top',
                xtype : 'form',
                itemId : 'frmCreateAccess',
                bodyPadding : 10,
                //border : false,
                layout : 'hbox',
                items : [
                    {
                        xtype : 'uxCombo',
                        name : 'region_id',
                        store : Ext.create('App.store.settings.regions.RegionsStore', {
                            filters : [
                                {property : 'dependent_access', value : true}
                            ]
                        }),
                        emptyText : 'Выберите регион',
                        editable : true,
                        enableReset : true,
                        allowBlank : false,
                        margin : '1 0 0 0',
                        flex : 1,
                        listeners : {
                            scope : this,
                            select : this.onChangeRegion,
                            reset : this.onChangeRegion
                        }
                    },
                    {
                        xtype : 'uxCombo',
                        name : 'city_id',
                        store : Ext.create('App.store.settings.regions.CitiesStore'),
                        editable : true,
                        enableReset : true,
                        emptyText : 'Выберите город',
                        flex : 1,
                        margin : '1 10 0 10',
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
                            pageSize : 10000 
                        }),
                        displayField : 'code',
                        editable : true,
                        enableReset : true,
                        emptyText : 'Выберите склад',
                        flex : 1,
                        margin : '1 0 0 0',
                        disabled : true
                    },
                    {
                        xtype : 'button',
                        text : 'Добавить',
                        iconCls : 'icon-create-dark',
                        width : 85,
                        padding : 4,
                        margin : '0 0 0 10',
                        scope : this,
                        handler : this.onAddRow
                    }
                ]
            }
        ];        
    },
    
    columnRenderer : function(v) {
        if (Ext.isEmpty(v)) {
            return '<b>Все</b>';
        }
        return v;
    },
    
    onChangeRegion : function(field, records) {
        var basicForm = field.up('form').getForm(),
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
        }
    },
    
    onChangeCity : function(field, records) {
        var basicForm = field.up('form').getForm(),
            warehouseField = basicForm.findField('warehouse_id'),
            record = (records) ? records[0] : null;
        
        warehouseField.reset();
        warehouseField.setDisabled(true);
        
        if (record) {
            warehouseField.setDisabled(false);
            warehouseField.getStore().addFilter('city_id', record.get('id'));
        }    
    },
    
    resetCreateForm : function() {
        var basicForm = this.down('#frmCreateAccess').getForm(),
            cityField = basicForm.findField('city_id'),
            warehouseField = basicForm.findField('warehouse_id'); 
        basicForm.reset();
        cityField.setDisabled(true);
        warehouseField.setDisabled(true);
    },
    
    onAddRow : function() {
        this.fireEvent('createbtnclick', this);
    },
    
    onDeleteRow : function(view, rowIndex, colIndex, item, e, record) {
        this.fireEvent('deletebtnclick', this, rowIndex, colIndex, item, e, record);    
    }
    
});