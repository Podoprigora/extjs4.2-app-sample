Ext.define('App.controller.maps.TransportsDirectoryController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'maps.TransportModel'
    ],
    
    stores : [
        'maps.TransportsStore'
    ],
    
    views : [
        'maps.transports.directory.EditorWindow',
        'maps.transports.directory.GridPanel'
    ],
    
    init : function() {
        this.control({
            'MapsTransportsDirectoryGridPanel' : {
                createbtnclick : this.onCreateItem,
                editbtnclick : this.onEditItem,
                itemdblclick : function(view){  
                     this.onEditItem(view.ownerCt);    
                },
                deletebtnclick : Ext.bind(App.ux.controller.BaseMethods.onDelete, this)
            },
            'MapsTransportDirectoryEditorWindow' : {
                savebtnclick : this.onSave
            }    
        });
    },
    
    onLoadRecords : function(grid) {
        grid.getStore().load();
    },
    
    onShowEditorWindow : function(grid) {
        var win = App.ux.window.Manager.create('MapsTransportDirectoryEditorWindow');
        win.setMasterGrid(grid);
        win.show();
        
        return win; 
    },
    
    onCreateItem : function(grid) {
        var win = this.onShowEditorWindow(grid);
        win.setTitle('Добавить машину');
    },
    
    onEditItem : function(grid) {
        var selRecord = grid.getSelectionModel().getSelection()[0],
            win = this.onShowEditorWindow(grid),
            form = win.down('form');
        win.setTitle('Редактирование машины');
        form.el.mask('Загрузка ...');
        this.getModel('maps.TransportModel').load(selRecord.get('id'), {
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
            record = Ext.create('App.model.maps.TransportModel');
        
        if (basicForm.isValid()) {
            record.set(basicForm.getFieldValues());
            record.setAssociationData('area_codes', form.down('#codesGrid').getStore().getModifiedData());
            
            form.el.mask('Сохранение ...');
            record.save({
                success : function() {
                    if (Ext.isEmpty(mode) == false && mode == 'close') {
                        win.hide();    
                    } else {
                        win.setTitle('Добавить машину');
                        basicForm.reset();
                        form.down('#codesGrid').getStore().removeAll();
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