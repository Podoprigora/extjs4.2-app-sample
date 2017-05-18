Ext.define("App.view.settings.area_codes.UsersEditorGrid", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.AreaCodeUsersEditorGrid",
    
    hideHeaders : true,
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.settings.area_codes.CodeUsersStore');
        this.columns = this.buildColumns();
        this.cls = "x-custom-dirty"; 
        
        this.callParent(arguments);
        
        this.addEvents('deleteitemclick');
    },
    
    buildColumns : function() {
        return [
            {
                xtype  : 'actioncolumn',
                width : 30,
                align : 'center',
                items : [
                    {
                        iconCls : 'icon-delete',
                        tooltip : 'Удалить',
                        scope : this,
                        handler : Ext.bind(this.onActionHandler, this, ['deleteitemclick', true], 0)
                    }
                ]
            },
            {
                dataIndex : 'fio',
                flex : 1
            },
            {
                dataIndex : 'role',
                width : 160,
                align : 'center'
            }
        ];
    }
});