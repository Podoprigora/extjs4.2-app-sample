Ext.define("App.view.bids.updates_log.Window", {
    extend : "App.ux.window.Window",
    alias : "widget.BidUpdatesLogWindow",
    id : 'BidUpdatesLogWindow',
    
    title : 'История изменений',
    width : 800,
    height : 400,
    
    initComponent : function(){
        
        this.items = {
            xtype : 'BidUpdatesLogGridPanel'
        };
        
        this.callParent(arguments);
    }
});