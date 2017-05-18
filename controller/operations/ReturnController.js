Ext.define('App.controller.operations.ReturnController', {
    extend : 'Ext.app.Controller',
    
    views: [
        "operations.materials.ReturnEditorGridPanel", 
        "operations.profile.ReturnContentPanel"
    ],
    
    init: function () {
        this.control({
            OperationReturnMaterialsEditorGridPanel: {
                selectmaterialfromdirectory: this.onSelectMaterialFromDirectory,
                endedit: Ext.bind(this.getController("OperationsController").onEndEditMaterialItem, this),
                deleteitem: Ext.bind(this.getController("OperationsController").onDeleteMaterialItem, this)
            },
            OperationReturnProfileContentPanel: {
                savebtnclick: Ext.bind(this.getController("OperationsController").onSaveBtnClick, this),
                cancelbtnclick: Ext.bind(this.getController("OperationsController").onCancelBtnClick, this),
                deletebtnclick: Ext.bind(this.getController("OperationsController").onDeleteBtnClick, this),
                changeslogsbtnclick: Ext.bind(this.getController("OperationsController").onChangesLogsBtnClick, this)
            }
        })
    },
    
    onSelectMaterialFromDirectory: function (grid, field, record) {
        
        var mRecord = Ext.create("App.model.operations.MaterialModel", {
            material_id: record.get("id"),
            code: record.get("code"),
            name: record.get("name"),
            price: 0,
            qty: 1
        });
        
        mRecord.setDirty();
        grid.getStore().add(mRecord);
        grid.getPlugin("cellEditing").startEdit(mRecord, 1);
    }
    
});