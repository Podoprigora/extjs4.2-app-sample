Ext.define('App.controller.bids.TasksAssociationController', {
    extend : 'Ext.app.Controller',
    
    model : [
        'bids.directories.TaskAssociationModel'
    ],
    
    stores : [
        'bids.directories.TasksLocalStore'
    ],
    
    views : [
        'bids.directories.tasks.EditorGridPanel'   
    ],
    
    init : function() {
        
        this.control({
            'BidsDirectoryTasksEditorGridPanel' : {
                selectfromdirectory : this.onSelectFromDirectory,
                deleteitemclick : this.onDeleteItem
            }
        });
        
    },
    
    onSelectFromDirectory : function(grid, record) {
        if (Ext.isEmpty(grid.getStore().findRecord('task_id', record.get('id')))) {
            grid.getStore().add({
                task_id : record.get('id'),
                name : record.get('name'),
                priority : record.get('priority')
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