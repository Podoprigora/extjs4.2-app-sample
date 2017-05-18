Ext.define("App.view.bids.directories.statuses.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.BidsDirectoryStatusesGridPanel",
    
    selModel: {
        selType: "checkboxmodel",
        mode: "MULTI"
    },
    
    config : {
        accessRightNamesStore : null
    },
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.bids.directories.StatusesStore');
        this.accessRightNamesStore = Ext.create('App.store.bids.directories.StatusAccessRightNamesLocalStore');
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        
        this.callParent(arguments);
        
        this.addEvents("createbtnclick", "editbtnclick", "deletebtnclick");
        
        this.on("selectionchange", this.onToggleBtns, this);
    },
    
    buildColumns : function() {
        return [
            {
                header : 'Наименование',
                dataIndex : 'name',
                minWidth : 300,
                flex : 1
            },
            {
                header : 'Порядок',
                dataIndex : 'position',
                width : 80,
                align : 'center'
            },
            {
                header  : 'Права доступа',
                flex : 1,
                renderer : this.accessRightsRenderer
            },
            {
                header  : 'Роли',
                flex : 1,
                renderer : this.rolesRenderer
            },
            {
                header : 'Скрыто',
                dataIndex : 'is_hidden',
                width : 60,
                align : 'center',
                renderer : function(v, metaData, record){
                    return (v == 1) ? 'Да' : '';
                }
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
                text: "Добавить статус",
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
    
    rolesRenderer : function(v, metaData, record) {
        var roles = record.getRoles().getRange();
        if (roles.length) {
            roles = Ext.Array.map(roles, function(item){
                return item.get('name');
            });
            metaData.style = "white-space: normal;";
            return roles.join(", ");
        }
        return "Все роли";
    },
    
    accessRightsRenderer : function(v, metaData, record){
        var rights = record.getAccessRights().getRange(),
            me = this;
        if (rights.length) {
            rights = Ext.Array.map(rights, function(item){
                var nameRecord = me.getAccessRightNamesStore().getById(item.get('right_name'));
                return (Ext.isEmpty(nameRecord)) ? item.get('right_name') : nameRecord.get('title');
            });
            metaData.style = "white-space: normal;";
            return rights.join(", ");
        }
        return "-";
    },
    
    onToggleBtns: function () {
        var selCount = this.getView().getSelectionModel().getCount();
        this.down("#btnDelete").setDisabled(selCount < 1);
        this.down("#btnEdit").setDisabled(selCount != 1);
    }
});