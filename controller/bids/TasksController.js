Ext.define('App.controller.bids.TasksController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'bids.directories.TaskModel'
    ],
    
    stores : [
        'bids.directories.TasksTreeStore'
    ],
    
    views : [
        'bids.directories.tasks.EditorWindow',
        'bids.directories.tasks.TreePanel'
    ],
    
    init : function() {
        
        this.control({
            'BidsDirectoryTasksTreePanel' : {
                //afterrender : this.onLoadTasks,
                createrootitemclick : this.onCreateRootItem,
                createitemclick : this.onCreateItem,
                edititemclick : this.onLoadItem,
                deleteitemclick : this.onDeleteItem,
                itemdblclick : this.onItemDblClick
            },
            'BidsDirectoryTasksEditorWindow' : {
                savebtnclick : this.onSave
            }
        });
        
    },
    
    onLoadTasks : function(tree) {
        tree.onRefresh();
    },
    
    onShowEditorWinow : function(tree) {
        var win = App.ux.window.Manager.create('BidsDirectoryTasksEditorWindow');
        win.setMasterTree(tree);
        win.show();
        
        return win;
    },
    
    onSave : function(win, mode) {
        var form = win.down('form'),
            codesGrid = win.down('#codesGrid'),
            basicForm = form.getForm(),
            record = Ext.create('App.model.bids.directories.TaskModel');
        
        if (basicForm.isValid()) {
            record.set(basicForm.getFieldValues());
            record.setAssociationData('area_codes', codesGrid.getStore().getModifiedData());
            
            form.el.mask('Сохранение ...');
            
            record.save({
                success : function(record) {
                    var tree = win.getMasterTree(),
                        reloadNode = tree.getStore().getNodeById(record.get('parent_id'));

                    if (Ext.isEmpty(mode) == false && mode == 'close') {
                        win.hide();
                    } else {
                        win.setTitle('Добавить задачу');
                        basicForm.reset(true);         
                        basicForm.findField('parent_id').setValue(reloadNode.get('id'));
                        basicForm.findField('parent_name').setValue(reloadNode.get('name'));
                        basicForm.findField('name').focus(false, 50);
                        win.down('#codesGrid').getStore().removeAll();
                    }
                 
                    reloadNode.set('leaf', false);
                    reloadNode.collapse();
                    tree.getStore().load({
                        node : reloadNode,
                        callback : function() {
                            reloadNode.expand();
                        }
                    });
                },
                callback : function() {
                    form.el.unmask();
                }
            });
        }
    },
    
    onCreateRootItem : function(tree) {
        var win = this.onShowEditorWinow(tree);
        win.setTitle('Добавить задачу');
        
        var basicForm = win.down('form').getForm(),
            rootNode = tree.getStore().getRootNode();   
        basicForm.findField('parent_id').setValue(rootNode.get('id'));
        basicForm.findField('parent_name').setValue(rootNode.get('name'));    
    },
    
    onCreateItem : function(view, rowIndex, colIndex, item, e, node) {
        var win = this.onShowEditorWinow(view.ownerCt);
        win.setTitle('Добавить задачу');
        
        var basicForm = win.down('form').getForm();
        basicForm.findField('parent_id').setValue(node.get('id'));
        basicForm.findField('parent_name').setValue(node.get('name'));
    },
    
    onLoadItem : function(view, rowIndex, colIndex, item, e, node) {
        var win = this.onShowEditorWinow(view.ownerCt),
            form = win.down('form');
        win.setTitle('Редактирование задачи');
        form.el.mask('Загрузка ...');
        this.getModel('bids.directories.TaskModel').load(node.get('id'), {
            success : function(record, operation) {
                var basicForm = form.getForm(),
                    parentNode = node.parentNode;
                basicForm.findField('parent_name').setValue(parentNode.get('name'));
                basicForm.loadRecord(record);
                form.down('#codesGrid').getStore().loadRecords(record.getCodes().getRange());
            },
            failure : function() {
                win.hide();
            },
            callback : function() {
                form.el.unmask();
            }
        });
    },
    
    onDeleteItem : function(view, rowIndex, colIndex, item, e, node) {
        var tree = view.ownerCt,
            parentNode = node.parentNode;
            
        App.ux.Msg.confirm("Вы действительно хотите выполнить удаление?", function(btn){
            if (btn == 'yes') {
                tree.el.mask('Удаление ...');
                
                Ext.Ajax.request({
                    url : node.getProxy().api.destroy,
                    params : {records : Ext.encode([{id : node.get('id')}])},
                    success : function(response) {
                        if ((response = App.ux.util.Response.isValidStatus(response))) {
                            tree.getSelectionModel().deselectAll();
                            parentNode.collapse();
                            tree.getStore().load({
                                node : parentNode,
                                callback : function() {
                                    parentNode.expand();
                                }
                            });  
                        }
                    },
                    callback : function() {
                        tree.el.unmask();      
                    }
                });
            } 
        });
    },
    
    onItemDblClick : function(view, node) {
        this.onLoadItem(view, null, null, null, null, node);    
    }
});