Ext.define('App.controller.plan.PlanogramsController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'plan.PlanogramEquipmentModel',
        'plan.PlanogramGoodsModel',
        'plan.PlanogramModel'
    ],
    
    stores : [
        'plan.PlanogramGoodsLocalStore',
        'plan.PlanogramsStore'
    ],
    
    views : [
        'plan.planograms.ListField',
        'plan.planograms.EquipmentChoiceWindow',
        'plan.planograms.GoodsChoiceWindow',
        'plan.planograms.EquipmentEditorViewPanel',
        'plan.planograms.EditorFormPanel',
        'plan.planograms.GridPanel'
    ],
    
    init : function() {

        this.control({
            'PlanogramsGridPanel' : {
                afterrender : this.onLoadRecords,
                createbtnclick : this.onCreateNewPlanogramTab,
                editbtnclick : this.onCreateEditorPlanogramTab,
                itemdblclick : function(view) {
                    this.onCreateEditorPlanogramTab(view.ownerCt);
                },
                deletebtnclick : Ext.bind(App.ux.controller.BaseMethods.onDelete, this)
            },
            'PlanogramEditorFormPanel' : {
                //selectequipment : this.onCreareGoodsSkeletonGrid,
                savebtnclick : this.onSavePlanogramBtnClick,
                cancelbtnclick : this.onClosePlanogramTab,
                addequipmentbtnclick : this.onShowEquipmentChoiceWindow
            }, 
            'PlanogramEquipmentEditorViewPanel' : {
                additembtnclick : this.onAddGoodsItemBtnClick,
                deleteitembtnclick : this.onDeleteGoodsItemBtnClick,
                addgoodsbtnclick : this.onAddGoodsBtnClick,
                deletebtnclick : this.onDeleteEquipmentTab,
                copybtnclick : this.onCopyEquipmentTab
            },
            'PlanogramGoodsChoiceWindow' : {
                addbtnclick : this.onSaveGoods
            },
            'PlanogramEquipmentChoiceWindow' : {
                addbtnclick : this.onAddEquipmentTab
            }
        });
        
    },
    
    onShowEquipmentChoiceWindow : function(form) {
        var win = App.ux.window.Manager.create('PlanogramEquipmentChoiceWindow');
        win.setOwnerPanel(form);
        win.show();
        
        win.down('field[name=equipment_name]').focus(false, 50);
        
        return win;    
    },
    
    onAddEquipmentTab : function(win) {
        var form = win.down('form'),
            ownerPanel = win.getOwnerPanel(),
            equpmentsTabPanel = ownerPanel.down('#equipmentsTabPanel');
        
        if (form.getForm().isValid()) {
            equpmentsTabPanel.show();
            
            var tabs = equpmentsTabPanel.items.items,
                equipmentRecord = win.getEquipmentRecord(),
                startPusher = form.getForm().findField('start_pusher').getValue(),
                invalidPusher = false,
                tabPosition = 0;
            
            Ext.Array.forEach(tabs, function(tab, index){
                var pEquipmentRecord = tab.getEquipmentRecord(); 
                if (startPusher+1 >= pEquipmentRecord.get('start_pusher') && startPusher <= pEquipmentRecord.get('end_pusher')) {
                    invalidPusher = true;
                    return false;
                }
                
                if (startPusher > pEquipmentRecord.get('start_pusher')) {
                    tabPosition = index+1;    
                }
                
            }, this);
            
            if (invalidPusher) {
                form.getForm().findField('start_pusher').markInvalid('Значение некорректно!');
                return false;
            }
            
            var newTab = equpmentsTabPanel.insert(tabPosition, {
                    xtype: "PlanogramEquipmentEditorViewPanel"
                }),
                endPusher = this.creareGoodsView(newTab, equipmentRecord.getData(), startPusher);
  
            equpmentsTabPanel.setActiveTab(newTab);
            
            newTab.setTitle(Ext.String.format("{0} ({1}-{2})", equipmentRecord.get('name'), startPusher, endPusher));
            
            newTab.getEquipmentRecord().set('equipment_id', equipmentRecord.get('id'));
            newTab.getEquipmentRecord().set('equipment', equipmentRecord.getData());
            newTab.getEquipmentRecord().set('start_pusher', startPusher);
            newTab.getEquipmentRecord().set('end_pusher', endPusher);
            
            win.hide();    
        }
    },
    
    onCopyEquipmentTab : function(copyTab) {
        var equpmentsTabPanel = copyTab.up('#equipmentsTabPanel'); 
            tabs = equpmentsTabPanel.items.items,
            pEquipmentRecord = copyTab.getEquipmentRecord(),
            startIndex = pEquipmentRecord.get('equipment').start_index,
            startPusher = pEquipmentRecord.get('end_pusher')+1,
            endPusher = startPusher+(pEquipmentRecord.get('end_pusher')-pEquipmentRecord.get('start_pusher'))
            invalidPusher = false,
            tabPosition = 0;
            
        Ext.Array.forEach(tabs, function(tab, index){
            var equipmentRecord = tab.getEquipmentRecord();
 
            if (startPusher >= equipmentRecord.get('start_pusher')) {
                tabPosition = index+1;    
            }
            
            if (startPusher == equipmentRecord.get('start_pusher')) {
                startPusher = equipmentRecord.get('end_pusher')+equipmentRecord.get('equipment').start_index;
                endPusher = startPusher+(equipmentRecord.get('end_pusher')-equipmentRecord.get('start_pusher'))
            }

        }, this);
        
        var newTab = equpmentsTabPanel.insert(tabPosition, {
            xtype: "PlanogramEquipmentEditorViewPanel"
        });
        
        this.creareGoodsView(newTab, pEquipmentRecord.get('equipment'), startPusher, copyTab.getStore().getRange());
        
        equpmentsTabPanel.setActiveTab(newTab);
        
        newTab.setTitle(Ext.String.format("{0} ({1}-{2})", pEquipmentRecord.get('equipment').name, startPusher, endPusher));
        
        newTab.getEquipmentRecord().set('equipment_id', pEquipmentRecord.get('equipment').id);
        newTab.getEquipmentRecord().set('equipment', pEquipmentRecord.get('equipment'));
        newTab.getEquipmentRecord().set('start_pusher', startPusher);
        newTab.getEquipmentRecord().set('end_pusher', endPusher);
    },
    
    onDeleteEquipmentTab : function(grid) {
        App.ux.Msg.confirm("Вы действительно хотите удалить оборудование?", function(btn){
            if (btn == 'yes') {
                grid.destroy();
            }
        }, this);
    },

    creareGoodsView : function(goodsGrid, equipment, startPusher, copyRecords) {
        var columnsLength =  equipment.hor_qty,
            rowsLength = equipment.ver_qty,
            startIndex = equipment.start_index,
            startPusher = startPusher || startIndex,
            adIndexes = equipment.ad_indexes,
            
            index = startIndex,
            pusher = startPusher,
            adIndexesArr = (adIndexes.length) ? adIndexes.split(",") : new Array(),
            records = [],
            copyRecords = copyRecords || [],
            copyLen = copyRecords.length; 
        
        if (copyLen) {
            for (var i=0; i<copyLen; i++) {
                
                var record = Ext.create('App.model.plan.PlanogramGoodsModel');
                
                record.set(copyRecords[i].getData());
                record.set('pusher', (adIndexesArr.indexOf(String(index)) > -1) ? -1 : pusher ++);
                record.set('index', index);
                index ++; 
                
                record.setDirty();
                records.push(record);
            }
        } else {
            for (var i=0; i<rowsLength; i++) {
                for (var j=0; j<columnsLength; j++) {
                    
                    var record = Ext.create('App.model.plan.PlanogramGoodsModel');
                    
                    record.set('pusher', (adIndexesArr.indexOf(String(index)) > -1) ? -1 : pusher ++);
                    record.set('index', index);
                    index ++; 
    
                    record.setDirty();
                    records.push(record);
                }
            }
        }
        
        goodsGrid.reconfigure(records, columnsLength, startIndex);
        
        return pusher-((startIndex) ? startIndex : 1);
    },
    
    onLoadRecords : function(grid) {
        grid.getStore().load();
        
        /*Ext.defer(function(){
            this.onCreateNewPlanogramTab(grid);   
        }, 500, this);*/
        
    },
    
    onCreateNewPlanogramTab : function(grid) {
        var planTabPanel = grid.up('PlanContentPanel').down('tabpanel'),
            form = planTabPanel.down('#newPlanogramForm');
            
        if (Ext.isEmpty(form)) {
            form = planTabPanel.add({
                xtype : 'PlanogramEditorFormPanel',
                itemId : 'newPlanogramForm',
                title : 'Новая выкладка',
                iconCls : 'icon-create-gray',
                closable : true
            });
        }   
        planTabPanel.setActiveTab(form);
        form.getForm().findField('name').focus(false, 50);
    },
    
    onCreateEditorPlanogramTab : function(grid, record) {
        var planTabPanel = grid.up('PlanContentPanel').down('tabpanel'),
            record = record || grid.getSelectionModel().getSelection()[0],
            form = planTabPanel.down(Ext.String.format('panel[planogramId={0}]', record.get('id')));
        
        if (Ext.isEmpty(form) == false) {
            planTabPanel.setActiveTab(form); 
            return;   
        }
        
        form = planTabPanel.add({
            xtype : 'PlanogramEditorFormPanel',
            title : Ext.util.Format.ellipsis(record.get('name'), 25),
            planogramId : record.get('id'),
            iconCls : 'icon-edit',
            tooltip : record.get('name')
        });
        
        planTabPanel.setActiveTab(form); 
        form.el.mask('Загрузка ...');
       
        this.getModel('plan.PlanogramModel').load(record.get('id'), {
            success : function(record, operation) {
                form.el.unmask();
                form.getForm().loadRecord(record);
                
                var equipmentsStore = record.getEquipments(),
                    equpmentsTabPanel = form.down('#equipmentsTabPanel');
                
                equpmentsTabPanel.setVisible(true);
                
                equipmentsStore.each(function(equipmentRecord){
                    var equipmentTab = equpmentsTabPanel.add({
                        xtype: "PlanogramEquipmentEditorViewPanel"
                    });
                    equipmentTab.setTitle(Ext.String.format("{0} ({1}-{2})", equipmentRecord.get('equipment').name, equipmentRecord.get('start_pusher'), equipmentRecord.get('end_pusher')));
                    
                    equipmentTab.getEquipmentRecord().set('equipment_id', equipmentRecord.get('equipment_id'));
                    equipmentTab.getEquipmentRecord().set('equipment', Ext.create('App.model.plan.EquipmentModel', equipmentRecord.get('equipment')).getData());
                    equipmentTab.getEquipmentRecord().set('start_pusher', equipmentRecord.get('start_pusher'));
                    equipmentTab.getEquipmentRecord().set('end_pusher', equipmentRecord.get('end_pusher'));
                    
                    equipmentTab.reconfigure(equipmentRecord.getGoods().getRange(), equipmentRecord.get('equipment').hor_qty, equipmentRecord.get('equipment').start_index);
                    
                }, this);
                
                equpmentsTabPanel.setActiveTab(0); 
                
            },
            failure : function(){
                planTabPanel.remove(form);   
            }
        });
    },
    
    onClosePlanogramTab : function(form) {
        var planTabPanel = form.up('PlanContentPanel').down('tabpanel');
        planTabPanel.remove(form);
    },
    
    onSavePlanogramBtnClick : function(form, mode) {
        var record = Ext.create('App.model.plan.PlanogramModel'),
            basicForm = form.getForm(),
            equipmentsTabs = form.down('#equipmentsTabPanel').items.items;
        
        if (equipmentsTabs.length == 0) {
            App.ux.Msg.alert("Необходимо добавить оборудование!");
            return false;
        }
            
        if (basicForm.isValid()) {
            record.set(basicForm.getFieldValues());
            
            var equipmentsData = [];
            
            Ext.Array.forEach(equipmentsTabs, function(tab){
                
                var equipmentRecord = tab.getEquipmentRecord();
                equipmentRecord.setAssociationData('goods', tab.getStore().getRawData());
                
                equipmentsData.push(equipmentRecord.getData());
            });
            
            record.setAssociationData('equipments', equipmentsData);
            
            form.el.mask('Сохранение ...');
            record.save({
                success : function(record, operaion) {
                    var planTabPanel = form.up('PlanContentPanel').down('tabpanel'),
                        planogramsGrid = planTabPanel.down('PlanogramsGridPanel');
                    
                    planTabPanel.remove(form);
                    planogramsGrid.onRefresh();
                    if (Ext.isEmpty(mode)) {
                        me.onCreateNewPlanogramTab(planogramsGrid);   
                    }
                },
                failure : function(record, operation) {
                    form.el.unmask();
                    basicForm.markInvalid(operation.request.scope.reader.jsonData['errors']);
                }
            });
        }
    },
    
    showGoodsChoiceWindow : function(panel) {
        var win = App.ux.window.Manager.create('PlanogramGoodsChoiceWindow');
        win.setMasterGrid(panel);
        win.show();
        win.setY(panel.getPosition()[1]-win.getHeight()+50);
        
        return win;
    },
    
    onAddGoodsItemBtnClick : function(panel, record, item) {
        var win = this.showGoodsChoiceWindow(panel);
        
        var form = win.down('form'),
            basicForm = form.getForm();
        
        basicForm.loadRecord(record);

        basicForm.findField('pusher').setReadOnly(true);
        basicForm.findField('goods_name').focus(false, 50);
    },
    
    onDeleteGoodsItemBtnClick : function(panel, record, item) {
        record.set('goods_id', 0);
        record.set('goods_name', '');
        record.set('goods_image', '');
    },
    
    onAddGoodsBtnClick : function(panel) {
        var win = this.showGoodsChoiceWindow(panel),
            form = win.down('form'),
            basicForm = form.getForm(),
            equipmentRecord = panel.getEquipmentRecord();
            
        basicForm.findField('pusher').setValue(equipmentRecord.get('start_pusher'));
        basicForm.findField('goods_name').focus(false, 50);
    },
    
    onSaveGoods : function(win) {
        var basicForm = win.down('form').getForm(),
            viewPanel = win.getMasterGrid(),
            equipmentRecord = viewPanel.getEquipmentRecord(),
            startIndex = equipmentRecord.get('equipment').start_index;
        
        if (basicForm.isValid()) {
            
            var record = basicForm.getRecord(); 
            
            if (Ext.isEmpty(record) == false) {

                record.set(basicForm.getFieldValues());
                basicForm._record = null;
                win.hide();
                
                win.getMasterGrid().getView().refresh();
                win.getMasterGrid().getView().focus(false, 200);
            } else {
                var formValues = basicForm.getFieldValues(),
                    viewRecord = viewPanel.getStore().findRecord('pusher', formValues.pusher);

                if (Ext.isEmpty(viewRecord)) {
                    basicForm.findField('pusher').markInvalid('Значение некорректно!');
                    return false;
                }

                var selected = viewPanel.selectCell(viewRecord.get('index'), startIndex);
                if (selected) {
                    selected.set(formValues);

                    var nextPusher = formValues.pusher+1,
                        nextViewRecord  = viewPanel.getStore().findRecord('pusher', nextPusher);
                    if (Ext.isEmpty(nextViewRecord) == false && viewPanel.selectCell(nextViewRecord.get('index'), startIndex)) {
                        basicForm.findField('pusher').setValue(nextPusher);    
                    } else {
                        win.hide();
                    }
                }
            }
        }
    }
    
});