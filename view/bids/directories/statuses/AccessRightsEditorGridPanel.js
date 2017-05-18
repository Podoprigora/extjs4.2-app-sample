Ext.define("App.view.bids.directories.statuses.AccessRightsEditorGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.BidDirectoryStatusAccessRightsEditorGridPanel",
    
    hideHeaders : true,
    disableSelection : true,
    
    viewConfig : {
        trackOver : false,
        stripeRows : false
    },
    
    config : {
        accessRightNamesStore : null
    },
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.bids.directories.StatusAccessRightsLocalStore');
        this.accessRightNamesStore = Ext.create('App.store.bids.directories.StatusAccessRightNamesLocalStore');
        this.columns = this.buildColumns();
        this.cls += " x-no-dirty";
        
        this.callParent(arguments);
    },
    
    buildColumns : function() {
        return [
            {
                xtype : 'checkcolumn',
                dataIndex : 'is_allowed',
                width : 30,
                align : 'center'
            },
            {
                dataIndex : 'right_name',
                renderer : App.ux.util.Format.storeColumnRenderer(this.accessRightNamesStore, function(record){
                    return record.get('title');
                }),
                flex : 1
            }
        ];
    },
    
    setDefaultData : function() {
        this.getStore().removeAll(false);
        this.getAccessRightNamesStore().each(function(item){
            this.getStore().add({
                right_name : item.get('name')
            });
        }, this);
    },
    
    setRecords : function(records) {
        this.getStore().loadRecords(records);
        this.getAccessRightNamesStore().each(function(item){
            if (Ext.isEmpty(this.getStore().findRecord('right_name', item.get('name')))) {
                this.getStore().add({
                    right_name : item.get('name')
                });    
            }
        }, this);    
    }
    
});