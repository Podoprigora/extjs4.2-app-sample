Ext.define("App.view.main.directories.help_groups.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.MainDirectoryHelpGroupsGridPanel",
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.main.directories.HelpGroupsStore');
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        this.selModel = Ext.create('Ext.selection.CheckboxModel');
        
        this.callParent(arguments);
        
        this.on('selectionchange', this.onToggleBtns, this);
    },
    
    buildColumns : function(){
        return [
            {
                header : 'Наименование',
                dataIndex : 'name',
                width : 400
            },
            {
                header : 'Порядок',
                dataIndex : 'priority',
                width : 80,
                align : 'center',
                tdCls : 'x-mark-rows'
            },
            {
                flex : 1
            }
        ];
    },
    
    buildTbar : function(){
        return [
            {
                text : "Добавить",
                iconCls : "icon-create",
                scope : this,
                handler : function() {
                    this.fireEvent("createbtnclick", this);
                }
            },
            {
                tooltip : 'Редактировать',
                itemId : 'btnEdit',
                iconCls : 'icon-edit',
                disabled : true,
                scope : this,
                handler : function() {
                    this.fireEvent('editbtnclick', this);
                }
            },
            {
                tooltip : "Удалить",
                itemId : 'btnDelete',
                iconCls : "icon-delete",
                scope : this,
                handler : function() {
                    this.fireEvent("deletebtnclick", this);
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
        var selCount = this.getView().getSelectionModel().getCount();
        this.down("#btnDelete").setDisabled(selCount < 1);
        this.down("#btnEdit").setDisabled(selCount != 1);
    }
    
});