Ext.define("App.view.bids.materials.DirectoryGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.BidMaterialsDirectoryGridPanel",
    
    hideHeaders : true,
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.catalog.MaterialsStore');
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        this.cls += " hidden-actions-icon";
        
        this.callParent(arguments);
    },
    
    buildColumns : function() {
        return [
            {
                xtype: "actioncolumn",
                width: 25,
                align: "center",
                items: [
                    {
                        iconCls : "icon-create-dark",
                        tooltip : 'Выбрать',
                        scope: this,
                        handler : function(view, rowIndex, colIndex, item, e, record) {
                            this.fireEvent('selectitemclick', view, record);
                        }
                    }
                ]
            },
            {
                xtype : 'templatecolumn',
                flex : 1,
                tpl : [
                    '<div class="x-template-column-image"><img src="{first_image}"></div>' +
                    '<div class="x-template-column">' +
                        '<div class="column-title">{name}</div>' +
                        '<div><i>{group_name}</i></div>' +
                        '<div class="column-text">{[this.descriptionRenderer(values.short_description)]}</div>' +
                    '</div>',
                    {
                        descriptionRenderer : function(value) {
                            return (value) ? value.replace(/\n/g, "<br />") : '';
                        }
                    }
                ]
            }
        ];
    },
    
    buildTbar : function() {
        return [
            {
                xtype: "uxTreePicker",
                store: Ext.create("App.store.catalog.GroupsTreeStore", {
                    root: {
                        id: 0,
                        expanded: false
                    }
                }),
                fieldLabel: "Фильтры",
                emptyText: "Выберите категорию",
                displayField: "name",
                minPickerWidth: 300,
                selectOnlyLeaf: false,
                labelAlign : 'right',
                labelWidth : 60,
                width : 260,
                listeners: {
                    scope: this,
                    select: function (field, record) {
                        this.getStore().addFilter('group_id', record.get("id"));
                    },
                    clean: function () {
                        this.getStore().addFilter('group_id', null);
                    }
                }
            }, 
            {
                xtype: "uxFilterField",
                emptyText: "Введите наименование, описание",
                editable: true,
                width : 200,
                margin : '0 0 0 5',
                listeners: {
                    scope: this,
                    search: function (value) {
                        this.getStore().addFilter('query', ((value) ? { "$like": value } : null));
                    }
                }
            },
            "->", 
            {
                tooltip: "Обновить",
                iconCls: "icon-refresh",
                scope: this,
                handler: this.onRefresh
            }, 
            {
                xtype: "tbspacer"
            }, 
            {
                xtype: "component",
                itemId: "Totals",
                cls: "x-component-grid-text-item",
                tpl: "Всего: <b>{count}</b>"
            }, 
            {
                xtype: "tbspacer"
            }
        ];    
    }
});