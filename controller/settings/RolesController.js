Ext.define('App.controller.settings.RolesController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'settings.roles.ModuleModel',
        'settings.roles.RoleModel'
    ],
    
    stores : [
        'settings.roles.ModulesTreeStore',
        'settings.roles.RolesStore'
    ],
    
    views : [   
        'settings.roles.EditorWindow',
        'settings.roles.GridPanel',
        'settings.roles.ModulesTreePanel',
        'settings.roles.ContentPanel'    
    ],
    
    init : function() {
        
        this.control({
            'RolesContentPanel' : {
                afterrender : this.onReadyContentPanel
            },
            'RolesGridPanel' : {
                createbtnclick : this.onShowRoleEditorWindow,
                deletebtnclick : Ext.bind(App.ux.controller.BaseMethods.onDelete, this),
                editbtnclick : this.onLoadRole,
                itemdblclick : function(view) {
                    this.onLoadRole(view.ownerCt);
                },
                selectionchange : this.onRolesSelectionChange
            },
            'RoleEditorWindow' : {
                savebtnclick : this.onSaveRole
            },
            'RoleModulesTreeGridPanel' : {
                savebtnclick : this.onSaveRoleModules
            }
        });
        
    },
    
    onReadyContentPanel : function(panel) {
        panel.down('#rolesGrid').getStore().load();
    },
    
    onShowRoleEditorWindow : function(grid) {
        var win = App.ux.window.Manager.create('RoleEditorWindow');
        win.setMasterGrid(grid);
        win.show();
        win.setTitle('Добавить роль');
        return win;
    },
    
    onLoadRole : function(grid) {
        var record = grid.getSelectionModel().getSelection()[0];
        
        if (Ext.isEmpty(record)) {
            return false;
        }
        
        var win = this.onShowRoleEditorWindow(grid),
            form = win.down('form');
        
        win.setTitle('Редактирование роли');
        form.el.mask('Загрузка ...');
        
        this.getModel('settings.roles.RoleModel').load(record.get('id'), {
            success : function(record) {
                form.getForm().loadRecord(record);
            },
            failure : function() {
                win.hide();
            },
            callback : function() {
                form.el.unmask();
            }
        });
    },
    
    onSaveRole : function(win, mode) {
        var form = win.down('form'),
            basicForm = form.getForm(),
            model = Ext.create('App.model.settings.roles.RoleModel');
        if (basicForm.isValid()) {
            model.set(basicForm.getFieldValues());
            form.el.mask('Сохранение ...');
            model.save({
                success : function() {
                    if (Ext.isEmpty(mode)) {
                        basicForm.findField('name').focus(false, 50);
                        basicForm.findField('group').setValue(model.get('group'));
                    } else {
                        win.close();
                    }
                    win.getMasterGrid().getStore().load();
                },
                failure : function(record, operation) {
                    basicForm.markInvalid(operation.request.scope.reader.jsonData.errors);
                },
                callback : function() {
                    form.el.unmask();
                }
            });
        }
    },
    
    onRolesSelectionChange : function(selModel, records) {
        var rolesGrid = selModel.view.ownerCt,
            modulesTree = rolesGrid.nextSibling('#modulesTree'),
            selRecord = records[0];
        if (selRecord) {
            modulesTree.setDisabled(false);
            modulesTree.setTitle(Ext.String.format("Роль: {0}", selRecord.get('name')));
            modulesTree.getStore().addFilter('role_id', selRecord.get('id'));
        } else {
            modulesTree.getStore().getRootNode().removeAll();
            modulesTree.setDisabled(true); 
            modulesTree.setTitle('Выберите роль');
        }
    },
    
    onSaveRoleModules : function(tree) {
        tree.getStore().addListener('beforesync', function(){
            tree.el.mask('Сохранение ...');
        }, {single : true});
        tree.getStore().sync({
            callback : function() {
                tree.getView().refresh();
                tree.el.unmask();      
            }
        });
    }
    
});