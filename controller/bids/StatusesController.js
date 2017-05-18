Ext.define('App.controller.bids.StatusesController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'bids.directories.StatusAccessRightNameModel',
        'bids.directories.StatusAccessRightModel',
        'bids.directories.StatusModel'
    ],
    
    stores : [
        'bids.directories.StatusAccessRightNamesLocalStore',
        'bids.directories.StatusAccessRightsLocalStore',
        'bids.directories.StatusesStore'
    ],
    
    views : [
        'bids.directories.statuses.AccessRightsEditorGridPanel',
        'bids.directories.statuses.EditorWindow',
        'bids.directories.statuses.GridPanel'
    ],
    
    init : function() {
        
        this.control({
            'BidsDirectoryStatusesGridPanel' : {
                //afterrender : this.onLoadRecords,
                createbtnclick : this.onCreateItem,
                editbtnclick : this.onEditItem,
                itemdblclick : function(view){  
                     this.onEditItem(view.ownerCt);    
                },
                deletebtnclick : Ext.bind(App.ux.controller.BaseMethods.onDelete, this)
            },
            'BidsDirectoryStatusEditorWindow' : {
                savebtnclick : this.onSave
            }    
        });
        
    },
    
    onLoadRecords : function(grid) {
        grid.getStore().load();
    },
    
    onShowEditorWindow : function(grid) {
        var win = App.ux.window.Manager.create('BidsDirectoryStatusEditorWindow');
        win.setMasterGrid(grid);
        win.show();
        win.down('#rolesGrid').getStore().removeAll();
        win.down('#accessRightsGrid').setDefaultData();
        return win;
    },
    
    onCreateItem : function(grid) {
        var win = this.onShowEditorWindow(grid);
        win.setTitle('Добавить статус');
    },
    
    onEditItem : function(grid) {
        var selRecord = grid.getSelectionModel().getSelection()[0],
            win = this.onShowEditorWindow(grid),
            form = win.down('form');
        
        win.setTitle('Редактирование статуса');
        form.el.mask('Загрузка ...');
        
        this.getModel('bids.directories.StatusModel').load(selRecord.get('id'), {
            success : function(record) {
                form.getForm().loadRecord(record);
                form.down('#rolesGrid').getStore().loadRecords(record.getRoles().getRange());
                if (Ext.Object.getSize(record.getAccessRights().getRange())) {
                    form.down('#accessRightsGrid').setRecords(record.getAccessRights().getRange()); 
                }
            },
            failure : function() {
                win.hide();
            },
            callback : function() {
                form.el.unmask();
            }
        });
    },
    
    onSave : function(win, mode) {
        var form = win.down('form'),
            basicForm = form.getForm(),
            record = Ext.create('App.model.bids.directories.StatusModel');
        
        if (basicForm.isValid()) {
            record.set(basicForm.getFieldValues());
            record.setAssociationData('roles', form.down('#rolesGrid').getStore().getModifiedData());
            record.setAssociationData('access_rights', form.down('#accessRightsGrid').getStore().getRawData());
            
            form.el.mask('Сохранение ...');
            record.save({
                success : function() {
                    if (Ext.isEmpty(mode) == false && mode == 'close') {
                        win.hide();    
                    } else {
                        win.setTitle('Добавить статус');
                        basicForm.reset();
                        form.down('#rolesGrid').getStore().removeAll();
                        form.down('#accessRightsGrid').setDefaultData();
                        
                        basicForm.findField('name').focus(false, 50);
                    }
                    win.getMasterGrid().getStore().load();
                },
                callback : function() {
                    form.el.unmask();
                }
            });
        }
    }
    
});