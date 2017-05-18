Ext.define('App.controller.bids.SalesChannelsController', {
    extend : 'Ext.app.Controller',
    
    models: [
        "bids.directories.SalesChannelModel"
    ],
    stores: [
        "bids.directories.SalesChannelsStore"
    ],
    views: [
        "bids.directories.sales_channels.GridPanel", 
        "bids.directories.sales_channels.EditorWindow"
    ],
    
    init: function () {
        this.control({
            'BidsDirectorySalesChannelsGridPanel' : {
                edit: this.onUpdateRecord,
                createbtnclick: this.onCreateBtnClick,
                deletebtnclick: Ext.bind(App.ux.controller.BaseMethods.onDelete, this)
            },
            'BidsDirectorySalesChannelEditorWindow' : {
                savebtnclick: this.onSubmitForm
            }
        });
    },
    
    onCreateBtnClick: function (grid) {
        var win = App.ux.window.Manager.create("BidsDirectorySalesChannelEditorWindow");
        win.setMasterGrid(grid);
        win.show();
    },
    
    onSubmitForm: function (win, mode) {
        var form = win.down("form"),
            basicForm = form.getForm(),
            model = Ext.create("App.model.bids.directories.SalesChannelModel");
            
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
    }
    
});