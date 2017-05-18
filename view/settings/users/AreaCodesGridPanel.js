Ext.define("App.view.settings.users.AreaCodesGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.UserAreaCodesGridPanel",
    
    hideHeaders : true,
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.settings.users.AreaCodesStore');
        this.columns = this.buildColumns();
        
        this.callParent(arguments);
    },
    
    buildColumns : function() {
        return [
            {
                width : 10
            },
            {
                dataIndex : 'code',
                flex : 1
            }
        ];
    }
    
});