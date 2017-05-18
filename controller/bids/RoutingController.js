Ext.define('App.controller.bids.RoutingController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'bids.directories.RouteModel'
    ],
    
    stores : [
        'bids.directories.RoutesStore'
    ],
    
    views : [
        'bids.directories.routing.EditorWindow',
        'bids.directories.routing.GridPanel'
    ],
    
    init : function() {
        
        this.control({
            'BidsDirectoryRoutesGridPanel' : {
                //afterrender : this.onLoadRecords,
                createbtnclick : this.onCreateItem,
                editbtnclick : this.onLoadItem,
                itemdblclick : function(view){
                    this.onLoadItem(view.ownerCt);
                },
                deletebtnclick : Ext.bind(App.ux.controller.BaseMethods.onDelete, this)
            },
            'BidsDirectoryRouteEditorWindow' : {
                savebtnclick : this.onSave
            }    
        });
        
    },
    
    onLoadRecords : function(grid) {
        grid.getStore().load();
    },
    
    onShowEditorWindow : function(grid) {
        var win = App.ux.window.Manager.create('BidsDirectoryRouteEditorWindow'),
            form = win.down('form');
            
        win.setMasterGrid(grid);
        win.show();
        
        form.el.unmask();
        form.getForm().reset();
        form.down('#statusesGrid').getStore().removeAll();
        form.down('#tasksGrid').getStore().removeAll();
        form.down('#areaCodesGrid').getStore().removeAll();
        form.down('#rolesGrid').getStore().removeAll();
        form.down('#channelsGrid').getStore().removeAll();
        
        return win;
    },
    
    onCreateItem : function(grid) {
        var win = this.onShowEditorWindow(grid);
        win.setTitle('Добавить правило');
    },
    
    onLoadItem : function(grid) {
        var selRecord = grid.getSelectionModel().getSelection()[0];
        if (Ext.isEmpty(selRecord) == false) {
            var win = this.onShowEditorWindow(grid);
                form = win.down('form'),
                statusesGrid = form.down('#statusesGrid'),
                tasksGrid = form.down('#tasksGrid'),
                areaCodesGrid = form.down('#areaCodesGrid'),
                rolesGrid = form.down('#rolesGrid'),
                channelsGrid = form.down('#channelsGrid'),
                basicForm = form.getForm();
                
            win.setTitle('Редактировать правило');
            form.el.mask('Загрузка ...');
            this.getModel('bids.directories.RouteModel').load(selRecord.get('id'), {
                success : function(record, operation){
                    form.el.unmask();
                    basicForm.loadRecord(record);
                    statusesGrid.getStore().loadRecords(record.getStatuses().getRange());
                    tasksGrid.getStore().loadRecords(record.getTasks().getRange());
                    areaCodesGrid.getStore().loadRecords(record.getAreaCodes().getRange());
                    rolesGrid.getStore().loadRecords(record.getRoles().getRange());
                    channelsGrid.getStore().loadRecords(record.getSalesChannels().getRange());
                },
                failure : function() {
                    form.el.unmask();
                    win.hide();
                }
            });
        }
    
    },
    
    onSave : function(win, mode) {
        var form = win.down('form'),
            statusesGrid = form.down('#statusesGrid'),
            tasksGrid = form.down('#tasksGrid'),
            areaCodesGrid = form.down('#areaCodesGrid'),
            rolesGrid = form.down('#rolesGrid'),
            channelsGrid = form.down('#channelsGrid'),
            basicForm = form.getForm(),
            model = Ext.create('App.model.bids.directories.RouteModel');
        
        if (statusesGrid.getStore().getCount() == 0) {
            App.ux.Msg.alert('Добавьте статусы!');
            return false;
        }
        
        model.set(basicForm.getFieldValues());
        model.setAssociationData('tasks', tasksGrid.getStore().getModifiedData());
        model.setAssociationData('area_codes', areaCodesGrid.getStore().getModifiedData());
        model.setAssociationData('roles', rolesGrid.getStore().getModifiedData());
        model.setAssociationData('statuses', statusesGrid.getStore().getRawData());
        model.setAssociationData('sales_channels', channelsGrid.getStore().getModifiedData());
        
        form.el.mask('Сохранение ...');
        model.save({
            success : function() {
                if (Ext.isEmpty(mode) == false && mode == 'close') {
                    win.hide();
                } else {
                    win.setTitle('Добавить правило');
                    basicForm.reset();
                    statusesGrid.getStore().removeAll();
                    tasksGrid.getStore().removeAll();
                    areaCodesGrid.getStore().removeAll();
                    rolesGrid.getStore().removeAll();
                    channelsGrid.getStore().removeAll();
                }
                win.getMasterGrid().getStore().load();
            },
            callback : function() {
                form.el.unmask();    
            }
        });
    }
    
});