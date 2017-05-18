Ext.define("App.ux.tree.FilterPanel", {
    extend : "Ext.tree.Panel",
    alias : "widget.uxFilterTree",
    
    rootVisible : false,
    useArrows : true,
    cls : 'x-panel-filter x-panel-plain',
    bodyCls : 'x-container-body',
    store : [],
    displayField : 'name',
    
    initComponent : function(){
        
        this.callParent(arguments);
        
        this.on('itemclick' , this.onItemClick, this);
    },
    
    onItemClick : function(tree, record) {
        var checked = record.get('checked');
                                        
        record.set('checked', ! checked);
        record.set('cls', (! checked) ? 'x-node-checked' : ''); 
        this.fireEvent('checkchange', record, ! checked);
    }
});