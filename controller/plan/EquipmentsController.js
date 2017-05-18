Ext.define('App.controller.plan.EquipmentsController', {
    extend : 'Ext.app.Controller',
    
    models: [
        "plan.EquipmentModel"
    ],
    
    stores: [
        "plan.EquipmentsStore"
    ],
    
    views: [
        "plan.equipments.EditorWindow", 
        "plan.equipments.GridPanel", 
        "plan.equipments.ListField"
    ],
    
    init: function () {
        this.control({
            PlanEquipmentsGridPanel: {
                //afterrender : this.onLoadRecords,
                createbtnclick: this.onShowEditorWindow,
                editbtnclick : this.onLoadItem,
                itemdblclick : function(view){
                    this.onLoadItem(view.ownerCt);
                },
                deletebtnclick: Ext.bind(App.ux.controller.BaseMethods.onDelete, this)
            },
            PlanEquipmentEditorWindow: {
                savebtnclick: this.onSubmitForm
            }
        })
    },
    
    onLoadRecords : function(grid) {
        grid.getStore().load();
    },
    
    onShowEditorWindow: function (grid) {
        var win = App.ux.window.Manager.create("PlanEquipmentEditorWindow");
        win.show();
        win.setTitle('Добавить оборудование');
        win.setMasterGrid(grid);
        return win;
    },
    
    onLoadItem : function(grid) {
        var selRecord = grid.getSelectionModel().getSelection()[0];
        if (Ext.isEmpty(selRecord) == false) {
            
            var win = this.onShowEditorWindow(grid),
                form = win.down('form'),
                basicForm = form.getForm();
                
            win.setTitle('Изменить параметры оборудования');
            form.el.mask('Загрузка ...');
            
            this.getModel('plan.EquipmentModel').load(selRecord.get('id'), {
                success : function(record, operation){
                    form.el.unmask();
                    basicForm.loadRecord(record);
                },
                failure : function() {
                    form.el.unmask();
                    win.hide();
                }
            });
        }
    
    },
    
    onSubmitForm: function (win, mode) {
        var form = win.down("form"),
            basicForm = form.getForm(),
            model = Ext.create("App.model.plan.EquipmentModel");
        if (basicForm.isValid()) {
            model.set(basicForm.getFieldValues());
            form.el.mask("Сохранение ...");
            model.save({
                success: function (record, operation) {
                    if (Ext.isEmpty(mode) == false && mode == "close") {
                        win.hide()
                    } else {
                        basicForm.reset();
                        basicForm.findField("name").focus(false, 50)
                    }
                    win.getMasterGrid().onRefresh();
                },
                failure: function (record, operation) {
                    basicForm.markInvalid(operation.request.scope.reader.jsonData.errors)
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
                        record.set(e.record.raw)
                    }
                    e.grid.getView().refresh()
                },
                failure: function () {
                    e.record.reject()
                }
            })
        }
    }
    
});