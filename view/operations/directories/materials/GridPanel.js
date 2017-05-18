Ext.define("App.view.operations.directories.materials.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.DirectoryMaterialsGridPanel",
    
    config : {
        featuresColumns : null
    },
    
    selModel : {
        selType: 'checkboxmodel',
        mode : 'MULTI'
    },

    initComponent : function(){
        
        this.store = Ext.create('App.store.operations.directories.MaterialsStore');
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        this.plugins = this.buildPlugins();
        
        this.addEvents('createbtnclick', 'deletebtnclick', 'importbtnclick', 'changefilter');
        
        this.on('selectionchange', this.onToggleBtns, this);
        
        this.callParent(arguments);
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
                width : 100,
                align : 'center',
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            },
            {
                header : 'Наименование',
                dataIndex : 'name',
                flex : 1,
                minWidth : 200,
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            },
            {
                header : 'Цена',
                dataIndex : 'price',
                align : 'right',
                width : 100,
                renderer : Ext.util.Format.numberRenderer("0,0.00"),
                editor : {
                    xtype : 'numberfield',
                    enableMask : false
                }
            },
            {
                header : 'Количество в упаковке',
                dataIndex : 'amount_in_packaging',
                align : 'center',
                width : 120,
                editor : {
                    xtype : 'numberfield',
                    enableMask : false
                },
                renderer : function(v) {
                    return Ext.util.Format.number(v, "0,0.00") + " шт";
                }
            },
            {
                header : 'Длина упаковки',
                dataIndex : 'package_length',
                align : 'center',
                width : 120,
                editor : {
                    xtype : 'numberfield',
                    enableMask : false
                },
                renderer : function(v) {
                    return Ext.util.Format.number(v, "0,0.00") + " мм";
                }
            },
            {
                header : 'Ширина упаковки',
                dataIndex : 'package_width',
                align : 'center',
                width : 120,
                editor : {
                    xtype : 'numberfield',
                    enableMask : false
                },
                renderer : function(v) {
                    return Ext.util.Format.number(v, "0,0.00") + " мм";
                }
            },
            {
                header : 'Высота упаковки',
                dataIndex : 'package_height',
                align : 'center',
                width : 120,
                editor : {
                    xtype : 'numberfield',
                    enableMask : false
                },
                renderer : function(v) {
                    return Ext.util.Format.number(v, "0,0.00") + " мм";
                }
            },
            {
                header : 'Вес упаковки',
                dataIndex : 'package_weight',
                align : 'center',
                width : 120,
                editor : {
                    xtype : 'numberfield',
                    enableMask : false
                },
                renderer : function(v) {
                    return Ext.util.Format.number(v, "0,0.00") + " кг";
                }
            },
            {
                header : 'Занимаемая площадь одной стопкой',
                dataIndex : 'stack_area',
                align : 'center',
                width : 120,
                renderer : Ext.util.Format.numberRenderer("0,0.0000")
            },
            {
                header : 'Кол-во коробов  в одной стопке',
                dataIndex : 'number_of_boxes_in_stack',
                align : 'center',
                width : 120,
                editor : {
                    xtype : 'numberfield',
                    enableMask : false
                },
                renderer : Ext.util.Format.numberRenderer("0,0")
            }
        ];
    },
    
    buildTbar : function() {
        return [
            {
                text : 'Добавить материал',
                iconCls : 'icon-create',
                scope : this,
                handler : function(btn) {
                    this.fireEvent('createbtnclick', this);
                }
            },
            {
                tooltip : 'Удалить',
                iconCls : 'icon-delete',
                itemId : 'btnDelete',
                disabled : true,
                scope : this,
                handler : function() {
                    this.fireEvent('deletebtnclick', this);
                }
            },
            {
                xtype : 'tbspacer'
            },
            {
                text : 'Импорт',
                iconCls : 'icon-table-import',
                scope : this,
                handler : function(){
                    this.fireEvent('importbtnclick', this);
                }
            },
            {
                xtype : 'uxFilterField',
                fieldLabel : 'Поиск',
                labelAlign : 'right',
                labelWidth : 60,
                width : 280,
                emptyText : 'Введите код или наименование',
                editable : true,
                listeners : {
                    scope : this,
                    search : this.onChangeFilter
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
    
    modifiedRenderer : function(v, metaData, record) {
        return Ext.util.Format.date(v, 'd.m.Y') + " " + record.get('user');
    },
    
    
    onToggleBtns : function() {
        var selCount = this.getSelectionModel().getCount();
        
        this.down('#btnDelete').setDisabled(! selCount);
    },
    
    onChangeFilter : function(value) {
        this.fireEvent('changefilter', this, value);  
    }
    
});