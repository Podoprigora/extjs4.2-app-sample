Ext.define("App.view.operations.directories.codes.ListField", {
    extend : "App.ux.picker.List",
    alias : "widget.BatchesListField",
    
    listHeight : 250,
    listWidth : 200,
    hideHeaders : true,
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.operations.directories.CodesStore');
        this.columns = this.buildColumns();
        
        this.callParent(arguments);
    },
    
    buildColumns : function() {
        return [
            {
                dataIndex : 'name',
                flex : 1,
                align : 'left'
            } 
        ];
    }
});