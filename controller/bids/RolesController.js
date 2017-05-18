Ext.define('App.controller.bids.RolesController', {
    extend : 'Ext.app.Controller',
    
     model : [
        'bids.directories.RoleModel'
    ],
    
    stores : [
        'bids.directories.RolesLocalStore'
    ],
    
    views : [
        'bids.directories.roles.EditorGridPanel'   
    ],
    
    init : function() {
        
        this.control({
            'BidsDirectoryRolesEditorGridPanel' : {
                selectfromdirectory : this.onSelectFromDirectory,
                deleteitemclick : this.onDeleteItem
            }
        });
        
    },
    
    onSelectFromDirectory : function(grid, record) {
        if (Ext.isEmpty(grid.getStore().findRecord('role_id', record.get('id')))) {
            grid.getStore().add({
                role_id : record.get('id'),
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