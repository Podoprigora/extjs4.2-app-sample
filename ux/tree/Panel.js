Ext.define('App.ux.tree.Panel', {
    extend : 'Ext.tree.Panel',
    alias : 'widget.uxTreePanel',
    
    rootVisible : true,
    folderSort : false,
    useArrows : true,
    hideHeaders : true,
    animate : false,
    autoScroll : true, 
    
    config : {
        loadAllNodes : true
    },
    
    initComponent : function() {
        //this.plugins = [Ext.create('Ext.grid.plugin.BufferedRenderer')];        
        this.callParent(arguments);
        
        this.getStore().on('beforeload', this._onBeforeStoreLoad, this);
        this.getStore().on('load', this._onStoreLoad, this);  
    },
    
    _onBeforeStoreLoad : function() {
        if (this.loadAllNodes) {
            this.collapseAll();
        }
    },
    
    _onStoreLoad : function(st, node, rec, success){
        var me = this,
            rootNode = this.getStore().getRootNode();

        if (this.loadAllNodes) {
            // Fix unmask if disabled 
            if (me.isDisabled()) {
                me.setDisabled(true);
            }
            
            this.doComponentLayout();
            this.getView().refresh();
        }
    },
    
    onActionHandler : function(event, selectRow, view, rowIndex, colIndex, item, e, record, row) {
        if (e.target.className.indexOf("icon-") == -1 || e.getKey() == e.ENTER) {
            return false;
        }
        if (selectRow) {
            view.getSelectionModel().select(record);
        }
        this.fireEvent(event, view, rowIndex, colIndex, item, e, record); 
    },
    
    onUpdateTotalLabel : function(store){
        this.down('#Totals').update({'count' : store.getProxy().getReader().jsonData['count'] });
    },
    
    onRefresh : function() {
        var rootNode = this.getStore().getRootNode();
        rootNode.collapse();
        this.getStore().load({
            callback : function() {
                rootNode.expand();
            }
        });
    }
    
});