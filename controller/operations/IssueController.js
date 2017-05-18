Ext.define('App.controller.operations.IssueController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'operations.AvailableMaterialModel'
    ],
    
    stores : [
        'operations.AvailableMaterialsStore'
    ],
    
    views : [
        'operations.materials.AvailableListField',
        'operations.materials.IssueEditorGridPanel',
        'operations.profile.IssueContentPanel'
    ],
    
    init : function() {
        
        this.control({
            'OperationIssueMaterialsEditorGridPanel' : {
                selectmaterialfromdirectory : this.onSelectMaterialFromDirectory,
                endedit : this.onEndEditMaterialItem,
                edit : this.onEditMaterialItem,
                deleteitem : Ext.bind(this.getController('OperationsController').onDeleteMaterialItem, this)
            },
            'OperationIssueProfileContentPanel' : {
                savebtnclick : this.onSaveBtnClick,
                cancelbtnclick : Ext.bind(this.getController('OperationsController').onCancelBtnClick, this),
                deletebtnclick : Ext.bind(this.getController('OperationsController').onDeleteBtnClick, this),
                changeslogsbtnclick : Ext.bind(this.getController('OperationsController').onChangesLogsBtnClick, this) 
            }   
        });
        
    },
    
    onSaveBtnClick : function(panel) {
        var materialsGrid = panel.down('grid'),
            isMaterialsValid = true,
            me = this;
        
        if (materialsGrid.getStore().getCount() == 0) {
            App.ux.Msg.alert("Выберите пожалуйста материалы!");   
            return;
        }
        
        materialsGrid.getStore().each(function(item){
            if (item.get('available_qty') != 0 && item.get('qty') > item.get('available_qty')) {
                
                if (Ext.isEmpty(item.get('batch')) && ! Ext.isEmpty(item.get('return_code_id'))) {
                    var batchRecord = materialsGrid.getBatchesStore().getById(item.get('return_code_id')),
                        batch = batchRecord.get('code');
                } else {
                    batch = item.get('batch');
                }
                    
                App.ux.Msg.alert(Ext.String.format(
                    "Некорректное количество, на складе доступно <b>{3}</b> единиц!<br /> <b>{0}</b>, код <b>{1}</b>, партия <b>{2}</b>!", 
                    item.get('name'), item.get('code'), batch, item.get('available_qty')));
                    
                isMaterialsValid = false;
                return;
            }
        });
        
        if (isMaterialsValid) {
            this.getController('OperationsController').onSaveBtnClick(panel);    
        }    
        
    },
    
    onSelectMaterialFromDirectory : function(grid, field, record) {

        var existRecord = null;
        grid.getStore().each(function(item){
            if (item.get('code_id') == record.get('code_id') && item.get('material_id') == record.get('material_id')) {
                existRecord = item;
                return;
            }
        });
        
        if (Ext.isEmpty(existRecord)) {
            var newRecord = Ext.create('App.model.operations.MaterialModel', {
                material_id : record.get('material_id'),
                batch : record.get('batch'),
                code_id : record.get('code_id'),
                code : record.get('code'),
                name : record.get('name'),
                price : record.get('price'),
                qty : 1,
                available_qty : record.get('available_qty')
            });

            newRecord.setDirty();
            grid.getStore().add(newRecord);
            grid.getPlugin('cellEditing').startEdit(newRecord, 2);   
        } else {
            grid.getPlugin('cellEditing').startEdit(existRecord, 2);    
        }
    },
    
    onEndEditMaterialItem : function(grid) {
        var materialsField = grid.down("AvailableMaterialsListField");
        materialsField.expand();
        materialsField.focus(false, 200);
    },
    
    onEditMaterialItem : function(editor, e) {
        e.grid.getView().refresh();
        if (e.field == 'qty' && e.record.get('available_qty') == 0) {
            Ext.Ajax.request({
                url : Settings.urls.getUrl('operations.materials.available_qty'),
                params : {
                    id : e.record.get('id'),
                    material_id : e.record.get('material_id'),
                    code_id : e.record.get('code_id'),
                    warehouse_id : e.grid.getWarehouseId() 
                },
                success : function(response) {
                    if (App.ux.util.Response.isValidStatus(response)) {
                        var response = Ext.decode(response.responseText, true);
                        if (Ext.isEmpty(response.available_qty) == false) {
                            e.record.set('available_qty', response.available_qty);    
                        }
                    }
                }
            });    
        }
    }
    
});