Ext.define("App.view.bids.materials.EditorGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.BidMaterialsEditorGridPanel",
    
    cls : 'x-no-dirty',
    config : {
        readOnly : false
    },
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.bids.BidMaterialsLocalStore');
        this.columns = this.buildColumns();
        this.features = this.buildFeatures();
        this.plugins = this.buildPlugins();
        
        this.callParent(arguments);
        
        this.addEvents('storeupdate', 'deleteitemclick');
        
        this.getStore().on('update', this.onUpdatedData, this);
        this.getView().on('refresh', this.onUpdatedData, this);
    },
    
    buildPlugins : function() {
        return [{
            ptype : 'cellediting',
            pluginId : 'cellEditing',
            clicksToEdit : 1
        }];  
    },
    
    buildFeatures : function(){
        return [
            {
                ftype : 'grouping',
                groupHeaderTpl : '{name}'
            }
        ];
    },
    
    buildColumns : function() {
        return [
            {
                xtype : 'actioncolumn',
                width : 30,
                align : 'center',
                hidden : this.readOnly,
                items : [
                    {
                        iconCls : 'icon-delete',
                        tooltip : 'Удалить',
                        scope : this,
                        handler : function(view, rowIndex, colIndex, item, e, record) {
                            this.fireEvent('deleteitemclick', this, record);
                        }
                    }
                ]
            },
            {
                header : 'Кол-во',
                dataIndex : 'qty',
                width : 80,
                align : 'center',
                getEditor : this.getQtyEditor,
                renderer : this.qtyRenderer
            },
            {
                header : 'Наименование',
                dataIndex : 'name',
                flex : 1,
                renderer : this.wraptextRenderer
            }
        ];     
    },
    
    buildTbar : function() {
        return [

           /* "->", 
            {
                xtype: "component",
                itemId: "Totals",
                cls: "x-component-grid-text-item",
                tpl: "Всего: <b>{count}</b>"
            }, 
            {
                xtype: "tbspacer"
            }*/
        ]; 
    },
    
    onUpdatedData : function() {
        this.fireEvent('storeupdate', this);
    },
    
    getQtyEditor : function(record) {
        if (this.readOnly) {
            return false;    
        }
        return {
            xtype : 'numberfield',
            selectOnFocus : true,
            minValue : 0
        }; 
    },
    
    qtyRenderer : function(v, metaData, record) {
        if (! this.readOnly) {
            metaData.tdCls = "x-cell-editing";
        }
        return v;
    }
});