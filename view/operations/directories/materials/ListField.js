Ext.define("App.view.operations.directories.materials.ListField", {
    extend : "App.ux.picker.List",
    alias : "widget.MaterialsListField",
    
    listHeight : 250,
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.operations.directories.MaterialsStore');
        this.columns = this.buildColumns();
        
        this.callParent(arguments);
    },
    
    buildColumns : function() {
        return [
            {
                header : 'Код',
                dataIndex : 'code',
                width : 100,
                align : 'center'
            },
            {
                header : 'Наименование',
                dataIndex : 'name',
                flex : 1
            } 
        ];
    }
});