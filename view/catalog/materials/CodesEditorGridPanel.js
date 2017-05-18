Ext.define("App.view.catalog.materials.CodesEditorGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.CatalogMaterialCodesEditorGridPanel",
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.catalog.MaterialCodesLocalStore');
        this.columns = this.buildColumns();
        this.features = this.buildFeatures();
        this.tbar = this.buildTbar();
        this.cls += " x-no-dirty";
        
        this.callParent(arguments);
        
        this.addEvents('selectcodefromdirectory', 'deleteitem');
    },
    
    buildFeatures : function() {
        return [
            {
                ftype : 'grouping',
                groupHeaderTpl : 'Набор № {name}',
                enableGroupingMenu : false
            }
        ];
    },
    
    buildTbar : function() {
        return [
            {
                itemId : 'kitField',
                xtype : 'numberfield',
                fieldLabel : 'Набор №',
                minValue : 1,
                value : 1,
                width : 130,
                labelWidth : 65,
                labelAlign : 'right',
                allowBlank : false,
                tabIndex : 10
            },
            {
                xtype : 'MaterialsListField',
                emptyText : 'Введите код, наименование',
                width : 260,
                tabIndex : 20,
                listeners : {
                    scope : this,
                    select : this.onSelectCodeItem,
                    expand : function(field) {
                        this.fireEvent('expandpicker', field);
                    }
                }
            },
            '->',
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
                header : 'Код',
                dataIndex : 'code',
                align : 'center',
                width : 100
            },
            {
                header : 'Наименование',
                dataIndex : 'name',
                flex : 1
            }
        ];
    },
    
    onDeleteRow : function(view, rowIndex, colIndex, item, e, record) {
        var grid = view.ownerCt;
        grid.getSelectionModel().select(record);
        App.ux.Msg.confirm("Вы действительно хотите выполнить удаление?", function(btn){
            if (btn == 'yes') {
                record.set('removed', 1);
                grid.getStore().remove(record);
                grid.getView().refresh();
                this.fireEvent('deleteitem', this, record);  
            }
        }, this);
    },
    
    onSelectCodeItem : function(field, record) {
        this.fireEvent('selectcodefromdirectory', this, field, record);
    }
});