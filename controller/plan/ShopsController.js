Ext.define('App.controller.plan.ShopsController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'plan.ShopReportModel',
        'plan.ShopPlanogramModel',
        'plan.ShopModel'
    ],
    
    stores : [
        'plan.ShopEquipmentReportPeriodsLocalStore',
        'plan.ShopEquipmentTypesLocalStore',
        'plan.ShopEquipmentModeLocalStore',
        'plan.ShopReportsLocalStore',
        'plan.ShopPlanogramsLocalStore',
        'plan.ShopsStore'
    ],
    
    views : [
        'plan.shops.report.EditorWindow',
        'plan.shops.report.GridPanel',
        'plan.shops.ListField',
        'plan.shops.PlanogramEditorWindow',
        'plan.shops.PlanogramsEditorGridPanel',
        'plan.shops.EditorFormPanel',
        'plan.shops.GridPanel'
    ],
    
    init : function() {
        
        //Счетчик запросов активации
        this.requestActivationWaitCounter = 0;
        
        this.control({
            'PlanShopsGridPanel' : {
                //afterrender : this.onLoadRecords,
                createbtnclick : this.onCreateNewShopTab,
                editbtnclick : this.onCreateEditorShopTab,
                itemdblclick : function(view) {
                    this.onCreateEditorShopTab(view.ownerCt);
                },
                deletebtnclick : Ext.bind(App.ux.controller.BaseMethods.onDelete, this),
                cellclick : this.onShopsGridCellClick
            },
            'ShopPlanogramsEditorGridPanel' : {
                addbtnclick : this.onShowPlanogramEditorWindow,
                deleteitembtnclick : this.onDeletePlanogramItem,
                cellclick : this.onShopsGridCellClick
            },
            'PlanShopReportGridPanel' : {
                addbtnclick : this.onShowReportEditorWindow,
                edititembtnclick : this.onShowReportEditorWindow,
                deleteitembtnclick : this.onDeleteReportItem
            },
            'PlanShopReportEditorWindow' : {
                addbtnclick : this.onAddReportItem
            },
            'ShopPlanogramEditorWindow' : {
                addbtnclick : this.onAddPlanogramItem
            },
            'ShopEditorFormPanel' : {
                savebtnclick : this.onSaveShop,
                activationbtnclick : this.onSendActivationSms,
                requestreportbtnclick : this.onRequestReport,
                requestrebootbtnclick : this.onRequestReboot,
                cancelbtnclick : this.onCloseShopTab
            }
        });
    },
    
    onLoadRecords : function(grid) {
        grid.getStore().load();
    },
    
    onCreateNewShopTab : function(grid) {
        var planTabPanel = grid.up('PlanContentPanel').down('tabpanel'),
            form = planTabPanel.down('#newShopForm');
            
        if (Ext.isEmpty(form)) {
            form = planTabPanel.animateAdd({
                xtype : 'ShopEditorFormPanel',
                itemId : 'newShopForm',
                title : 'Новая торговая точка',
                iconCls : 'icon-create-gray',
                closable : true
            }, function(form){      
                form.getForm().loadRecord(Ext.create('App.model.plan.ShopModel'));
                form.down('#chSendActivationSms').setVisible(true).setValue(true);
            });
        } else {
            planTabPanel.setActiveTab(form);   
        }    
    },
    
    onCreateEditorShopTab : function(grid, record) {
        var planTabPanel = grid.up('PlanContentPanel').down('tabpanel'),
            record = record || grid.getSelectionModel().getSelection()[0],
            form = planTabPanel.down(Ext.String.format("panel[shopId={0}][readOnly=false]", record.get('id'))),
            me = this;
        
        if (Ext.isEmpty(form) == false) {
            planTabPanel.setActiveTab(form);
            return false;
        }
        
        planTabPanel.animateAdd({
            xtype : 'ShopEditorFormPanel',
            shopId : record.get('id'),
            title : Ext.String.format("{0}, {1}", record.get('phone'), record.get('name')),
            iconCls : 'icon-edit',
            tooltip : 'Редактирование торговой точки',
            closable : true    
        }, function(form){
            form.down('#btnManageEquipment').setVisible(true);
            form.el.mask('Загрузка ...');
            
            me.getModel('plan.ShopModel').load(record.get('id'), {
                success : function(record, operation) {
                    form.el.unmask();
                    
                    form.getForm().loadRecord(record);
                    form.down('#planogramsGrid').getStore().loadRecords(record.getPlanograms().getRange());
                    form.down('#reportsGrid').getStore().loadRecords(record.getReports().getRange());
                    form.down('#imagesPanel').getStore().loadRecords(record.getImages().getRange());
                },
                failure : function() {
                    planTabPanel.remove(form);  
                }
            }); 
        });
    }, 
    
    onCloseShopTab : function(form) {
        var planTabPanel = form.up('PlanContentPanel').down('tabpanel');
        planTabPanel.remove(form);
    },
    
    onShopsGridCellClick : function(grid, td, cellIndex, record, tr, rowIndex, e) {
        if (e.target.nodeName == 'A' && grid.getGridColumns()[cellIndex].dataIndex == 'planogram_name') {
            var planogramRecord = Ext.create('App.model.plan.PlanogramModel', {
                id : record.get('planogram_id'),
                name : record.get('planogram_name')
            });
            this.getController('plan.PlanogramsController').onCreateEditorPlanogramTab(grid, planogramRecord);
        }
    },
    
    onSaveShop : function(form, mode, callback) {
        var basicForm = form.getForm(),
            planogramsGrid = form.down('#planogramsGrid'),
            reportsGrid = form.down('#reportsGrid'),
            imagesGrid = form.down('#imagesPanel'),
            me = this;
        
        if (basicForm.isValid()) {
            
            if (planogramsGrid.getStore().getCount() == 0) {
                App.ux.Msg.alert('Добавьте планограмму!');
                return false;
            }
            
            var record = Ext.create('App.model.plan.ShopModel');
            record.set(basicForm.getFieldValues());
            record.setAssociationData('planograms', planogramsGrid.getStore().getModifiedData());
            record.setAssociationData('reports', reportsGrid.getStore().getModifiedData());
            record.setAssociationData('images', imagesGrid.getStore().getModifiedData());
            
            form.el.mask('Сохранение ...');
            
            record.save({
                success : function(record, operation){
                    form.el.unmask();
                    
                    var response = Ext.decode(operation.response.responseText);
                    if (Ext.isEmpty(response.message) == false){
                        App.ux.Msg.alert(response.message);
                    }
                    
                    if (record.get('send_activation_sms') === true) {
                        me.requestActivation(form, record, mode);
                    } else {
                        me.successSaveShopCompleted(form, mode, callback);   
                    }
                },
                failure : function(record, operation) {
                    form.el.unmask();
                    basicForm.markInvalid(operation.request.scope.reader.jsonData['errors']);
                }
            });
            
        }
    },
    
    onSendActivationSms : function(form) {
        var me = this,
            basicForm = form.getForm();
        App.ux.Msg.confirm("Вы действительно хотите выполнить активацию устройства?", function(btn){
            if (btn == 'yes') {
                form.down('#chSendActivationSms').setValue(true);
                me.onSaveShop(form, 'close');
            }
        });
    },
    
    successSaveShopCompleted : function(form, mode, callback) {
        var planTabPanel = form.up('PlanContentPanel').down('tabpanel'),
            shopsGrid = planTabPanel.down('PlanShopsGridPanel');
        
        shopsGrid.onRefresh();
            
        if (Ext.isEmpty(mode) == false) {
            planTabPanel.remove(form); 
            if (mode == 'create') {
                this.onCreateNewShopTab(shopsGrid); 
            }  
        }
        
        if (Ext.isEmpty(callback) == false && Ext.isFunction(callback)) {
            callback(form);
        }
    },
    
    failureShopActivation : function(form, record){
        var grid = form.up('PlanContentPanel').down('PlanShopsGridPanel'); 
        
        grid.onRefresh();
        this.onCloseShopTab(form);
        this.onCreateEditorShopTab(grid, record);
    },
    
    requestActivation : function(form, record, mode) {
        
        var me = this;
 
        App.ux.Msg.wait('Активация устройства ...');

        Ext.Ajax.request({
            url : Settings.urls.getUrl('plan.shops.request_activation'),
            params : {id : record.get('id')},
            success : function(response) {
                var response = Ext.decode(response.responseText, true);
                
                if (Ext.isEmpty(response)) {
                    App.ux.Msg.alert("Устройство не активировано!");
                    me.failureShopActivation(form, record);
                    return false;
                }
                
                if (response.success == true) {
                    me.requestActivationStatus(form, record, mode);
                } else {
                    if (Ext.isEmpty(response.message) == false) {
                        App.ux.Msg.alert(response.message);
                        me.failureShopActivation(form, record);
                    }
                }
            }
        });
    },
    
    requestActivationStatus : function(form, record, mode) {
        
        var me = this;
        
        me.requestActivationWaitCounter ++;
        App.ux.Msg.wait('Ожидание ответа устройства ... <br />(Примерное время выполнения 1 - 4 минуты)');
        
        Ext.defer(function(){
            
            Ext.Ajax.request({
                url : Settings.urls.getUrl('plan.shops.check_activation_status'),
                params : {id : record.get('id')},
                success : function(response) {
                    var response = Ext.decode(response.responseText, true);
                    
                    if (Ext.isEmpty(response) || me.requestActivationWaitCounter > 4) {
                        App.ux.Msg.alert("Время ожидания ответа от устройства истекло! </br> Повторите попытку позже!");
                        me.requestActivationWaitCounter = 0;
                        me.failureShopActivation(form, record);
                        return false;
                    }
                    
                    if (Ext.isEmpty(response.message) == false && response.message == 'wait' && me.requestActivationWaitCounter < 5) {
                        me.requestActivationStatus(form, record, mode);
                    } else {
                        App.ux.Msg.hide();
                        me.requestActivationWaitCounter = 0;
                        me.successSaveShopCompleted(form, mode);
                        App.ux.Msg.notification('Устройство успешно активировано!');
                    }
                }
            });
            
        }, 60000, this);
    },
    
    onRequestReport : function(form) {

        var me = this;
        
        App.ux.Msg.confirm("Вы действительно хотите получить внеочередно отчет?", function(btn){
            if (btn == 'yes') {
                me.onSaveShop(form, null, function(form){
                    var record = form.getForm().getRecord();
                    
                    App.ux.Msg.wait('Выполнение запроса ...');

                    Ext.Ajax.request({
                        url : Settings.urls.getUrl('plan.shops.request_report'),
                        params : {id : record.get('id')},
                        success : function(response) {
                             App.ux.Msg.notification('Запрос успешно отправлен! <br /> Данные отчета поступят в течении 10-15 минут.');
                        },
                        callback : function() {
                            App.ux.Msg.hide();
                        }
                    });
                });
            }
        });
    },
    
    onRequestReboot : function(form, type){
        var confirmMsg = Ext.String.format("Вы действительно хотите выполнить <b>{0}</b> оборудования?", ((type == 1) ? "перезагрузку" : "сброс и перезагрузку"));
            me = this;
        App.ux.Msg.confirm(confirmMsg, function(btn){
            if (btn == 'yes'){
                me.onSaveShop(form, null, function(form){
                    var record = form.getForm().getRecord();
                    
                    App.ux.Msg.wait('Выполнение запроса ...');

                    Ext.Ajax.request({
                        url : Settings.urls.getUrl('plan.shops.request_reboot'),
                        params : {id : record.get('id'), type : type},
                        success : function(response) {
                             App.ux.Msg.notification(Ext.String.format("Запрос на <b>{0}</b> успешно отправлен!", ((type == 1) ? "перезагрузку" : "сброс и перезагрузку")));
                        },
                        callback : function() {
                            App.ux.Msg.hide();
                        }
                    });
                });  
            
            }
        });
        
    },
    
    onShowPlanogramEditorWindow : function(grid) {
        var win = App.ux.window.Manager.create('ShopPlanogramEditorWindow');
        win.show();
        win.setMasterGrid(grid);
        
        var basicForm = win.down('form').getForm();
        basicForm.findField('planogram_name').focus(false, 50);
    },
    
    onAddPlanogramItem : function(win) {
        var form = win.down('form'),
            basicForm = form.getForm(),
            editorGrid = win.getMasterGrid(),
            record = Ext.create('App.model.plan.ShopPlanogramModel');
            
        if (basicForm.isValid()) {
            record.set(basicForm.getFieldValues());
            
            if (record.get('planogram_id') == 0) {
                basicForm.findField('planogram_name').markInvalid('Значение некорректно!');
                return false;
            }
            
            var isValidItem = true;
            
            editorGrid.getStore().each(function(item, index){
                if (item.get('planogram_id') == record.get('planogram_id')) {
                    basicForm.findField('planogram_name').markInvalid('Планограмма уже добавлена!');
                    isValidItem = false;
                    return false;
                } else if (record.get('start_date') <= item.get('start_date')) {
                    basicForm.findField('start_date').markInvalid('Значение некорректно!');
                    isValidItem = false;
                    return false;   
                } else if (Ext.isEmpty(item.get('end_date'))) {
                    item.set('end_date', record.get('start_date'));   
                }
            });
            
            if (isValidItem) {
                editorGrid.getStore().add(record);
                win.hide();    
            }
        }
    },
    
    onDeletePlanogramItem : function(grid, record) {
        App.ux.Msg.confirm('Вы действительно хотите выполнить удаление?', function(btn){
            if (btn == 'yes') {
                record.set('removed', 1);
                grid.getStore().remove(record);
            }
        });
    },
    
    onShowReportEditorWindow : function(grid, record) {
        var record = record || null,
            win = App.ux.window.Manager.create('PlanShopReportEditorWindow'),
            form = win.down('form');
            
        if (record) {
            win.setTitle('Редактировать отчет');
            form.getForm().loadRecord(record);
            form.down('#imagesPanel').getStore().add(record.get('images'));
            form.down('#btnAccept').setText('Изменить');
            form.down('#btnAccept').setIconCls('icon-edit');
        } else {
            win.setTitle('Добавить отчет');
            form.down('#btnAccept').setText('Добавить');
            form.down('#btnAccept').setIconCls('icon-create');
        }
        
        win.setMasterGrid(grid);
        win.show();
    },
    
    onAddReportItem : function(win) {
        var form = win.down('form'),
            imagesPanel = win.down('#imagesPanel'),
            editorGrid = win.getMasterGrid();
        
        if (form.getForm().isValid()) {
            
            var record = form.getForm().getRecord();
            if (record) {
                record.set(form.getForm().getFieldValues());
                record.set('images', imagesPanel.getStore().getRawData());        
            } else {
                record = Ext.create('App.model.plan.ShopReportModel');
                
                record.set(form.getForm().getFieldValues());
                record.set('images', imagesPanel.getStore().getRawData());
                record.set('user_id', App.Identity.get('id'));
                record.set('user', [App.Identity.get('last_name'), App.Identity.get('first_name'), App.Identity.get('patronumic')].join(" "));
                
                editorGrid.getStore().add(record);
            }
            
            editorGrid.getView().refresh();
            win.hide();
        }
    },
    
    onDeleteReportItem : function(grid, record) {
        App.ux.Msg.confirm('Вы действительно хотите выполнить удаление?', function(btn){
            if (btn == 'yes') {
                record.set('removed', 1);
                grid.getStore().remove(record);
            }
        });
    }
    
});