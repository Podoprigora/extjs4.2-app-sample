Ext.define("App.view.settings.users.AccessAreasGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.UserAccessAreasGridPanel",
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.settings.users.AccessAreasStore');
        this.columns = this.buildColumns();
        
        this.callParent(arguments);
    },
    
    buildColumns : function() {
        return [
            {
                header : 'Регион',
                dataIndex : 'region',
                flex : 1,
                maxWidth : 300,
                sortable : false,
                renderer : this.wraptextRenderer
            },
            {
                header : 'Город',
                dataIndex : 'city',
                flex : 1,
                maxWidth : 300,
                sortable : false,
                renderer : this.columnRenderer
            },
            {
                header : 'Склад',
                dataIndex : 'warehouse',
                flex : 1,
                maxWidth : 300,
                sortable : false,
                renderer : this.columnRenderer
            }
        ];
    },
    
    columnRenderer : function(v, metaData) {
        if (Ext.isEmpty(v)) {
            return '<b>Все</b>';
        }
        return this.wraptextRenderer(v, metaData);
    }
    
});