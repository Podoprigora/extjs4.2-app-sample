Ext.define('App.controller.operations.ExcelImportController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'operations.excel_import.ImportLogModel',
        'operations.excel_import.InvalidWarehouseModel'
    ],
    
    stores : [
        'operations.excel_import.ImportLogStore',
        'operations.excel_import.InvalidWarehousesStore'
    ],
    
    views : [
        'operations.excel_import.LogGridPanel',
        'operations.excel_import.InvalidWarehousesWindow'
    ],
    
    init : function() {

        this.control({
            'ExcelImportLogGridPanel' : {
                selectfile : this.onSelectFile,
                importallbtnclick : Ext.bind(this.onImport, this, ["all"], 1),
                importcustombtnclick : Ext.bind(this.onImport, this, ["custom"], 1)
            },
            'ExcelImportInvalidWarehousesWindow' : {
                savebtnclick : this.onSaveWarehouses
            }
        });
        
    },
    
    onSelectFile : function(panel, field, value) {
        var form = panel.down('#uploadForm'),
            me = this;
        
        panel.el.mask('<b>0%</b> Загрузка файла ...');
            
        form.getForm().submit({
            url : Settings.urls.getUrl('operations.excel_import.upload'),
            success : function(form, action) {
                if (App.ux.util.Response.isValidStatus(action.response)) {
                    var response = Ext.decode(action.response.responseText);
                    me.processSavingLog(panel, response.file_name, 0);    
                }
            },
            failure : function() {
                panel.el.unmask();
            }
        });
    },
    
    processSavingLog : function(panel, fileName, startRow) {
        
        var me = this;
        
        panel.el.mask(Ext.String.format('Чтение файла ... <br /> Обработано строк: <b>{0}</b>', Math.floor(startRow/100)*100));

        Ext.Ajax.request({
            url : Settings.urls.getUrl('operations.excel_import.save_log'),
            params : {
                file_name : fileName,
                start_row : startRow
            },
            success : function(response, operation) {
                panel.el.unmask();
                if (App.ux.util.Response.isValidStatus(response)) {
                    var response = Ext.decode(response.responseText);
                    if (Ext.isEmpty(response.start_row)) {
                        panel.el.unmask();
                        panel.setImportState();
                        panel.getStore().addFilter('file_name', fileName);
                        panel.down('#conditionsForm').getForm().findField('file_name').setValue(fileName);
                    } else {
                        me.processSavingLog(panel, response.file_name, response.start_row);
                    }
                }     
            },
            failure : function(response, oprtation) {
                panel.el.unmask();
            }
        });
        
    },
    
    onImport : function(grid, type) {
        var form = grid.down('#conditionsForm'),
            me = this,
            confirmMsg = (type == 'all') ? "Вы действительно хотите обновить всю базу?" : "Вы действительно хотите обновить только склады из файла?";
        
        form.getForm().findField('type').setValue(type);
            
        if (form.getForm().isValid()) {     
            App.ux.Msg.confirm(confirmMsg, function(btn){
                if (btn == 'yes') {
                    me.doImport(grid);
                }
            });
        }

    },
    
    doImport : function(grid) {
        var form = grid.down('#conditionsForm'),
            params = form.getForm().getFieldValues(),
            me = this;
        
        grid.el.mask('Импорт данных ...');
        
        Ext.Ajax.request({
            url : Settings.urls.getUrl('operations.excel_import.import'),
            params : params,
            success : function(response, operation) {
                grid.el.unmask();
                
                var response = Ext.decode(response.responseText);
                if (response.success == false && Ext.isEmpty(response.records) == false) {
                    me.showInvalidWarehouses(response.records, grid);    
                } else if (response.success == true) {
                    grid.setUploadState();
                    App.ux.Msg.confirm("Изменения успешно внесены, необходимо перезагрузить систему!<br> Выполнить перезагрузку сейчас?", function(btn){
                        if (btn == 'yes') {
                            window.location.href = "/";
                        }
                    });
                } else {
                    App.ux.util.Response.validateStatus(null, response, operation);
                }
            },
            callback : function() {
                grid.el.unmask();
            }
        });
    },
    
    showInvalidWarehouses : function(data, masterGrid) {
        var win = App.ux.window.Manager.create('ExcelImportInvalidWarehousesWindow');
        win.setMasterGrid(masterGrid);
        win.show();
        
        var grid = win.down('grid');
        grid.getStore().removeAll();
        grid.getView().refresh();
        grid.getStore().loadData(data);
    },
    
    onSaveWarehouses : function(win) {
        var grid = win.down('grid'),
            invalidRow = null,
            me = this;
        
        grid.getStore().each(function(item){
            if (Ext.isEmpty(item.get('city_id')) || isNaN(item.get('city_id'))) {
                invalidRow = item;
                return false;
            }
        });
        
        if (Ext.isEmpty(invalidRow) == false) {
            App.ux.Msg.alert(Ext.String.format("Для склада <b>{0}</b> не указан город!", invalidRow.get('title')));
            return false;
        } else {
            
            var data = grid.getStore().getModifiedData();
            win.el.mask('Сохранение ...');
            Ext.Ajax.request({
                url : Settings.urls.getUrl('operations.excel_import.import_warehouses'),
                params : {records : Ext.encode(data)},
                success : function(response, operation) {
                    var response = Ext.decode(response.responseText);
                    if (response.success == true) {
                        win.hide();
                        me.doImport(win.getMasterGrid());   
                    } else {
                        App.ux.util.Response.validateStatus(null, response, operation);
                    }
                },
                callback : function() {
                    win.el.unmask();    
                }
            });
        }
    }
    
});
