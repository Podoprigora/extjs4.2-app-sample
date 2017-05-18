Ext.define('App.ux.grid.features.Buffered', {
    extend : 'Ext.grid.feature.Feature',
    alias : 'feature.Buffered',
    
    init : function(grid) {
        this.grid.on('afterrender', function(){
            this.grid.addDocked(this.buildDockedItems());
            
            this.grid.getView().on("refresh", function(){
                this.grid.down("#Totals").update({count : this.grid.store.getTotalCount()});
            }, this);
            
        }, this);
    },
    
    buildDockedItems : function() {
        return {
            xtype : 'toolbar',
            dock : 'bottom',
            items : [
                ' ',
                { 
                    text : 'Refresh',
                    iconCls : 'icon-refresh',
                    scope : this.grid,
                    handler : this.grid.onRefresh
                },
                '->',
                { 
                    xtype : 'component',
                    itemId : 'Totals',
                    cls : 'x-component-grid-text-item',
                    tpl : 'Count: <b>{count}</b>'
                }, ' '
            ]
        };
    },
    
    onRefresh : function() {
        this.getSelectionModel().deselectAll();
        this.getStore().loadPage(1);
    }
    
});