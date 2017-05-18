Ext.define('App.controller.plan.ReportsController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'plan.ReportShopModel',
        'plan.ReportLackOfGoodsModel',
        'plan.ReportGoodsTotalsModel'
    ],
    
    stores : [
        'plan.ReportShopsStore',
        'plan.ReportLackOfGoodsStore',
        'plan.ReportGoodsTotalsStore'
    ],
    
    views : [
        'plan.reports.GridFilterDateMenu',
        'plan.reports.ShopGoodsViewPanel',
        'plan.reports.ShopFormPanel',
        'plan.reports.ShopsGridPanel',
        'plan.reports.LackOfGoodsGridPanel',
        'plan.reports.GoodsTotalsViewPanel'
    ],
    
    init : function() {
        
        this.control({
            'PlanReportLackOfGoodsGridPanel' : {
                afterrender : this.onAfterRenderLackOfGoodsReportGrid,
                groupclick : this.onLackOfGoodsReportGroupClick,
                exportbtnclick : Ext.bind(this.onExportBtnClick, this, ['goods'], 1)
            },
            'PlanReportShopsGridPanel' : {
                afterrender : this.onAfterRenderShopsReportGrid,
                viewbtnclick : this.onCreateShopViewTab,
                itemdblclick : function(view) {
                    this.onCreateShopViewTab(view.ownerCt);
                },
                exportbtnclick : Ext.bind(this.onExportBtnClick, this, ['shops'], 1)
            },
            'PlanReportGoodsViewPanel' : {
                afterrender : this.onAfterRenderGoodsTotalsReportPanel
            },
            'PlanReportShopFormPanel' : {
                selectreportdate : this.onChangeShopReportDate,
                reloadbtnclick : this.onReloadShopReport,
                showshopbtnclick : this.onCreateShopPropertiesViewTab  
            }
        });
        
    },
    
    onAfterRenderLackOfGoodsReportGrid : function(grid){
        //grid.getStore().load();
        
        Ext.defer(function(){
            grid.down('#btnFilter').toggle(true);
            grid.down('#frmFilters').setVisible(true);   
        }, 50);
    },
    
    onAfterRenderShopsReportGrid : function(grid) {
        Ext.defer(function(){
            grid.down('#btnFilter').toggle(true);
            grid.down('#frmFilters').setVisible(true);   
        }, 50);
    },
    
    onAfterRenderGoodsTotalsReportPanel : function(panel) {
       // panel.getStore().load();
        
        Ext.defer(function(){
            panel.down('#btnFilter').toggle(true);
            panel.down('#frmFilters').setVisible(true);   
        }, 50);    
    },
    
    loadShopReport : function(form, id, date, startPusher) {
        var equpmentsTabPanel = form.down('#equipmentsTabPanel'),
            startPusher = startPusher || 0;
        
        form.el.mask('Загрузка ...');
        
        equpmentsTabPanel.removeAll();
        
        this.getModel('plan.ReportShopModel').load(0, {
            params : {
                id : id,
                date : date
            },
            success : function(record, operation) {                
                form.getForm().loadRecord(record);
                
                var equipmentsStore = record.getEquipments(),
                    activeTabIndex = 0;
                
                equpmentsTabPanel.setVisible(true);
                
                equipmentsStore.each(function(equipmentRecord, index){
                    
                    var equipmentTab = equpmentsTabPanel.add({
                        xtype: "PlanReportShopGoodsViewPanel"
                    });
                    
                    if (equipmentRecord.get('lack_totals') > 0) {
                        equipmentTab.setTitle(Ext.String.format("{0} ({1}-{2}) <em class='x-tab-count-red'>{3}</em>", 
                            equipmentRecord.get('equipment').name, equipmentRecord.get('start_pusher'), equipmentRecord.get('end_pusher'), equipmentRecord.get('lack_totals')));
                    } else {
                        equipmentTab.setTitle(Ext.String.format("{0} ({1}-{2})", 
                            equipmentRecord.get('equipment').name, equipmentRecord.get('start_pusher'), equipmentRecord.get('end_pusher')));   
                    }
                    
                    equipmentTab.getEquipmentRecord().set('equipment_id', equipmentRecord.get('equipment_id'));
                    equipmentTab.getEquipmentRecord().set('equipment', Ext.create('App.model.plan.EquipmentModel', equipmentRecord.get('equipment')).getData());
                    equipmentTab.getEquipmentRecord().set('start_pusher', equipmentRecord.get('start_pusher'));
                    equipmentTab.getEquipmentRecord().set('end_pusher', equipmentRecord.get('end_pusher'));
                    
                    equipmentTab.reconfigure(equipmentRecord.getGoods().getRange(), equipmentRecord.get('equipment').hor_qty, equipmentRecord.get('equipment').start_index);
                    
                    if (equipmentRecord.get('start_pusher') == startPusher) {
                        activeTabIndex = index;    
                    }
                    
                }, this);
                
                equpmentsTabPanel.setActiveTab(activeTabIndex); 
            },
            callback : function() {
                form.el.unmask();   
            }
        });
        
    },
    
    onCreateShopViewTab : function(grid, record) {
        var tabPanel = grid.up('tabpanel'),
            record = record || grid.getSelectionModel().getSelection()[0],
            form = tabPanel.down(Ext.String.format("panel[reportShopId={0}][reportDate={1}]", record.get('shop_id'), record.get('date')));
        
        if (Ext.isEmpty(record.get('date'))) {
            App.ux.Msg.alert("Для фильтра <b>Cуммарно за период</b>, недоступен обзор торговой точки!");
            return false;
        }
            
        if (Ext.isEmpty(form) == false) {
            tabPanel.setActiveTab(form);
            return false;
        }
        
        var form = tabPanel.add({
            xtype : 'PlanReportShopFormPanel',
            title : Ext.String.format("{0}, {1}, {2}", record.get('phone'), record.get('shop_name'), Ext.util.Format.date(record.get('date'), "d.m.Y")),
            iconCls : 'icon-view',
            tooltip : 'Обзор торговой точки',
            reportShopId : record.get('shop_id'),
            reportDate : record.get('date')
        });
        
        form.down('#dateFilterField').setValue(record.get('date'));
        
        tabPanel.setActiveTab(form);
        this.loadShopReport(form, record.get('shop_id'), record.get('date'), record.get('equipment_start_pusher'));
    },
    
    onCreateShopPropertiesViewTab : function(form) {
        var record = form.getForm().getRecord(),
            planTabPanel = form.up('PlanContentPanel').down('tabpanel'),
            shopPropertyForm = planTabPanel.down(Ext.String.format("panel[shopId={0}][readOnly=true]", record.get('shop_id')));
  
        if (Ext.isEmpty(shopPropertyForm) == false) {
            planTabPanel.setActiveTab(shopPropertyForm);
            return false;
        }
        
        shopPropertyForm = planTabPanel.add({
            xtype : 'ShopEditorFormPanel',
            shopId : record.get('shop_id'),
            title : Ext.String.format("{0}, {1}", record.get('phone'), record.get('shop_name')),
            iconCls : 'icon-view',
            tooltip : 'Обзор торговой точки',
            closable : true,
            readOnly : true
        });
        
        planTabPanel.setActiveTab(shopPropertyForm);
        shopPropertyForm.el.mask('Загрузка ...');
        
        this.getModel('plan.ShopModel').load(record.get('shop_id'), {
            success : function(record, operation) {
                shopPropertyForm.el.unmask();
                
                shopPropertyForm.getForm().loadRecord(record);
                shopPropertyForm.down('#planogramsGrid').getStore().loadRecords(record.getPlanograms().getRange());
                shopPropertyForm.down('#imagesPanel').getStore().loadRecords(record.getImages().getRange());
            },
            failure : function() {
                planTabPanel.remove(shopPropertyForm);  
            }
        });
    },
    
    onChangeShopReportDate : function(form, date) {
        var record = form.getForm().getRecord();

        this.loadShopReport(form, record.get('shop_id'), date);
    },
    
    onReloadShopReport : function(form) {
        var record = form.getForm().getRecord();
  
        this.loadShopReport(form, record.get('shop_id'), record.get('date'));
    },
    
    onLackOfGoodsReportGroupClick : function(view, node, group, e) {
        if (e.target.nodeName == 'A' || e.target.nodeName == 'EM') {
            var store = view.ownerCt.getStore();
            var groupData = store.getGroups(group);
            if (Ext.isEmpty(groupData.children) == false) {
                var record = groupData.children[0];
                this.onCreateShopViewTab(view.ownerCt, record);
            }
        }
    },
    
    onExportBtnClick : function(grid, type) {
        var filters = Ext.encode(grid.getStore().getFilters()),
            sorters = Ext.encode(grid.getStore().getSorters());
        window.open(Settings.urls.getUrl(Ext.String.format('plan.reports.export.{0}', type)) + "?filters=" + filters + "&sorters=" + sorters);    
    }
    
});
