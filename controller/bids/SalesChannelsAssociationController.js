Ext.define('App.controller.bids.SalesChannelsAssociationController', {
    extend : 'Ext.app.Controller',
    
    model : [
        'bids.directories.SalesChannelAssociationModel'
    ],
    
    stores : [
        'bids.directories.SalesChannelsLocalStore'
    ],
    
    views : [
        'bids.directories.sales_channels.EditorGridPanel'   
    ],
    
    init : function() {
        
        this.control({
            'BidsDirectorySalesChannelsEditorGridPanel' : {
                selectfromdirectory : this.onSelectFromDirectory,
                deleteitemclick : this.onDeleteItem
            }
        });
        
    },
    
    onSelectFromDirectory : function(grid, record) {
        if (Ext.isEmpty(grid.getStore().findRecord('channel_id', record.get('id')))) {
            grid.getStore().add({
                channel_id : record.get('id'),
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