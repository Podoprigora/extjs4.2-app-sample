Ext.define("App.view.catalog.materials.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.CatalogMaterialsGridPanel",
    
    initComponent: function () {
        this.store = Ext.create("App.store.catalog.MaterialsStore");
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        
        if (App.Identity.getRecord().hasPermit('catalog', 'allow')) {
            this.selModel = Ext.create('Ext.selection.CheckboxModel');   
        }
        
        this.callParent(arguments);
        
        if (App.Identity.getRecord().hasPermit('catalog', 'allow')) {
            this.addEvents("createbtnclick", "editbtnclick", "deletebtnclick", "filterbtnclick", "showgroupbtnclick");
            this.on("selectionchange", this.onToggleBtns, this);  
        }
        
        this.on('itemdblclick', function(view, record, item, index, e){
            return App.Identity.getRecord().hasPermit('catalog', 'allow');
        });
    },
    
    buildColumns: function () {
        return [
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
    
    buildTbar: function () {
        return [
            {
                text: "Добавить",
                iconCls: "icon-create",
                scope: this,
                hidden : App.Identity.getRecord().hasPermit('catalog', 'read'),
                handler: function () {
                    this.fireEvent("createbtnclick", this);
                }
            }, 
            {
                tooltip: "Редактировать",
                itemId: "btnEdit",
                disabled: true,
                iconCls: "icon-edit",
                hidden : App.Identity.getRecord().hasPermit('catalog', 'read'),
                scope: this,
                handler: function () {
                    this.fireEvent("editbtnclick", this);
                }
            }, 
            {
                tooltip: "Удалить",
                itemId: "btnDelete",
                disabled: true,
                iconCls: "icon-delete",
                hidden : App.Identity.getRecord().hasPermit('catalog', 'read'),
                scope: this,
                handler: function () {
                    this.fireEvent("deletebtnclick", this);
                }
            }, 
            {
                text: "Фильтры",
                iconCls: "icon-filter",
                enableToggle: true,
                pressed : true,
                scope : this,
                handler: function (btn) {
                    this.fireEvent("filterbtnclick", this, btn);
                }
            }, 
            {
                text: "Категории",
                iconCls: "icon-tree",
                hidden : App.Identity.getRecord().hasPermit('catalog', 'read'),
                scope: this,
                handler: function () {
                    this.fireEvent("showgroupbtnclick", this);
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
    },
    
    onToggleBtns: function () {
        var selCount = this.getSelectionModel().getCount();
        
        this.down("#btnDelete").setDisabled(selCount == 0);
        this.down("#btnEdit").setDisabled(selCount == 0);
    }
});