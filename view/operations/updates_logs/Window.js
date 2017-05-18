Ext.define("App.view.operations.updates_logs.Window", {
    extend : "App.ux.window.Window",
    alias : "widget.OperationUpdatesLogsWindow",
    id : 'OperationUpdatesLogsWindow',
    
    title : 'История изменений',
    width : 800,
    height : 400,
    
    initComponent : function(){
        
        this.items = {
            xtype : 'OperationUpdatesLogsGridPanel'
        };
        
        this.callParent(arguments);
    }
});