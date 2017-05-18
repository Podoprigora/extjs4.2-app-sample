Ext.define("App.view.settings.roles.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.RolesGridPanel",
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.settings.roles.RolesStore');
        this.columns = this.buildColumns();
        this.features = this.buildFeatures();
        this.tbar = this.buildTbar();
        
        this.callParent(arguments);
        
        this.on("selectionchange", this.onToggleBtns, this);
    },
    
    buildColumns : function() {
        return [
            {
                header : 'Наименование',
                dataIndex : 'name',
                flex : 1
            }
        ];   
    },
    
    buildFeatures : function() {
        return [
            {
                ftype : 'grouping',
                groupHeaderTpl : '{name}',
                enableGroupingMenu : false
            }
        ];
    },
    
    buildTbar: function () {
        return [
            {
                text: "Добавить роль",
                iconCls: "icon-create",
                scope: this,
                handler: function () {
                    this.fireEvent("createbtnclick", this);
                }
            }, 
            {
                tooltip: "Редактировать",
                itemId: "btnEdit",
                iconCls: "icon-edit",
                disabled: true,
                scope: this,
                handler: function () {
                    this.fireEvent("editbtnclick", this);
                }
            },
            {
                tooltip: "Удалить",
                itemId: "btnDelete",
                iconCls: "icon-delete",
                disabled: true,
                scope: this,
                handler: function () {
                    this.fireEvent("deletebtnclick", this);
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
        this.down("#btnDelete").setDisabled(!selCount);
        this.down("#btnEdit").setDisabled(!selCount);
    }
    
});