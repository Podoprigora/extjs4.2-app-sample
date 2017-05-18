Ext.define('App.controller.bids.StatusesAssociationController', {
    extend : 'Ext.app.Controller',
    
    model : [
        'bids.directories.StatusAssociationModel'
    ],
    
    stores : [
        'bids.directories.StatusesLocalStore'
    ],
    
    views : [
        'bids.directories.statuses.EditorGridPanel'   
    ],
    
    init : function() {
        
        this.control({
            'BidsDirectoryStatusesEditorGridPanel' : {
                selectfromdirectory : this.onSelectFromDirectory,
                deleteitemclick : this.onDeleteItem
            }
        });
        
    },
    
    onSelectFromDirectory : function(grid, record) {
        if (Ext.isEmpty(grid.getStore().findRecord('status_id', record.get('id')))) {
            grid.getStore().add({
                status_id : record.get('id'),
                position : record.get('position'),
                name : record.get('name')
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