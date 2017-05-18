Ext.define('App.controller.main.HelpGroupsController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'main.directories.HelpGroupModel'
    ],
    
    stores : [
        'main.directories.HelpGroupsStore'
    ],
    
    views : [
        'main.directories.help_groups.EditorWindow',
        'main.directories.help_groups.GridPanel'    
    ],
    
    init : function() {
        this.control({
            'MainDirectoryHelpGroupEditorWindow' : {
                savebtnclick : this.onSave
            },
            'MainDirectoryHelpGroupsGridPanel' : {
                createbtnclick : this.onCreate,
                editbtnclick : this.onEdit,
                itemdblclick : function(view){
                    this.onEdit(view.ownerCt);
                },
                deletebtnclick: Ext.bind(App.ux.controller.BaseMethods.onDelete, this)
            }
        });
    },
    
    showEditorWindow : function(grid){
        var win = App.ux.window.Manager.create('MainDirectoryHelpGroupEditorWindow');
        win.show();
        win.setMasterGrid(grid);
        return win;
    },
    
    onCreate : function(grid){
        var win = this.showEditorWindow(grid);
        win.setTitle('Добавить группу');
    },
    
    onEdit : function(grid){
        var selRecord = grid.getSelectionModel().getSelection()[0];
        
        if (selRecord) {
            var win = this.showEditorWindow(grid),
                form = win.down('form');
            win.setTitle('Редактирование группы');
            
            form.el.mask('Загрузка ...');
            
            this.getModel('main.directories.HelpGroupModel').load(selRecord.get('id'), {
                success : function(record){
                    form.el.unmask();
                    form.getForm().loadRecord(record);
                },
                failure : function(){
                    win.hide();
                }
            });
        }
    },
    
    onSave : function(win, mode){
        var form = win.down('form'),
            model = Ext.create('App.model.main.directories.HelpGroupModel');
        
        if (form.getForm().isValid()) {
            model.set(form.getForm().getFieldValues());
            
            form.el.mask('Сохранение ...');
            
            model.save({
                success : function() {
                    if (mode == 'close') {
                        win.hide();
                    } else {
                        win.setTitle('Добавить группу');
                        
                        form.getForm().reset();
                        form.getForm().findField('name').focus(false, 200);
                    }
                    win.getMasterGrid().onRefresh();
                },
                callback : function(){
                    form.el.unmask();
                }
            });
        }
    }
    
});