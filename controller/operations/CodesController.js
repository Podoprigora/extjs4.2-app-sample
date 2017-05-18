Ext.define('App.controller.operations.CodesController', {
    extend : 'Ext.app.Controller',
    
    models: [
        "operations.directories.CodeModel"
    ],
    stores: [
        "operations.directories.CodesStore"
    ],
    views: [
        "operations.directories.codes.ListField", 
        "operations.directories.codes.GridPanel", 
        "operations.directories.codes.EditorWindow"
    ],
    
    init: function () {
        this.control({
            DirectoryCodesGridPanel: {
                edit: this.onUpdateRecord,
                createbtnclick: this.onCreateBtnClick,
                deletebtnclick: Ext.bind(App.ux.controller.BaseMethods.onDelete, this),
                changefilter: this.onChangeFilter
            },
            DirectoryCodeEditorWindow: {
                savebtnclick: this.onSubmitForm
            }
        });
    },
    
    onCreateBtnClick: function (grid) {
        var win = App.ux.window.Manager.create("DirectoryCodeEditorWindow");
        win.setMasterGrid(grid);
        win.show();
    },
    
    onSubmitForm: function (win, mode) {
        var form = win.down("form"),
            basicForm = form.getForm(),
            model = Ext.create("App.model.operations.directories.CodeModel");
        if (basicForm.isValid()) {
            model.set(basicForm.getFieldValues());
            form.el.mask("Сохранение ...");
            model.save({
                success: function (record, operation) {
                    if (Ext.isEmpty(mode) == false && mode == "close") {
                        win.hide()
                    } else {
                        basicForm.reset();
                        basicForm.findField("code").focus(false, 50)
                    }
                    win.getMasterGrid().getStore().load();
                },
                failure: function (record, operation) {
                    basicForm.markInvalid(operation.request.scope.reader.jsonData.errors);
                },
                callback: function () {
                    form.el.unmask()
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
                failure: function (record, operation) {
                    record.reject();
                }
            })
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