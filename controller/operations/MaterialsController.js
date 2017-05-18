Ext.define('App.controller.operations.MaterialsController', {
    extend : 'Ext.app.Controller',
    
    models: [
        "operations.directories.MaterialModel"
    ],
    stores: [
        "operations.directories.MaterialsStore"
    ],
    views: [
        "operations.directories.materials.ListField", 
        "operations.directories.materials.GridPanel", 
        "operations.directories.materials.EditorWindow",
        "operations.directories.materials.ImportEditorWindow"
    ],
    
    init: function () {
        this.control({
            'DirectoryMaterialsGridPanel' : {
                edit: this.onUpdateRecord,
                createbtnclick: this.onCreateBtnClick,
                deletebtnclick: Ext.bind(App.ux.controller.BaseMethods.onDelete, this),
                changefilter: this.onChangeFilter,
                importbtnclick : this.onShowImportWindow
            },
            'DirectoryMaterialEditorWindow' : {
                savebtnclick: this.onSubmitForm
            },
            'DirectoryMaterialsImportEditorWindow' : {
                importbtnclick : this.onImportFormSubmit    
            }
        });
    },
    
    onCreateBtnClick: function (grid) {
        var win = App.ux.window.Manager.create("DirectoryMaterialEditorWindow");
        win.setMasterGrid(grid);
        win.show();
    },
    
    onSubmitForm: function (win, mode) {
        var form = win.down("form"),
            basicForm = form.getForm(),
            model = Ext.create("App.model.operations.directories.MaterialModel");
            
        if (basicForm.isValid()) {
            model.set(basicForm.getFieldValues());
            form.el.mask("Сохранение ...");
            
            model.save({
                success: function (record, operation) {
                    if (Ext.isEmpty(mode) == false && mode == "close") {
                        win.hide()
                    } else {
                        basicForm.reset();
                        basicForm.findField("code").focus(false, 50);
                    }
                    win.getMasterGrid().getStore().load();
                },
                failure: function (record, operation) {
                    basicForm.markInvalid(operation.request.scope.reader.jsonData.errors);
                },
                callback: function () {
                    form.el.unmask();
                }
            });
        }
    },
    
    onUpdateRecord: function (editor, e) {
        if (e.record.hasChanges()) {
            e.record.save({
                success: function (record, operation) {
                    if (!App.ux.util.Response.isValidStatus(operation.response)) {
                        record.set(e.record.raw);
                    }
                    e.grid.getView().refresh();
                },
                failure: function () {
                    e.record.reject();
                }
            });
        }
    },
    
    onChangeFilter: function (grid, value) {
        if (value) {
            grid.getStore().setFilter("query", {
                "$like": value
            });
        } else {
            grid.getStore().removeFilter("query");
        }
        grid.getStore().loadPage(1);
    },
    
    onShowImportWindow : function(grid) {
        var win = App.ux.window.Manager.create('DirectoryMaterialsImportEditorWindow');
        win.setMasterGrid(grid);
        win.show();
    },
    
    onImportFormSubmit :  function(win) {
        var form = win.down('form'),
            basicForm = form.getForm(),
            me = this;
        
        if (basicForm.isValid()) {
            form.el.mask('Загрузка файла ...');
            basicForm.submit({
                url : Settings.urls.getUrl('directories.materials.upload_import_file'),
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
            url : Settings.urls.getUrl('directories.materials.excel_import'),
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
    }
    
});