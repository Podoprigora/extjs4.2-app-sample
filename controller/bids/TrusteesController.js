Ext.define('App.controller.bids.TrusteesController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'bids.directories.TrusteeModel'
    ],
    
    stores : [
        'bids.directories.TrusteesStore'
    ],
    
    views : [
        'bids.directories.trustees.EditorWindow',
        'bids.directories.trustees.GridPanel',
        'bids.directories.trustees.ListField'
    ],
    
    init : function() {
        this.control({
            'BidsDirectoryTrusteesGridPanel' : {
                //afterrender : this.onLoadRecords,
                createbtnclick : this.onCreateItem,
                editbtnclick : this.onEditItem,
                itemdblclick : function(view){  
                     this.onEditItem(view.ownerCt);    
                },
                deletebtnclick : Ext.bind(App.ux.controller.BaseMethods.onDelete, this)
            },
            'BidsDirectoryTrusteeEditorWindow' : {
                savebtnclick : this.onSave
            }    
        });
    },
    
    onLoadRecords : function(grid) {
        grid.getStore().load();
    },
    
    onShowEditorWindow : function(grid) {
        var win = App.ux.window.Manager.create('BidsDirectoryTrusteeEditorWindow');
        win.setMasterGrid(grid);
        win.show();
        
        return win;
    },
    
    onCreateItem : function(grid) {
        var win = this.onShowEditorWindow(grid);
        win.setTitle('Добавить подписывающее лицо');
    },
    
    onEditItem : function(grid) {
        var selRecord = grid.getSelectionModel().getSelection()[0],
            win = this.onShowEditorWindow(grid),
            form = win.down('form');
        win.setTitle('Редактирование подписывающего лица');
        form.el.mask('Загрузка ...');
        this.getModel('bids.directories.TrusteeModel').load(selRecord.get('id'), {
            success : function(record) {
                form.getForm().loadRecord(record);
                form.down('#codesGrid').getStore().loadRecords(record.getCodes().getRange());
            },
            failure : function() {
                win.hide();
            },
            callback : function() {
                form.el.unmask();
            }
        })
        
    },
    
    onSave : function(win, mode) {
        var form = win.down('form'),
            basicForm = form.getForm(),
            record = Ext.create('App.model.bids.directories.TrusteeModel');
        
        if (basicForm.isValid()) {
            record.set(basicForm.getFieldValues());
            record.setAssociationData('area_codes', form.down('#codesGrid').getStore().getModifiedData());
            
            form.el.mask('Сохранение ...');
            record.save({
                success : function() {
                    if (Ext.isEmpty(mode) == false && mode == 'close') {
                        win.hide();    
                    } else {
                        win.setTitle('Добавить лицо');
                        basicForm.reset();
                        form.down('#codesGrid').getStore().removeAll();
                        basicForm.findField('fio1').focus(false, 50);
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