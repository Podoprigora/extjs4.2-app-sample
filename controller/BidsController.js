Ext.define('App.controller.BidsController', {
    extend : 'Ext.app.Controller',
    
    models : [  
        'bids.UpdateLogModel',
        'bids.BidCommentModel',
        'bids.BidAgreementRouteModel',
        'bids.BidModel'
    ],
    
    stores : [
        'bids.TypesLocalStore',
        'bids.UpdatesLogStore',
        'bids.BidCommentsStore',
        'bids.BidAgreementRouteLocalStore',
        'bids.BidsStore'    
    ],
    
    views : [
        'bids.location.PreviewPanel',
        'bids.location.ChoiceWindow',
    
        'bids.PdfPreviewWindow',    
    
        'bids.updates_log.GridPanel',
        'bids.updates_log.Window',
        
        'bids.comments.RejectCommentEditorWindow',
        'bids.comments.GridPanel',
        'bids.comments.ContentPanel',
    
        'bids.AdvancedFiltersWindow',
        'bids.AgreementRouteGridPanel',
        'bids.EditorFormPanel',
        'bids.PreviewFormPanel',
        'bids.GridPanel',
        'bids.BorderPanel',
        'bids.ContentPanel'    
    ],
    
    init : function() {
        
        var me = this;
        
        this.control({
            'BidsContentPanel' : {
                menubtnclick : this.onCreateModuleTab,
                panelready : this.onInitContentPanel,
                afterrender : this.onRunTaskUpdatePendingCounter
            },
            'BidEditorFormPanel' : {
                savebtnclick : this.onSubmitForm,
                cancelbtnclick : this.onCloseEditorTab,
                updateslogbtnclick : this.onShowUpdatesLogWindow,
                choicelocationbtnclick : this.onShowLocationChoiceWindow
            },
            'BidPreviewFormPanel' : {
                makepdfbtnclick : this.onMakePdf,
                acceptbtnclick : function(form){
                    var record = form.getRecord(),
                        grid = form.up('BidsContentPanel').down('BidsGridPanel');
                    this.onAccept(grid, [record.get('id')]);
                },
                rejectbtnclick : function(form){
                    var record = form.getRecord(),
                        grid = form.up('BidsContentPanel').down('BidsGridPanel');
                    this.onRejectConfirm(grid, [record.get('id')]);  
                },
                editbtnclick : this.onEdit,
                deletebtnclick : function(prForm){
                    var grid = prForm.up('BidsContentPanel').down('BidsGridPanel');
                    App.ux.controller.BaseMethods.onDelete(grid, function(){
                        me.updatePendingCounter();   
                    });
                },
                updateslogbtnclick : this.onShowUpdatesLogWindow
            },
            'BidsGridPanel' : {
                afterrender : this.onLoadRecords,
                createbtnclick : this.onCreateEditorTab,
                selectionchange : {
                    fn : this.onGridItemsSelectionChange,
                    delay : 50
                },
                togglefiltertype : this.onToggleGridFilterType,
                showadvancedfilterparams : this.onShowAdvancedFiltersWindow,
                exportbtnclick : this.onExportBtnClick,
                deletebtnclick : function(grid){
                    App.ux.controller.BaseMethods.onDelete(grid, function(){
                        me.updatePendingCounter();   
                    });
                },
                editbtnclick : function(grid){
                    this.onEdit(grid.up('BidsContentPanel').down('BidPreviewFormPanel'));
                },
                acceptbtnclick : function(grid){
                    this.onAccept(grid, App.ux.util.Format.convertRecordsToIdsArray(grid.getSelectionModel().getSelection()));
                },
                rejectbtnclick : function(grid){
                    this.onRejectConfirm(grid, App.ux.util.Format.convertRecordsToIdsArray(grid.getSelectionModel().getSelection()));  
                }
            },
            'BidRejectCommentEditorWindow' : {
                rejectbtnclick : this.onReject
            },
            'BidCommentsContentPanel' : {
                sendbtnclick : this.onSaveMessage
            },
            'BidCommentsGridPanel' : {
                deletebtnclick : Ext.bind(App.ux.controller.BaseMethods.onDelete, this)
            },
            'BidLocationChoiceWindow' : {
                acceptbtnclick : this.onChangeShopLocation
            }
        });
        
    },
    
    onRunTaskUpdatePendingCounter : function(panel) {        
        Ext.TaskManager.start({
            scope : this,
            run : this.updatePendingCounter,
            interval : 60000
        });   
    },
    
    updatePendingCounter : function() {
        var workspacePanel = Ext.getCmp('WorkspaceContentPanel'),
            bidsMenuBtn = workspacePanel.down('#btnBids');
        
        if (bidsMenuBtn.isVisible() == false) {
            return false;
        }
            
        Ext.Ajax.request({
            url : Settings.urls.getUrl('bids.get_pending_counter'),
            success : function(response) {
                if (App.ux.util.Response.isValidStatus(response)) {
                    var response = Ext.decode(response.responseText);
                    if (Ext.isEmpty(response) == false && response.count > 0) {
                        bidsMenuBtn.setText(Ext.String.format("Заявки <span class='number'>{0}</span>", response.count));
                        document.title = Ext.String.format("iposm ** {0} - {1}", response.count, (response.count == 1) ? "ожидающая завка" : "ожидающих завки");
                        return 0;
                    }
                } 
                bidsMenuBtn.setText('Заявки');
            }
        });
    },
    
    onInitContentPanel : function(panel) {
        panel.down('uxTabPanel').addTab('BidsBorderPanel', 'Обзор заявок', 'icon-files', false);
    },
    
    onCreateModuleTab : function(panel, moduleXType, title, iconCls) {
        var tabPanel = panel.down('uxTabPanel');
        tabPanel.addTab(moduleXType, title, iconCls);
    },
    
    onLoadRecords : function(grid) {
        grid.onRefresh();
    },
    
    onShowAdvancedFiltersWindow : function(grid){
        var win = App.ux.window.Manager.create('BidsAdvancedFiltersWindow');
        win.setHeight(Ext.getBody().getHeight(true)-50);
        win.setOwnerGrid(grid);
        win.show();
        return win;
    },
    
    onToggleGridFilterType : function(grid, type) {
        if (type == 'advanced') {
            this.onShowAdvancedFiltersWindow(grid);
            grid.down('#standartFilters').down('uxFilterField').setRawValue(null);
            grid.down('#standartFilters').down('button[filterVal=null]').toggle(true);
        } else if (type == 'standart') {
            var win = Ext.WindowManager.get('BidsAdvancedFiltersWindow');
            if (win) {
                win.destroy();
            }
        }
        
        grid.getStore().clearFilter(true);
        grid.getStore().load();
    },
    
    onExportBtnClick : function(grid, type) {
        var filters = Ext.encode(grid.getStore().getFilters()),
            sorters = Ext.encode(grid.getStore().getSorters());
        window.open(Settings.urls.getUrl(Ext.String.format('bids.export.{0}', type)) + "?filters=" + filters + "&sorters=" + sorters);    
    },
    
    onMakePdf : function(form){
        var record = form.getForm().getRecord();
            win = Ext.create('App.view.bids.PdfPreviewWindow'),
            tabs = new Array();
            
        tabs.push({
            title : 'Требование на выполнение работ',
            iconCls : 'icon-document-pdf',
            layout : 'fit',
            items : [
                {
                    xtype : "component",
                    autoEl : {
                        tag : "iframe",
                        frameborder: '0',
                        src : Ext.String.format("{0}//{1}/{2}?doc={3}&id={4}", window.location.protocol, window.location.host, Settings.urls.getUrl('bids.make_pdf'), 'requirement', record.get('id'))
                    }
                }
            ]
        });
        
        var tasksRecords = record.getTasks(),
            requiredAccountingCulc = false;
        
        if(Ext.isEmpty(tasksRecords.findRecord('require_accounting_culc', 1)) == false) {
            tabs.push({
                title : 'Акт сдачи-приемки',
                iconCls : 'icon-document-pdf',
                layout : 'fit',
                items : [
                    {
                        xtype : "component",
                        autoEl : {
                            tag : "iframe",
                            frameborder: '0',
                            src : Ext.String.format("{0}//{1}/{2}?doc={3}&id={4}", window.location.protocol, window.location.host, Settings.urls.getUrl('bids.make_pdf'), 'act', record.get('id'))
                        }
                    }
                ]
            });    
        }
        
        if (tabs.length > 0) {
            
            App.ux.Msg.wait('Формирование документов ...');
            
            win.add({
                xtype : 'tabpanel',
                tabPosition : 'top',
                items : tabs
            });
            
            win.setTitle("Заявка № " + record.get('id'));
            win.setWidth(Ext.getBody().getWidth() >= 1000 ? 1000 : Ext.getBody().getWidth() - 20);
            win.setHeight(Ext.getBody().getHeight() >= 750 ? 750 : Ext.getBody().getHeight() - 20);
            win.show();
            App.ux.Msg.hide();
        }
    },
    
    onCreateEditorTab : function(grid) {
        var tabPanel = grid.up('tabpanel'),
            existEditortTab = tabPanel.down('BidEditorFormPanel[bidId=null]');
        if (Ext.isEmpty(existEditortTab)) {
            var editorTab = tabPanel.add({
                xtype : 'BidEditorFormPanel',
                title : 'Новая заявка',
                iconCls : 'icon-create-gray'
            });
            tabPanel.setActiveTab(editorTab);
            
            var identityAreaCodes = App.Identity.getRecord().get('area_codes');
            if (identityAreaCodes.length == 1) {
                var currentCode = identityAreaCodes[0].code;
                if (parseInt(currentCode[currentCode.length-1]) > 0) {
                    editorTab.down('hidden[name=area_code_id]').setValue(identityAreaCodes[0].code_id);
                    editorTab.down('AreaCodesListField').setValue(identityAreaCodes[0].code); 
                    
                    editorTab.onInitAreaCodeDependentComponents(identityAreaCodes[0].code); 
                }  
            }
        } else {
            tabPanel.setActiveTab(existEditortTab); 
        }
    },
    
    onCloseEditorTab : function(form) {
        var tabPanel = form.up('tabpanel');
        tabPanel.remove(form);
    },
    
    onSubmitForm : function(form) {
        var basicForm = form.getForm(),
            tasksGrid = form.down('#tasksGrid'),
            materialsGrid = form.down('#materialsGrid'),
            filesGrid = form.down('#filesGrid'),
            record = Ext.create('App.model.bids.BidModel'),
            me = this;
        
        if (basicForm.isValid()) {
            
            var invalidTaskRecord = null;
            
            if (tasksGrid.getStore().getCount() == 0) {
                App.ux.Msg.alert('Необходимо добавить задачи!');
                return false;
            }
            
            tasksGrid.getStore().each(function(item){
                if (item.get('need_equipment')) {                    
                    if(Ext.isEmpty(materialsGrid.getStore().findRecord('task_id', item.get('task_id')))){
                        invalidTaskRecord = item;
                        return false;
                    }   
                }
            });
            
            if (Ext.isEmpty(invalidTaskRecord) == false){
                App.ux.Msg.alert(Ext.String.format("Для задачи <b>{0}</b>, <br /> необходимо выбрать оборудование!", invalidTaskRecord.get('name')));
                return false;
            }
            
            /*Ext.TaskManager.start({
                run : function() {
                    var record = Ext.create('App.model.bids.BidModel');
                    record.set(basicForm.getFieldValues());
            
                    record.setAssociationData('tasks', tasksGrid.getStore().getModifiedData());
                    record.setAssociationData('materials', materialsGrid.getStore().getModifiedData());
                    record.setAssociationData('files', filesGrid.getStore().getModifiedData());
        
                    form.el.mask('Сохранение ...');
                    
                    record.save({
                        success : function(){
                            form.el.unmask();
                            
                            var tabPanel = form.up('BidsContentPanel').down('tabpanel'),
                                grid = tabPanel.down('BidsGridPanel');
                                
                            tabPanel.remove(form);
                            grid.onRefresh();
                            me.updatePendingCounter();
                        },
                        failure : function(record, operation) {
                            basicForm.markInvalid(operation.request.scope.reader.jsonData.errors);
                            form.el.unmask();
                        }
                    });    
                },
                interval : 1000
            });*/
            
            record.set(basicForm.getFieldValues());
            
            record.setAssociationData('tasks', tasksGrid.getStore().getModifiedData());
            record.setAssociationData('materials', materialsGrid.getStore().getModifiedData());
            record.setAssociationData('files', filesGrid.getStore().getModifiedData());

            form.el.mask('Сохранение ...');
            
            record.save({
                success : function(){
                    form.el.unmask();
                    
                    var tabPanel = form.up('BidsContentPanel').down('tabpanel'),
                        grid = tabPanel.down('BidsGridPanel');
                        
                    tabPanel.remove(form);
                    grid.onRefresh();
                    me.updatePendingCounter();
                },
                failure : function(record, operation) {
                    basicForm.markInvalid(operation.request.scope.reader.jsonData.errors);
                    form.el.unmask();
                }
            });
        }
    },
    
    onGridItemsSelectionChange : function(sm, records){
        var grid = sm.view.ownerCt,
            previewPanel = grid.up('BidsContentPanel').down('#previewPanel'),
            previewForm = previewPanel.down('BidPreviewFormPanel'),
            commentsPanel= previewPanel.down('BidCommentsContentPanel'),
            commentsGrid = previewPanel.down('BidCommentsGridPanel'),
            changeLogGrid = previewPanel.down('BidUpdatesLogGridPanel');
        
        this.showLocationOnMap(grid, records);
            
        if (records.length == 1) {
            var record = records[0],
                reportTab = null;
            
            if (Ext.isEmpty(reportTab = previewPanel.down('BidPerformanceReportPreviewPanel')) == false) {
                previewPanel.remove(reportTab);
            }
            
            previewPanel.setDisabled(false);
            previewForm.setDisabled(false);
            commentsPanel.setDisabled(false);
            changeLogGrid.setDisabled(false);
            
            commentsGrid.getStore().addFilter('bid_id', record.get('id'));
            changeLogGrid.getStore().addFilter('bid_id', record.get('id'));
            
            previewForm.el.mask('Загрузка ...');
            
            App.model.bids.BidModel.load(record.get('id'), {
                success : function(record, options) {
                    previewForm.el.unmask();
                    
                    var accessRightsStore = record.getAccessRights();
                    
                    previewForm.setTitle("Заявка № " + record.get('id'));
                    previewForm.getDockedItems()[0].setVisible(accessRightsStore.getCount());
                    if (accessRightsStore.getCount()) {
                        
                        var userAgreeRouteRecord = record.getAgreementRoute().findRecord('user_id', App.Identity.get('id'));
      
                        previewForm.down('#btnAccept').setDisabled(record.get('completed') == 1);
                        previewForm.down('#btnReject').setDisabled((record.get('completed') == 2 && Ext.isEmpty(userAgreeRouteRecord) == false && userAgreeRouteRecord.get('state') == 2));
                        previewForm.down('#btnEdit').setDisabled(record.get('completed') == 1);
                        previewForm.down('#btnDelete').setDisabled((record.get('completed') == 1 || (record.get('user_id') != App.Identity.get('id'))));
                    }
                    
                    previewForm.loadRecord(record);
                    previewForm.down('#agreementRouteGrid').getStore().loadRecords(record.getAgreementRoute().getRange());
                    previewForm.down('#tasksGrid').getStore().loadRecords(record.getTasks().getRange());
                    previewForm.down('#materialsGrid').getStore().loadRecords(record.getMaterials().getRange());
                    previewForm.down('#filesGrid').getStore().loadRecords(record.getFiles().getRange());
                    
                    if((accessRightsStore.getCount() && accessRightsStore.findRecord('right_name', 'add_performance_report').get('is_allowed')) || record.get('completed') == 1) {

                        reportTab = previewPanel.add({
                            xtype : 'BidPerformanceReportPreviewPanel',
                            id : 'BidPerformanceReportPreviewPanel',
                            title : 'Отчет о выполнении',
                            bidId : record.get('id'),
                            bidRecord : record
                        });
                        
                        if (record.get('completed') == 1) {
                            reportTab.getLayout().setActiveItem(1);
                            reportTab.setDisabled(true);
                            reportTab.setIconCls('icon-checkmark ');
                            
                            reportTab.getLayout().getActiveItem().getDockedItems()[0].setVisible((accessRightsStore.getCount() > 0 && accessRightsStore.findRecord('right_name', 'add_performance_report').get('is_allowed')) || App.Identity.getRecord().hasPermit('bids', 'allow'));
                            
                            App.model.bids.PerformanceReportModel.load(null,{
                                params : {bid_id : record.get('id')},
                                success : function(reportRecord, options){
                                    var tasksGrid = reportTab.down('#tasksGrid'),
                                        imagesPanel = reportTab.down('#imagesPanel');
                                        
                                    reportTab.setDisabled(false);
                                    reportTab.down('#previewForm').loadRecord(reportRecord);
                                    tasksGrid.loadRecords(reportRecord.getTasks().getRange());
                                    imagesPanel.getStore().loadRecords(reportRecord.getImages().getRange());
                                },
                                failure : function() {
                                    reportTab.setDisabled(false);     
                                }
                            });
                        } else {
                            reportTab.getLayout().setActiveItem(0);   
                        }
                    }

                },
                callback : function() {
                    previewForm.setDisabled(false);
                }
            });
        
        } else if (records.length > 1) {
            previewForm.setDisabled(true);
            commentsPanel.setDisabled(true);
            changeLogGrid.setDisabled(true);
        } else {
            if (previewPanel.isDisabled() == false) {
                previewForm.setDisabled(false);
                commentsPanel.setDisabled(false);
                changeLogGrid.setDisabled(false);
                
                previewPanel.setActiveTab(0);
                previewPanel.setDisabled(true);
                
                previewForm.setTitle('Заявка');
                previewForm.getForm().reset();
                previewForm.down('#agreementRouteGrid').getStore().loadData([],false);
                previewForm.down('#tasksGrid').getStore().loadData([],false);
                previewForm.down('#materialsGrid').getStore().loadData([],false);
                previewForm.down('#filesGrid').getStore().loadData([],false);
            }
        }       
    },
    
    showLocationOnMap : function(grid, selectedRecords) {
        var previewPanel = grid.up('BidsBorderPanel').down('BidLocationPreviewPanel'),
            objects = new Array();
        
        
        previewPanel.removeAll();

        Ext.Array.forEach(selectedRecords, function(record){
            if (Ext.isEmpty(record.get('shop_geo')) == false) {
                var object = new Array(),
                    geo = record.get('shop_geo');

                object.push(geo.replace(",",";"));
                object.push(record.get('shop_name'));
                object.push(record.get('shop_address'));
                objects.push(Ext.String.format("[{0}]", object.join(";")));
            }   
        
        });
        
        if (objects.length) {            
            previewPanel.add({
                xtype : "component",
                autoEl : {
                    tag : "iframe",
                    frameborder: '0',
                    src : Ext.String.format("{0}?objects={1}", Settings.urls.bids.get_locations, objects.join("")) 
                }
            });    
        } else {
            previewPanel.add({
                xtype : "panel",
                bodyCls : 'x-container-body',
                border : false,
                html : "<p class='x-panel-note'>Невозможно отобразить карту, <br />для выбранных точек не указано местоположение.</p>"
            });     
        }
    },
    
    onShowLocationChoiceWindow : function(form) {
        var win = Ext.create('App.view.bids.location.ChoiceWindow');
        
        win.setOwnerForm(form);
        win.setUserId(App.Identity.get('id'));
        
        var coords = form.getForm().findField('shop_geo').getValue();
        if (coords) {
            win.setCoords(coords.replace(",",";"));    
        }
        
        win.show();
    },
    
    onChangeShopLocation : function(win){
        var ownerForm = win.getOwnerForm(),
            coordsField = ownerForm.getForm().findField('shop_geo');
        
        
        Ext.Ajax.request({
            url : Settings.urls.getUrl('bids.get_new_shop_location_tmp'),
            success : function(response){
                response = Ext.decode(response.responseText);
                coordsField.setValue(response.records.coords);
                win.close();
            }
        });
    },
    
    onEdit : function(prForm) {
        var tabPanel = prForm.up('BidsContentPanel').down('tabpanel'),
            record = prForm.getRecord(),
            existTab = tabPanel.down(Ext.String.format("BidEditorFormPanel[bidId={0}]", record.get('id'))),
            accessRightsStore = record.getAccessRights(),
            accessDeny = (accessRightsStore.getCount() == 0);

        if (Ext.isEmpty(existTab)) {
            var editorTab = tabPanel.add({
                xtype : 'BidEditorFormPanel',
                title : Ext.String.format("№{0} - {1}, {2}, {3}", record.get('id'), record.get('shop_code'), record.get('area_code'), record.get('shop_name')),
                iconCls : 'icon-edit',
                bidId : record.get('id'),
                disabled : true,
                
                readOnly : (accessDeny || accessRightsStore.findRecord('right_name', 'edit_fields').get('is_allowed') == 0),
                readOnlyContract : (accessDeny || accessRightsStore.findRecord('right_name', 'edit_finances').get('is_allowed') == 0),
                readOnlyTasks : (accessDeny || accessRightsStore.findRecord('right_name', 'edit_tasks').get('is_allowed') == 0),
                readOnlyMaterials : (accessDeny || accessRightsStore.findRecord('right_name', 'edit_materials').get('is_allowed') == 0)
            });
            
            editorTab.down('#btnSave').setDisabled(accessDeny);
            editorTab.down('#btnHistory').setVisible(true);
            
            Ext.defer(function(){
                editorTab.onInitAreaCodeDependentComponents(record.get('area_code'));
                
                editorTab.loadRecord(record);
                editorTab.down('#tasksGrid').getStore().loadRecords(record.getTasks().getRange());
                editorTab.down('#materialsGrid').getStore().loadRecords(record.getMaterials().getRange());
                editorTab.down('#filesGrid').getStore().loadRecords(record.getFiles().getRange());
                
                editorTab.setDisabled(false);
                tabPanel.setActiveTab(editorTab);
            }, 50);
            
        } else {
            tabPanel.setActiveTab(existTab);    
        }
    },
    
    onAccept : function(grid, ids) {
        var me = this;
        App.ux.Msg.confirm("Вы действительно хотите <span style='color:#69b113;font-weight:bold;'>подтвердить</span> заявку(-и)?", function(btn){
            if (btn == 'yes') {
                App.ux.Msg.wait("Выполняется подтверждение ...");
                Ext.Ajax.request({
                    url : Settings.urls.getUrl('bids.accept'),
                    params : {records : Ext.encode(ids)},
                    success : function(response, operation){
                        if (App.ux.util.Response.isValidStatus(response)) {
                            App.ux.Msg.hide();
                        }
                        var response = Ext.decode(response.responseText);
                        if (Ext.isEmpty(response.do_action) == false && Ext.isEmpty(response.bid_id) == false && response.do_action == 'add_report'){
                            App.ux.Msg.notification("Для закрытия заявки необходимо заполнить отчет о выполнении!");
                            me.onCreateReportEditorTab(grid, response.bid_id);
                        } else {
                            grid.onRefresh();
                            me.updatePendingCounter(); 
                        }
                    }
                });   
            }
        });
    },
    
    onRejectConfirm : function(grid, ids) {
        var win = App.ux.window.Manager.create('BidRejectCommentEditorWindow');

        win.setBidIds(ids);
        win.setMasterGrid(grid);
        
        win.show();
    },
    
    onReject : function(win){
        var form = win.down('form'),
            grid = win.getMasterGrid(),
            ids = win.getBidIds(),
            tabPanel = grid.up('BidsContentPanel').down('tabpanel'),
            me = this;
        
        if (form.getForm().isValid()) {
            var comment = form.getForm().findField('comment').getValue();
            win.hide();
            App.ux.Msg.wait("Выполняется отклонение ...");
            
            for (var i in ids){
                var openReportTab = tabPanel.down(Ext.String.format("BidPerformanceReportEditorFormPanel[bidId={0}]", ids[i]));
                if (Ext.isEmpty(openReportTab) == false) {
                    tabPanel.remove(openReportTab);
                }
            }
            
            Ext.Ajax.request({
                url : Settings.urls.getUrl('bids.reject'),
                params : {records : Ext.encode(ids), comment : comment},
                success : function(response, operation){
                    if (App.ux.util.Response.isValidStatus(response)) {
                        App.ux.Msg.hide();
                    }
                },
                callback : function(){
                    grid.onRefresh(); 
                    me.updatePendingCounter();
                }
            });
        }
    },
    
    onCreateReportEditorTab : function(grid, bidId) {
        var tabPanel = grid.up('BidsContentPanel').down('tabpanel'),
            existTab = tabPanel.down(Ext.String.format("BidPerformanceReportEditorFormPanel[bidId={0}]", bidId));
        
        if (Ext.isEmpty(existTab)) {
            var newTab = tabPanel.add({
                xtype : 'BidPerformanceReportEditorFormPanel',
                title : Ext.String.format('№ {0} - Отчет о выполнении', bidId),
                iconCls : 'icon-create-gray',
                bidId : bidId,
                disabled : true
            });
            
            App.model.bids.PerformanceReportModel.load(null,{
                params : {bid_id : bidId},
                success : function(record, options){
                    var tasksGrid = newTab.down('#tasksGrid'),
                        performerField = newTab.down('UsersListField');
                    
                    tasksGrid.down('uxTreeGridPicker').getStore().addFilter('area_code', record.get('area_code'));
                    tasksGrid.loadRecords(record.getTasks().getRange());
                    
                    performerField.getStore().addFilter('area_code', record.get('area_code'));
                    
                    if (App.Identity.getRecord().isPerformer()) {
                        performerField.setValue(App.Identity.getRecord().get('fio_full'));
                        newTab.getForm().findField('user_id').setValue(App.Identity.getRecord().get('id'));
                    }
                    
                    newTab.setDisabled(false);
                    tabPanel.setActiveTab(newTab);
                    
                },
                failure : function() {
                    tabPanel.remove(newTab);   
                }
            });
        } else {
            tabPanel.setActiveTab(existTab);   
        }
    },
    
    onSaveMessage : function(panel) {
        var form = panel.down('form'),
            grid = panel.down('grid'),
            filter = grid.getStore().getFilterByKey('bid_id'),
            record = Ext.create('App.model.bids.BidCommentModel');

        if (form.getForm().isValid() && Ext.isEmpty(filter) == false) {
            record.set('bid_id', filter.value);
            record.set('message', form.getForm().findField('message').getValue());
            
            form.setDisabled(true);
            record.save({
                success : function(){
                    grid.onRefresh();
                    form.getForm().reset();
                },
                callback : function() {
                    form.setDisabled(false);    
                }
            });
        }
    },
    
    onShowUpdatesLogWindow : function(form) {
        var win = App.ux.window.Manager.create('BidUpdatesLogWindow');
        win.show();
        win.down('grid').getStore().addFilter('bid_id', form.getRecord().get('id'));
    }
    
});