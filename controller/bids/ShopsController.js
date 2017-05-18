Ext.define('App.controller.bids.ShopsController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'bids.directories.ShopModel'
    ],
    
    stores : [
        'bids.directories.ShopsStore'
    ],
    
    views : [
        'bids.directories.shops.GridPanel',
        'bids.directories.shops.ImportEditorWindow',
        'bids.directories.shops.ListField'
    ],
    
    init : function() {

        this.control({
            'BidsDirectoryShopsGridPanel' : {
                //afterrender : this.onLoadRecords,
                importbtnclick : this.onShowImportWindow,
                deletebtnclick : Ext.bind(App.ux.controller.BaseMethods.onDelete, this),
                edit : this.onUpdateRecord
            },
            'BidsDirectoryShopsImportEditorWindow' : {
                importbtnclick : this.onFormSubmit    
            }
        });
        
    },
    
    onLoadRecords : function(grid) {
        grid.getStore().load();
    },
    
    onShowImportWindow : function(grid) {
        var win = App.ux.window.Manager.create('BidsDirectoryShopsImportEditorWindow');
        win.setMasterGrid(grid);
        win.show();
    },
    
    onFormSubmit : function(win) {
        var form = win.down('form'),
            basicForm = form.getForm(),
            me = this;
        
        if (basicForm.isValid()) {
            form.el.mask('Загрузка файла ...');
            basicForm.submit({
                url : Settings.urls.getUrl('bids.shops.upload_file'),
                success : function(basicForm, action) {
                    form.el.unmask();
                    if (App.ux.util.Response.isValidStatus(action.response)) {
                        var response = Ext.decode(action.response.responseText);
                        
                        win.hide();
                        me.doImport(response.file_name, 0, win.getMasterGrid());
                    }
                },
                failure : function() {
                    form.el.unmask();
                }
            });
        }
    },
    
    doImport : function(fileName, startRow, grid) {
        var me = this;
        grid.el.mask(Ext.String.format('Чтение файла ... <br /> Обработано строк: <b>{0}</b>', Math.floor(startRow/100)*100));
        Ext.Ajax.request({
            url : Settings.urls.getUrl('bids.shops.excel_import'),
            params : {
                file_name : fileName,
                start_row : startRow
            },
            success : function(response, operation) {
                if (App.ux.util.Response.isValidStatus(response)) {
                    response = Ext.decode(response.responseText);
                    if (Ext.isEmpty(response.start_row) == false) {
                        me.doImport(fileName, response.start_row, grid);    
                    } else {
                        grid.el.unmask();
                        grid.getStore().loadPage(1);
                    }
                } else {
                    grid.el.unmask();    
                }
            },
            failure : function() {
                grid.el.unmask();
            }
        });
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