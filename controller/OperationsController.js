Ext.define('App.controller.OperationsController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'operations.MaterialModel',
        'operations.OperationModel',
        'operations.RemainsReportModel',
        'operations.OperationsReportModel',
        'operations.UpdateLogsModel'
    ],
    
    stores : [ 
        'operations.TypesLocalStore',
        'operations.TypesLocalStore2',
        'operations.MaterialsLocalStore',
        'operations.MaterialsStore',
        'operations.RemainsReportStore',
        'operations.OperationsReportStore',
        'operations.UpdatesLogsStore'
    ],
    
    views : [
        'operations.reports.AggregateReportFiltersWindow',
        'operations.updates_logs.GridPanel',
        'operations.updates_logs.Window',
        'operations.materials.BasicEditorGrid',
        'operations.materials.EditorGridPanel',
        'operations.profile.BasicContentPanel',
        'operations.profile.ContentPanel', 
        'operations.reports.RemainsGridPanel',
        'operations.reports.GridPanel',
        'operations.ContentPanel'    
    ],
    
    init : function() {
        
        this.control({
            'OperationsContentPanel' : {
                panelready : this.onInitContentPanel,
                createneweditor : this.onCreateNewEditorTab,
                selectwarehouse : this.onSwithStorekeeperWarehouse,
                showaggregatereportfilters : this.onShowAggregateReportFiltersWindow
            },
            'OperationAggregateReportFiltersWindow' : {
                makebtnclick : this.onMakeAggregateReport
            },
            'OperationsReportGridPanel' : {
                groupclick : this.onReportGroupClick,
                editbtnclick : this.onReportEditBtnClick,
                changeslogsbtnclick : this.onReportChangesLogsBtnClick,
                setfilter : this.onSetReportFilter,
                exportbtnclick : Ext.bind(this.onExportBtnClick, this, ['motion'], 1)
            },
            'OperationsRemainsReportGridPanel' : {
                setfilter : this.onSetReportFilter,
                exportbtnclick : Ext.bind(this.onExportBtnClick, this, ['remains'], 1)
            },
            'OperationMaterialsEditorGridPanel' : {
                selectmaterialfromdirectory : this.onSelectMaterialFromDirectory,
                endedit : this.onEndEditMaterialItem,
                deleteitem : this.onDeleteMaterialItem
            },
            'OperationProfileContentPanel' : {
                savebtnclick : this.onSaveBtnClick,
                cancelbtnclick : this.onCancelBtnClick,
                deletebtnclick : this.onDeleteBtnClick,
                changeslogsbtnclick : this.onChangesLogsBtnClick
            }
        });
        
    },
    
    onInitContentPanel : function(panel) {
        panel.down('uxTabPanel').addTab('OperationsReportGridPanel', 'Движения материалов', 'icon-files', false);
    },
    
    onShowAggregateReportFiltersWindow : function() {
        var win = App.ux.window.Manager.create('OperationAggregateReportFiltersWindow');
        win.show();
    },
    
    onMakeAggregateReport : function(win) {
        var basicForm = win.down('form').getForm();
        
        if (basicForm.isValid()) {
            window.open(Settings.urls.getUrl('operations.export.aggregate_report') + "?filters=" + Ext.encode(basicForm.getFieldValues()));
        } 
    },
    
    onSwithStorekeeperWarehouse : function(panel, record) {
        Ext.Ajax.request({
            url : Settings.urls.getUrl('identity.set_current_warehouse'),
            params : { warehouse_id : record.get('id') },
            success : function(response) {
                window.location.href = "/";
            }
        });
    },

    onChangesLogsBtnClick : function(panel) {
        var basicForm = panel.down('form').getForm(),
            operationId = basicForm.findField('id').getValue();
        
        if (operationId) {
            var win = App.ux.window.Manager.create('OperationUpdatesLogsWindow');
                win.show();
                
                win.setTitle("История изменений");
                win.down('grid').getStore().addFilter('operation_id', operationId);     
        }  
    },
    
    onReportChangesLogsBtnClick : function(grid) {
        if (Ext.isEmpty(grid.ctxMenu.params) == false) {
            var store = grid.getStore();
            var groupData = store.getGroups(grid.ctxMenu.params.group);
            if (Ext.isEmpty(groupData.children) == false) {
                var record = groupData.children[0];
                var win = App.ux.window.Manager.create('OperationUpdatesLogsWindow');
                win.show();
                
                win.setTitle(Ext.String.format("История изменений: <em>документ</em> №{0}", record.get('code')));
                win.down('grid').getStore().addFilter('operation_id', record.get('operation_id'));
            }    
        }
    },
    
    onReportEditBtnClick : function(grid) {
        if (Ext.isEmpty(grid.ctxMenu.params) == false) {
            var store = grid.getStore();
            var groupData = store.getGroups(grid.ctxMenu.params.group);
            if (Ext.isEmpty(groupData.children) == false) {
                var record = groupData.children[0];
                this.onCreateEditorTab(grid, record);
            }    
        }
    },
    
    onExportBtnClick : function(grid, type) {
        var filters = Ext.encode(grid.getStore().getFilters()),
            sorters = Ext.encode(grid.getStore().getSorters());
        window.open(Settings.urls.getUrl(Ext.String.format('operations.export.{0}', type)) + "?filters=" + filters + "&sorters=" + sorters);    
    },
    
    onReportGroupClick : function(view, node, group, e) {
        if (e.target.nodeName == 'A' || e.target.nodeName == 'EM') {
            var store = view.ownerCt.getStore();
            var groupData = store.getGroups(group);
            if (Ext.isEmpty(groupData.children) == false) {
                var record = groupData.children[0];
                this.onCreateEditorTab(view.ownerCt, record);
            }
        }
    },
    
    onSetReportFilter : function(grid, filter) {
        if (Ext.isEmpty(filter) == false) {
            if (Ext.isArray(filter)) {
                Ext.Array.forEach(filter, function(item){
                    grid.getStore().setFilter(item.property, item.value);
                });
                grid.getStore().loadPage(1);
            } else if(Ext.isObject(filter)) {
                grid.getStore().addFilter(filter.property, filter.value);
            }
        }
    },
    
    onCreateNewEditorTab : function(panel, type) {
        
        var tabPanel = panel.down('tabpanel'),
            isExistTab = false,
            tabTitle = 'Принять материалы',
            iconCls = 'icon-checkmark',
            xtype = 'OperationProfileContentPanel';

        if (type == 'issue') {
            tabTitle = 'Отпустить материалы';
            iconCls = 'icon-reply';
            xtype = 'OperationIssueProfileContentPanel';
        } else if (type == 'return') {
            tabTitle = 'Вернуть материалы';
            iconCls = 'icon-remove';
            xtype = 'OperationReturnProfileContentPanel';
        } else if (type == "issue-transit") {
            tabTitle = 'Выпустить в транзит';
            iconCls = 'icon-truck';
            xtype = 'OperationIssueTransitProfileContentPanel';    
        } else if (type == 'cancel') {
            tabTitle = 'Списать материалы';
            iconCls = 'icon-cancel';
            xtype = 'OperationCancelProfileContentPanel';
        }
        
        tabPanel.setVisible(true);
        
        var existTab = tabPanel.down(Ext.String.format("panel[iconCls={0}][title={1}]", iconCls, tabTitle));
        
        if (existTab) {
            tabPanel.setActiveTab(existTab);
            return false;
        }
        
        var newPanel = tabPanel.add({
            title : tabTitle,
            iconCls : iconCls,
            xtype : xtype,
            closable : true
        });
        tabPanel.setActiveTab(newPanel);
        
        var basicForm = newPanel.down('form').getForm();
        basicForm.findField('type').setValue(type || 'incoming');
        basicForm.findField('date').setValue(new Date());
        basicForm.findField('time').setValue(new Date());
        basicForm.findField('date').focus(false, 200);
    },
    
    onCreateEditorTab : function(grid, record) {
        var selRec = record,
            tabPanel = grid.up('tabpanel'),
            isExistTab = false,
            me = this;

        tabPanel.items.each(function(item, index){
            if (item.operationId == selRec.get('operation_id')) {
                isExistTab = true;
                tabPanel.setActiveTab(item);
                return;
            }
        });
        
        if (! isExistTab) {
            var type = selRec.get('type'),
                title = Ext.String.format("№ {0}", selRec.get('code')),
                iconCls = 'icon-checkmark',
                tooltip = 'Принято',
                xtype = 'OperationProfileContentPanel';
               
            if (type == 'issue') {
                tooltip = "Отпущено";
                iconCls = 'icon-reply';
                xtype = 'OperationIssueProfileContentPanel'; 
            } else if (type == 'return') {
                tooltip = "Возвращено";
                iconCls = 'icon-remove';
                xtype = 'OperationReturnProfileContentPanel';
            } else if (type == "issue-transit") {
                tooltip = 'Выпущено в транзит';
                iconCls = 'icon-truck';
                xtype = 'OperationIssueTransitProfileContentPanel';    
            } else if(type == 'incoming-transit') {
                tooltip = 'Принять из транзита';
                iconCls = 'icon-truck-green';
                xtype = 'OperationAcceptingTransitProfileContentPanel';     
            } else if (type == 'cancel') {
                tooltip = 'Списано';
                iconCls = 'icon-cancel';
                xtype = 'OperationCancelProfileContentPanel';
            }
            
            var newTab = tabPanel.add({
                xtype : xtype,
                closable : true,
                iconCls : iconCls,
                title : title,
                tooltip : tooltip,
                operationId : selRec.get('operation_id'),
                readOnly : (App.Identity.getRecord().hasPermit('operations', 'read') || type == 'incoming-transit')
            });
           
            if (type != 'incoming-transit') {
                if (! App.Identity.getRecord().hasPermit('operations', 'read')) {
                    Ext.Array.forEach(newTab.query("#btnDelete"), function(btn){
                        btn.setVisible(true);
                    }); 
                }
                newTab.down("#btnHistory").setVisible(true);    
            } else {
                Ext.Array.forEach(newTab.query("#btnAccept"), function(btn){
                    btn.setVisible(false);
                });    
            }

            tabPanel.setActiveTab(newTab);
            this.loadRecord(newTab);
        }
    },
    
    onSaveBtnClick : function(panel) {
        var form = panel.down('form'),
            materialsGrid = panel.down('#materialsGrid'),
            filesGrid = panel.down('#filesGrid'),
            contentPanel = panel.up('OperationsContentPanel'),
            tabPanel = contentPanel.down('tabpanel'),
            isMaterialsInvalid = false,
            me = this;
        
        if (materialsGrid.getStore().getCount() == 0) {
            App.ux.Msg.alert("Выберите пожалуйста материалы!");   
            return;
        }
        
        materialsGrid.getStore().each(function(item, index){
            if (isMaterialsInvalid) {
                return false;
            }
            materialsGrid.getStore().each(function(item2, index2){
                if (index != index2 
                    && item.get('material_id') == item2.get('material_id') 
                    && ((parseInt(item.get('code_id')) > 0 && item.get('code_id') == item2.get('code_id')) 
                        || (parseInt(item.get('return_code_id') > 0) && item.get('return_code_id') == item2.get('return_code_id')))) {
                            
                    App.ux.Msg.alert("Добавлены дублирующие позиции <b>" + item.get('name') + "!");   
                    isMaterialsInvalid = true;
                    return false;
                } 
            });
        });
        
        if (isMaterialsInvalid) {
            return false;
        }
            
        if (form.getForm().isValid()) {
            var model = Ext.create('App.model.operations.OperationModel');
            model.set(form.getForm().getFieldValues());
            model.setAssociationData('materials', materialsGrid.getStore().getModifiedData());
            model.setAssociationData('files', filesGrid.getStore().getModifiedData());
            
            var dt1 = model.get('date'),
                dt2 = model.get('time');
            dt1.setHours(dt2.getHours(), dt2.getMinutes());
            
            model.set('date', dt1);
            
            var commentsField = panel.down('textarea[name=comments]');
            if (commentsField) {
                model.set('comments', commentsField.getValue());
            }
            
            var doAfterSaveComplete = function() {
                tabPanel.remove(panel);
                tabPanel.setActiveTab(0);
                
                contentPanel.down("OperationsReportGridPanel").getStore().load();
                
                if (Ext.isEmpty(contentPanel.down("OperationsRemainsReportGridPanel")) == false) {
                    contentPanel.down("OperationsRemainsReportGridPanel").getStore().load();
                }
            };
            
            panel.el.mask('Сохранение ...');
            model.save({
                success : function(record, operation) {
                    panel.el.unmask();
                    
                    var response = operation.request.scope.reader.jsonData;
                    if (Ext.isEmpty(response.do_action) == false && response.do_action == 'confirm') {
                        App.ux.Msg.confirm(response.msg, function(btn){
                            if (btn == 'yes') {
                                form.down('hidden[name=confirm_invalid_remain]').setValue(1);
                                me.onSaveBtnClick(panel);
                            } else {
                                doAfterSaveComplete();      
                            }
                        }, this);
                    } else {
                        doAfterSaveComplete();     
                    }
                },
                failure : function(record, operation) {
                    panel.el.unmask();
                    form.getForm().markInvalid(operation.request.scope.reader.jsonData['errors']); 
                }
            });
        }
    },
    
    loadRecord : function(panel) {
        var id = panel.getOperationId();
        if (id) {
            panel.el.mask('Загрузка ...');
            App.model.operations.OperationModel.load(id, {
                scope : this,
                success : function(record, operation) {
                    panel.el.unmask();
                    
                    panel.down('form').getForm().loadRecord(record);
                    panel.down('form').getForm().findField('date').focus(false, 200);
                    panel.down('form').getForm().findField('time').setValue(record.get('date'));
                    
                    panel.down('#materialsGrid').getStore().loadRecords(record.getMaterials().getRange());
                    panel.down('#filesGrid').getStore().loadRecords(record.getFiles().getRange());
                    
                    var availableMaterialsListField = panel.down('AvailableMaterialsListField');
                    if (availableMaterialsListField) {
                        panel.down('grid').setWarehouseId(record.get('warehouse_id'));
                        availableMaterialsListField.setDisabled(false);
                        availableMaterialsListField.getStore().setFilter("warehouse_id", record.get('warehouse_id'));
                    }
                    
                    var commentsField = panel.down('textarea[name=comments]');
                    if (commentsField) {
                        commentsField.setValue(record.get('comments'));
                    }
                    
                },
                failure : function() {
                    panel.el.unmask();
                    
                    var tabPanel = panel.up('tabpanel');
                    tabPanel.remove(panel);
                }
            });
        }
    },
    
    onCancelBtnClick : function(panel) {
        var tabPanel = panel.up('tabpanel');
        tabPanel.remove(panel);
    },
    
    onDeleteBtnClick : function(panel) {
        var operationId = panel.getOperationId(),
            contentPanel = panel.up('OperationsContentPanel'),
            model = Ext.create('App.model.operations.OperationModel', {id : operationId});
        
        App.ux.Msg.confirm("Вы действительно хотите выполнить удаление?", function(btn){
            if (btn == 'yes') {
                panel.el.mask('Удаление ...');
                
                model.destroy({
                    success : function() {
                        contentPanel.down('tabpanel').remove(panel);
                        contentPanel.down('OperationsReportGridPanel').getStore().load();
                    },
                    failure : function() {
                        panel.el.unmask();
                    }
                });
            } 
        });
    },
    
    onSelectMaterialFromDirectory : function(grid, field, record) {
        var existRecord = null;
        
       var newRecord = Ext.create('App.model.operations.MaterialModel', {
            material_id : record.get('id'),
            code : record.get('code'),
            name : record.get('name'),
            price : record.get('price'),
            qty : 1
        });
        newRecord.setDirty();
        grid.getStore().add(newRecord);
        grid.getPlugin('cellEditing').startEdit(newRecord, 1);
    },
    
    onEndEditMaterialItem : function(grid) {
        var materialsField = grid.down("MaterialsListField");
        materialsField.expand();
        materialsField.focus(false, 200);
    },
    
    onDeleteMaterialItem : function(grid, record) {
        App.ux.Msg.confirm("Вы действительно хатите выполнить удаление?", function(btn){
            if (btn == 'yes') {
                record.set('removed', 1);
                grid.getStore().remove(record);
                grid.getView().refresh();     
            }
        });
    }
    
});