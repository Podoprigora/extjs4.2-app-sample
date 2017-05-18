Ext.define("App.view.operations.directories.warehouses.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.DirectoryWarehousesGridPanel",
    
    config : {
        citiesStore : null
    },
    
    selModel : {
        selType : 'checkboxmodel'
    },
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.operations.directories.WarehousesStore');
        this.citiesStore = Ext.create('App.store.settings.regions.CitiesStore');
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        this.plugins = this.buildPlugins();
        
        this.callParent(arguments);
        
        this.addEvents('createbtnclick', 'deletebtnclick', 'changefilter');
        
        this.on('selectionchange', this.onToggleBtns, this);
        
        this.citiesStore.on('load', function(){
            this.getView().refresh();
        }, this);
    },
    
    buildPlugins : function() {
        return [
            {
                ptype : 'cellediting',
                pluginId : 'cellEditing',
                clicksToEdit : 1
            }
        ]; 
    },
    
    buildColumns : function() {
        return [
            {
                header : 'Код',
                dataIndex : 'code',
                width : 80,
                align : 'center',
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            },
            {
                header : 'Наименование',
                dataIndex : 'name',
                width : 200,
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            },
            {
                header : 'Внешний ID',
                dataIndex : 'outer_id',
                width : 120,
                align : 'center',
                editor : {
                    xtype : 'textfield'
                }
            },
            {
                header : 'Город',
                dataIndex : 'city_id',
                width : 300,
                editor : {
                    xtype : 'uxCombo',
                    store : Ext.create('App.store.settings.regions.CitiesStore'),
                    displayField : 'name_full',
                    editing : false
                },
                renderer : App.ux.util.Format.storeColumnRenderer(this.citiesStore, function(record){
                    return (Ext.isEmpty(record) == false) ? record.get('name_full') : '';
                })
            },
            {
                header : 'Площадь',
                dataIndex : 'area',
                width : 120,
                align : 'center',
                editor : {
                    xtype : 'numberfield',
                    minValue : 0
                }
            },
            {
                header : 'Адрес',
                dataIndex : 'address',
                flex : 1,
                editor : {
                    xtype : 'textfield'
                }
            }
        ];
    },
    
    buildTbar : function() {
        return [
            {
                text : 'Добавить склад',
                iconCls : 'icon-create',
                scope : this,
                handler : function() {
                    this.fireEvent('createbtnclick', this);
                }
            },
            {
                tooltip : 'Удалить',
                itemId : 'btnDelete',
                iconCls : 'icon-delete',
                disabled : true,
                scope : this,
                handler : function() {
                    this.fireEvent('deletebtnclick', this);  
                }
            },
            {
                xtype: "uxFilterField",
                fieldLabel: "Поиск",
                editable: true,
                fieldLabel: "Поиск",
                labelAlign: "right",
                labelWidth: 60,
                width: 280,
                emptyText: "Введите код",
                listeners: {
                    scope: this,
                    search: this.onChangeFilter
                }
            },
            '->',
            { 
                tooltip : 'Обновить',
                iconCls : 'icon-refresh',
                scope : this,
                handler : this.onRefresh
            },
            {
                xtype : 'tbspacer'
            },
            { 
                xtype : 'component',
                itemId : 'Totals',
                cls : 'x-component-grid-text-item',
                tpl : 'Всего: <b>{count}</b>'
            }, 
            {
                xtype : 'tbspacer'
            }
        ];
    },
    
    onToggleBtns : function() {
        var selCount = this.getSelectionModel().getCount();
        
        this.down('#btnDelete').setDisabled(! selCount);
    },
    
    onChangeFilter: function (value) {
        this.fireEvent("changefilter", this, value);
    }
    
});