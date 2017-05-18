Ext.define('App.controller.bids.TasksTypesController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'bids.directories.TasksTypeModel'
    ],
    
    stores : [
        'bids.directories.TasksTypesStore'
    ],
    
    views : [
        'bids.directories.tasks_types.GridPanel',
        'bids.directories.tasks_types.EditorWindow'
    ],
    
    init : function() {

        this.control({
            'BidsDirectoryTasksTypesGridPanel' : {
                createbtnclick : this.onCreateItem,
                deletebtnclick : Ext.bind(App.ux.controller.BaseMethods.onDelete, this),
                edit : this.onUpdateRecord
            },
            'BidsDirectoryTasksTypeEditorWindow' : {
                savebtnclick : this.onSave
            } 
        });
        
    },
    
    onLoadRecords : function(grid) {
        grid.getStore().load();
    },

    
    onShowEditorWindow : function(grid) {
        var win = App.ux.window.Manager.create('BidsDirectoryTasksTypeEditorWindow');
        win.setMasterGrid(grid);
        win.show();
        return win;
    },
    
    onCreateItem : function(grid) {
        var win = this.onShowEditorWindow(grid);
        win.setTitle('Добавить тип задачи');
    },
    
    onSave : function(win, mode) {
        var form = win.down('form'),
            basicForm = form.getForm(),
            record = Ext.create('App.model.bids.directories.TasksTypeModel');
        
        if (basicForm.isValid()) {
            record.set(basicForm.getFieldValues());
            
            form.el.mask('Сохранение ...');
            record.save({
                success : function() {
                    if (Ext.isEmpty(mode) == false && mode == 'close') {
                        win.hide();    
                    } else {
                        win.setTitle('Добавить статус');
                        basicForm.reset();
                        basicForm.findField('name').focus(false, 50);
                    }
                    win.getMasterGrid().getStore().load();
                },
                callback : function() {
                    form.el.unmask();
                }
            });
        }
    },
    
    onUpdateRecord : function(editor, e) {
        if (e.record.hasChanges()) {
            e.record.save({
                success : function(record, operation) {
                    if (!App.ux.util.Response.isValidStatus(operation.response)) {
                        record.set(e.record.raw)
                    }
                    record.set('updated', new Date());
                    e.grid.getView().refresh();
                },
                failure : function() {
                    e.record.reject();   
                }
            });   
        }
    }
    
});