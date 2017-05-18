Ext.define("App.view.settings.area_codes.ListField", {
    extend : "App.ux.picker.List",
    alias : "widget.AreaCodesListField",
    
    listHeight : 150,
    listWidth : 150,
    hideHeaders : true,
    
    initComponent : function(){
        this.store = Ext.valueFrom(this.store, Ext.create('App.store.settings.area_codes.CodesStore'));
        this.columns = this.buildColumns();
        
        this.callParent(arguments);
    },
    
    buildColumns : function() {
        return [
            {
                dataIndex : 'code',
                flex : 1
            } 
        ];
    }
});