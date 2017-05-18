Ext.define('App.controller.bids.PerformanceReportController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'bids.PerformanceReportTaskModel',
        'bids.PerformanceReportModel'
    ],
    
    stores : [
        'bids.PerformanceReportTasksLocalStore'
    ],
    
    views : [
        'bids.performance_report.TasksEditorGridPanel',
        'bids.performance_report.EditorFormPanel',
        'bids.performance_report.PreviewPanel'
    ],
    
    init : function() {
        
        this.control({
            'BidPerformanceReportPreviewPanel' : {
                createbtnclick : this.onCreateEditorTab,
                editbtnclick : this.onEdit,
                deletebtnclick : this.onDelete
            },
            'BidPerformanceReportEditorFormPanel' : {
                savebtnclick : this.onSave,
                cancelbtnclick : this.onCloseEditorTab
            }
        });
        
    },
    
    onSave : function(form){
        var me = this,
            record = Ext.create('App.model.bids.PerformanceReportModel'),
            basicForm = form.getForm(),
            tasksGrid = form.down('#tasksGrid'),
            imagesPanel = form.down('#imagesPanel'),
            completedQty = 0;
            
        tasksGrid.getStore().each(function(item){
            if (item.get('completed') == 1) {
                completedQty++;          
            }
        });
        
        if (completedQty == 0) {
            App.ux.Msg.alert("Необходимо отметить выполненные задачи!");
            return false;
        }
        
        if (basicForm.isValid()) {
            record.set(basicForm.getFieldValues());
            record.set('bid_id', form.getBidId());
            record.setAssociationData('tasks', tasksGrid.getStore().getModifiedData());
            record.setAssociationData('images', imagesPanel.getStore().getModifiedData());
            
            form.el.mask('Сохранение ...');
            
            record.save({
                success : function(){
                    form.el.unmask();
                    
                    var tabPanel = form.up('BidsContentPanel').down('tabpanel'),
                        grid = tabPanel.down('BidsGridPanel');
                        
                    tabPanel.remove(form);
                    grid.onRefresh();
                    me.getController('BidsController').updatePendingCounter();
                },
                failure : function() {
                    form.el.unmask();
                }
            });
        }
    },
    
    onEdit : function(previewPanel){
        var tabPanel = previewPanel.up('BidsContentPanel').down('tabpanel'),
            bidId = previewPanel.getBidId(),
            existTab = tabPanel.down(Ext.String.format("BidPerformanceReportEditorFormPanel[bidId={0}]", bidId));
        
        if (Ext.isEmpty(existTab)) {
            var newTab = tabPanel.add({
                xtype : 'BidPerformanceReportEditorFormPanel',
                title : Ext.String.format('№ {0} - Отчет о выполнении', bidId),
                iconCls : 'icon-edit',
                bidId : bidId,
                disabled : true
            });
            
            App.model.bids.PerformanceReportModel.load(null,{
                params : {bid_id : bidId},
                success : function(record, options){
                    var tasksGrid = newTab.down('#tasksGrid'),
                        imagesPanel = newTab.down('#imagesPanel');
                        
                    tasksGrid.loadRecords(record.getTasks().getRange());
                    imagesPanel.getStore().loadRecords(record.getImages().getRange());
                    newTab.loadRecord(record);
                    
                    newTab.down('UsersListField').getStore().addFilter('area_code', record.get('area_code'));
                    
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
    
    onDelete : function(previewPanel) {
        var me = this;
        
        App.ux.Msg.confirm("Вы действительно хотите удалить отчет?", function(btn){
            if (btn == 'yes') {
                var record = previewPanel.down('#previewForm').getRecord();
                previewPanel.el.mask('Удаление ...');
                record.destroy({
                    success : function(){
                        previewPanel.getLayout().setActiveItem(0);
                        
                        var tabPanel = previewPanel.up('BidsContentPanel').down('tabpanel'),
                            grid = tabPanel.down('BidsGridPanel');
                            
                        grid.onRefresh();
                        me.getController('BidsController').updatePendingCounter();
                    },
                    callback : function() {
                        previewPanel.el.unmask();   
                    }
                });
            } 
        });
    },
    
    onCloseEditorTab : function(panel){
        panel.up('BidsContentPanel').down('tabpanel').remove(panel);
    }
    
});