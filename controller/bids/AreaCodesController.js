Ext.define('App.controller.bids.AreaCodesController', {
    extend : 'Ext.app.Controller',
    
     model : [
        'bids.directories.AreaCodeModel'
    ],
    
    stores : [
        'bids.directories.AreaCodesLocalStore'
    ],
    
    views : [
        'bids.directories.area_codes.EditorGridPanel'   
    ],
    
    init : function() {
        
        this.control({
            'BidsDirectoryAreaCodesEditorGridPanel' : {
                selectfromdirectory : this.onSelectFromDirectory,
                deleteitemclick : this.onDeleteItem
            }
        });
        
    },
    
    onSelectFromDirectory : function(grid, record) {
        if (Ext.isEmpty(grid.getStore().findRecord('code_id', record.get('id')))) {
            grid.getStore().add({
                code_id : record.get('id'),
                code : record.get('code')
            });
            grid.getView().refresh();
        }
    },
    
    onDeleteItem : function(grid, record) {
        App.ux.Msg.confirm('Вы действительно хотите выполнить удаление?', function(btn){
            if (btn == 'yes') {
                record.set('removed', 1);
                grid.getStore().remove(record);
                grid.getView().refresh();
            }    
        });
    }
    
});