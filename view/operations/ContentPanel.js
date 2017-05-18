Ext.define("App.view.operations.ContentPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.OperationsContentPanel",
    
    layout : 'fit',
    border : false,
    bodyPadding : 5,
    bodyCls : 'x-container-body',
    
    initComponent : function(){
        
        this.items = this.buildContentPanel();
        this.lbar = this.buildLbar();
        
        this.callParent(arguments);
        
        this.addEvents('panelready', 'createneweditor', 'selectwarehouse', 'showaggregatereportfilters');
    },
    
    buildContentPanel : function(){
        return {
            xtype : 'uxTabPanel'
        };
    },
    
    buildLbar : function() {
        return {
            layout : {
                type : 'vbox',
                align : 'stretch'
            },
            width : 145,
            cls : 'vertical-menu-large',
            defaults : {
                scale : 'large',
                iconAlign : 'left'
            },
            items : [
                {
                    text : 'Принять',
                    iconCls : 'icon24-gray-file-accept',
                    hidden : App.Identity.getRecord().hasPermit('operations', 'read'),
                    scope : this,
                    handler : function(btn) {
                        this.fireEvent('createneweditor', this, 'incoming');
                    }
                },
                {
                    text : 'Отпустить',
                    iconCls : 'icon24-gray-file-issue',
                    hidden : App.Identity.getRecord().hasPermit('operations', 'read'),
                    scope : this,
                    handler : function(btn) {
                        this.fireEvent('createneweditor', this, 'issue');
                    }
                },
                {
                    text : 'Вернуть',
                    iconCls : 'icon24-gray-file-remove',
                    hidden : App.Identity.getRecord().hasPermit('operations', 'read'),
                    scope : this,
                    handler : function(btn) {
                        this.fireEvent('createneweditor', this, 'return');
                    }
                },
                {
                    text : 'Списать',
                    iconCls : 'icon24-gray-file-cancel',
                    hidden : App.Identity.getRecord().hasPermit('operations', 'read'),
                    scope : this,
                    handler : function(btn) {
                        this.fireEvent('createneweditor', this, 'cancel');
                    }
                },
                {
                    text : 'Транзит',
                    //iconCls : 'icon32-transit',
                    iconCls : 'icon24-gray-shipping',
                    menuAlign : 'tr',
                    hidden : App.Identity.getRecord().hasPermit('operations', 'read'),
                    menu : [
                        {
                            text : 'Принять из транзита',
                            iconCls : 'icon-truck-green',
                            scope : this,
                            handler : function(btn) {
                                this.down('uxTabPanel').addTab('OperationIncomingTransitsGridPanel', btn.text, btn.iconCls);
                            }
                        },
                        {
                            text : 'Выпустить в транзит',
                            iconCls : 'icon-truck',
                            scope : this,
                            handler : function(btn) {
                                this.fireEvent('createneweditor', this, 'issue-transit');
                            }
                        }    
                    ]
                },
                {
                    xtype : 'label',
                    text : 'Отчеты'
                },
                {
                    text : 'Движения <br/> материалов',
                    //iconCls : 'icon32-table-view-excel',
                    iconCls : 'icon24-gray-files',
                    cls : 'x-btn-font-size-11-5',
                    scope : this,
                    handler : function(btn) {
                        this.down('uxTabPanel').addTab('OperationsReportGridPanel', btn.text, 'icon-files');     
                    }
                },
                {
                    text : 'Обзор склада',
                    //iconCls : 'icon32-table-view-excel',
                    iconCls : 'icon24-gray-files',
                    cls : 'x-btn-font-size-11-5',
                    scope : this,
                    handler : function(btn) {
                        this.down('uxTabPanel').addTab('OperationsRemainsReportGridPanel', btn.text, 'icon-files');        
                    }
                },
                {
                    text : 'Агрегированный <br/> отчет',
                    iconCls : 'icon24-gray-file-excel',
                    cls : 'x-btn-font-size-11-5',
                    scope : this,
                    handler : function() {
                        this.fireEvent('showaggregatereportfilters', this);
                    }
                }
            ]
        };
    }
});