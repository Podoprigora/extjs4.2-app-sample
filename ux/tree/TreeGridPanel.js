Ext.define('App.ux.tree.TreeGridPanel', {
    extend : 'App.ux.tree.Panel',
    alias : 'widget.uxTreeGridPanel',
    
    mixins : {
        basicGrid : 'App.ux.grid.BasicGrid' 
    },
    
    rootVisible : false,
    useArrows : true,
    animate : false,
    hideHeaders : false,
    cls : 'x-treegrid hidden-actions-icon',

    initComponent : function() {
        
        this.callParent(arguments);
        
        this.getStore().on('load', this.onUpdateTotalLabel, this);
    },
    
    parentRenderer : function(v, meta, node) {
        if (! node.isLeaf()) {
            meta.tdCls = 'x-cell-parent';
            v = '<a href="javaScript:void(0)">' + v + '</div>';
        }
        return v;
    },
    
    onSetQuickFilter : function(tree, btn, dataField){
        this.mixins.basicGrid.onSetQuickFilter.apply(this, arguments);
    },
    
    onUpdateTotalLabel : function(store){
        var totalsLabel = this.down('#Totals');
        if (Ext.isEmpty(totalsLabel) == false) {
            if (store.getProxy().type == 'ajax') {
                totalsLabel.update({'count' : store.getProxy().getReader().jsonData['count'] });    
            }
        }
    }
    
});