Ext.define('App.controller.operations.WarehousesController', {
    extend : 'Ext.app.Controller',
    
    models: [
        "operations.directories.WarehouseModel"
    ],
    stores: [
        "operations.directories.WarehousesStore"
    ],
    views: [
        "operations.directories.warehouses.EditorWindow", 
        "operations.directories.warehouses.ListField", 
        "operations.directories.warehouses.GridPanel"
    ],
    
    init: function () {
        this.control({
            DirectoryWarehousesGridPanel: {
                createbtnclick: this.onCreateBtnClick,
                deletebtnclick: Ext.bind(App.ux.controller.BaseMethods.onDelete, this),
                edit: this.onUpdateRecord,
                changefilter : this.onChangeFilter
            },
            DirectoryWarehouseEditorWindow: {
                savebtnclick: this.onSubmitForm
            }
        });
    },
    
    onCreateBtnClick: function (grid) {
        var win = App.ux.window.Manager.create("DirectoryWarehouseEditorWindow");
        win.setMasterGrid(grid);
        win.show();
    },
    
    onSubmitForm: function (win, mode) {
        var form = win.down("form"),
            model = Ext.create("App.model.operations.directories.WarehouseModel");
        if (form.getForm().isValid()) {
            form.el.mask("Сохранение ...");
            model.set(form.getForm().getFieldValues());
            model.save({
                success: function (record, operation) {
                    if (Ext.isEmpty(mode) == false && mode == "close") {
                        win.hide()
                    } else {
                        form.getForm().reset();
                        form.getForm().findField("code").focus(false, 200);
                    }
                    win.getMasterGrid().getStore().load();
                },
                failure: function (record, operation) {
                    form.getForm().markInvalid(operation.request.scope.reader.jsonData.errors);
                },
                callback: function () {
                    form.el.unmask();
                }
            });
        }
    },
    
    onUpdateRecord: function (editor, e) {
        if (e.record.hasChanges() && e.record.isValid()) {
            e.record.save({
                success: function (record, operation) {
                    if (!App.ux.util.Response.isValidStatus(operation.response)) {
                        record.set(e.record.raw);
                    }
                    e.grid.getView().refresh();
                },
                failure: function(operation) {
                    e.record.reject();
                }
            });
        } else {
            e.record.reject();
        }
    },
    
    onChangeFilter: function (grid, value) {
        if (value) {
            grid.getStore().setFilter("code", {
                "$like": value
            });
        } else {
            grid.getStore().removeFilter("code");
        }
        grid.getStore().loadPage(1);
    }
    
});