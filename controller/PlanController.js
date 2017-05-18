Ext.define('App.controller.PlanController', {
    extend : 'Ext.app.Controller',
    
    views : [
        'plan.ContentPanel'    
    ],
    
    refs : [
        {
            selector : 'PlanContentPanel',
            ref : 'ContentPanel'
        
        }
    ],
    
    init : function() {
        
        this.control({
            'PlanContentPanel' : {
                panelready : this.onInitContentPanel,
                menubtnclick : this.onCreateModuleTab,
                importmenubtnclick : this.onImport
            }   
        });
    },
    
    onInitContentPanel : function(panel) {
        panel.down('uxTabPanel').addTab('PlanReportLackOfGoodsGridPanel', 'Обзор OOS', 'icon-files', false);
        
        var btnMenuShops = panel.down('#btnMenuShops');
        
        if (btnMenuShops.isVisible()) {
            Ext.TaskManager.start({
                scope : this,
                run : this.getShopsAlerts,
                interval : 300000
            });   
        }
    },
    
    onCreateModuleTab : function(panel, moduleXType, title, iconCls) {
        var tabPanel = panel.down('uxTabPanel');
        tabPanel.addTab(moduleXType, title, iconCls);
    },
    
    onImport : function(panel) {
        
        var me = this;
        
        App.ux.Msg.wait("Импорт данных ...");
        
        Ext.Ajax.request({
            url : Settings.urls.getUrl('plan.import'),
            success : function(response) {
                if (App.ux.util.Response.isValidStatus(response)) {
                    var response = Ext.decode(response.responseText);
                    
                    if (Ext.isEmpty(response.date) == false && Ext.isEmpty(response.msg) == false) {
                        App.ux.Msg.info(Ext.String.format("Импорт данных с: <b>{0}</b> <br /> Результат: <b>{1}</b>", response.date, response.msg));
                    } else {
                        App.ux.Msg.hide();
                        App.ux.Msg.notification("Импорт вылнен.");
                    }
                    
                    var smsLogGrid = panel.down('PlanSmsLogGridPanel');
                    if (Ext.isEmpty(smsLogGrid) == false) {
                        smsLogGrid.getStore().load();    
                    }
                    
                    me.getShopsAlerts();
                }
            }
        });
        
    },
    
    getShopsAlerts : function() {
        var contentPanel = this.getContentPanel();
        Ext.Ajax.request({
            url : Settings.urls.getUrl('plan.shops.get_alerts'),
            success : function(response) {
                if (App.ux.util.Response.isValidStatus(response)) {
                    var response = Ext.decode(response.responseText),
                        btnMenuShops = contentPanel.down('#btnMenuShops'),
                        errors = new Array();
                    
                    if ((Ext.isEmpty(response.delay_request) == false && parseInt(response.delay_request) > 0)) {
                        errors.push(" - Нет связи с устройством более 25 часов");
                    }
                    
                    if ((Ext.isEmpty(response.low_balance_count) == false && parseInt(response.low_balance_count) > 0)) {
                        errors.push(" - Низкий баланс SIM карты");
                    }
                    
                    if ((Ext.isEmpty(response.power_off_count) == false && parseInt(response.power_off_count) > 0)) {
                        errors.push(" - Отключение электричества");
                    }
                    
                    if (errors.length) {
                        btnMenuShops.setIconCls('icon24-orange-error');   
                        btnMenuShops.addCls('x-btn-orange');
                        btnMenuShops.setTooltip(errors.join("<br />"));
                    } else {
                        btnMenuShops.setIconCls('icon24-orange-list');
                        btnMenuShops.removeCls('x-btn-orange');
                    }
                }
            }
        });
    }
    
});