Ext.define("App.view.bids.directories.routing.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.BidsDirectoryRoutesGridPanel",
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.bids.directories.RoutesStore');
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        
        this.callParent(arguments);
        
        this.addEvents("createbtnclick", "editbtnclick", "deletebtnclick");
        
        this.on("selectionchange", this.onToggleBtns, this);
    },
    
    buildColumns : function() {
        return [
            {
                header : 'Приоритет',
                dataIndex : 'priority',
                width : 80,
                align : 'center'
            },
            {
                header : 'Статусы',
                dataIndex : 'statuses',
                flex : 1,
                sortable : false,
                renderer : this.statusesRenderer
            },
            {
                header : 'Задачи',
                dataIndex : 'tasks',
                flex : .5,
                sortable : false,
                renderer : this.tasksRenderer
            },
            {
                header : 'Материалы',
                dataIndex : 'materials_allowed',
                flex : .5,
                renderer : this.materialsRenderer
            },
            {
                header : 'Территории',
                dataIndex : 'area_codes',
                flex : .5,
                sortable : false,
                renderer : this.areaCodesRenderer
            },
            {
                header : 'Роли пользователей',
                dataIndex : 'roles',
                flex : .5,
                sortable : false,
                renderer : this.rolesRenderer
            },
            {
                header : 'Каналы сбыта',
                dataIndex : 'sales_channels',
                flex : .5,
                sortable : false,
                renderer : this.channelsRenderer
            },
            {
                header : 'Дата изменения',
                dataIndex : 'updated',
                width : 140,
                align : 'center',
                renderer : Ext.util.Format.dateRenderer('d.m.Y H:i:s')
            }
        ];
    },
    
    buildTbar: function () {
        return [
            {
                text: "Добавить правило",
                iconCls: "icon-create",
                scope: this,
                handler: function () {
                    this.fireEvent("createbtnclick", this);
                }
            }, 
            {
                tooltip : "Редактировать",
                itemId: "btnEdit",
                disabled: true,
                iconCls: "icon-edit",
                scope: this,
                handler: function () {
                    this.fireEvent("editbtnclick", this);
                }
            },
            {
                tooltip : "Удалить",
                itemId: "btnDelete",
                disabled: true,
                iconCls: "icon-delete",
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
    
    statusesRenderer : function(v, metaData) {
        metaData.style = "white-space: normal;";
        return (v.length) ? Ext.Array.map(v, function(item){ return item.name; }).join(" <b>&raquo;</b> ") : "";
    },
    
    tasksRenderer : function(v, metaData) {
        metaData.style = "white-space: normal;";
        return (v.length) ? Ext.Array.map(v, function(item){ return item.name; }).join(", ") : "<b>Все задачи</b>";
    },
    
    materialsRenderer : function(v, metaData) {
        metaData.style = "white-space: normal;";  
        if (v == 0) {
            return "Все материалы";
        } else if (v == 1) {
            return "Требующие бухгалтерского оформления";
        } else if (v == 2) {
            return "Не требующие бухгалтерского оформления";
        }
    },
    
    areaCodesRenderer : function(v, metaData) {
        metaData.style = "white-space: normal;";
        return (v.length) ? Ext.Array.map(v, function(item){ return item.code; }).join(", ") : "<b>Все территории</b>";
    },
    
    rolesRenderer : function(v, metaData) {
        metaData.style = "white-space: normal;";
        return (v.length) ? Ext.Array.map(v, function(item){ return item.name; }).join(", ") : "<b>Все пользователи</b>";
    },
    
    channelsRenderer : function(v, metaData) {
        metaData.style = "white-space: normal;";
        return (v.length) ? Ext.Array.map(v, function(item){ return item.name; }).join(", ") : "<b>Все каналы сбыта</b>";
    },
    
    onToggleBtns: function () {
        var selCount = this.getView().getSelectionModel().getCount();
        this.down("#btnDelete").setDisabled(selCount < 1);
        this.down("#btnEdit").setDisabled(selCount != 1);
    }
});