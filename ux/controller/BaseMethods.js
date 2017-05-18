
/*
 * Basic methods for all controllers
 */

Ext.define('App.ux.controller.BaseMethods', {
    
    singleton : true,
    
    onDelete : function(grid, afterSuccessFn) {
        
        var selModel = grid.getSelectionModel(),
            me = this;
        if (selModel.hasSelection()) {
            var selRecords = selModel.getSelection();   
        } else {
            App.ux.Msg.alert('Выберите строку для удаления!');
        } 
        
        App.ux.Msg.confirm("Вы действительно хотите выполнить удаление?", function(btn){
            if (btn == 'yes') {
                grid.el.mask('Удаление ...');
                
                var data = App.ux.util.Format.convertRecordsToIdsArray(selRecords);
                
                Ext.Ajax.request({
                    url : selRecords[0].getProxy().api.destroy,
                    params : {records : Ext.encode(data)},
                    success : function(response) {
                        if ((response = App.ux.util.Response.isValidStatus(response))) {
                            grid.getSelectionModel().deselectAll();
                            grid.getStore().load(); 
                            
                            if (Ext.isFunction(afterSuccessFn)) {
                                afterSuccessFn();    
                            }
                        }
                    },
                    callback : function() {
                        grid.el.unmask();      
                    }
                });
            } 
        });
    }
});