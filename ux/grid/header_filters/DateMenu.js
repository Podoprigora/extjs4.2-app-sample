Ext.define('App.ux.grid.header_filters.DateMenu', {
    extend : 'Ext.menu.Menu',
    
    editorField : null,
    
    config : {
        itemsConfig : {
            showTodayItem : true,
            showYesterdayItem : true,
            showCurrMonthItem : true,
            showPrevMonthItem : true,
            showDateItem : true,
            showDateRangeItem : true
        }  
    },
    
    initComponent : function() {
        this.items = this.buildItems();
        this.callParent(arguments);
    },
    
    onMouseLeave: function(e) {
        var me = this;

        me.fireEvent('mouseleave', me, e);
    },
    
    buildItems : function() {
        return [
            {
                text : 'Сегодня',
                hidden : (this.itemsConfig.showTodayItem === false),
                scope : this,
                handler  : this.onTodaySelect
            },
            {
                text : 'Вчера',
                hidden : (this.itemsConfig.showYesterdayItem === false),
                scope : this,
                handler : this.onYesterdaySelect
            },
            {
                text : 'Текущий месяц',
                hidden : (this.itemsConfig.showCurrMonthItem === false),
                scope : this,
                handler : this.onCurrMonthSelect
            },
            {
                text : 'Предыдущий месяц',
                hidden : (this.itemsConfig.showPrevMonthItem === false),
                scope : this,
                handler : this.onPrevMonthSelect
            },
            '-',
            {
                text : 'Выберите дату',
                hidden : (this.itemsConfig.showDateItem === false),
                menu : {
                    xtype : 'menu',
                    plain : true,
                    hideOnClick : false,
                    items : [
                        {
                            xtype : 'panel',
                            border : false,
                            bodyPadding : 2,
                            items : [
                                {
                                    xtype : 'datepicker',
                                    border : false,
                                    listeners : {
                                        scope : this,
                                        select : this.onSpecificDateSelect
                                    }
                                }
                            ]
                        }
                    ]
                },
                listeners : {
                    scope  :this,
                    el : {
                        click : function(e) {
                            e.stopPropagation();
                        }
                    }
                }
            },
            {
                text : 'Задайте период',
                hidden : (this.itemsConfig.showDateRangeItem === false),
                menu : {
                    xtype : 'menu',
                    plain : true,
                    items : [
                        {
                            xtype : 'panel',
                            bodyPadding : 5,
                            border : false,
                            layout : {
                                type : 'hbox',
                                align : 'stretch'
                            },
                            defaults : {
                                flex : 1,
                                layout : 'fit'
                            },
                            items : [
                                {
                                    title : 'От',
                                    margin : { right : 5 },
                                    items : {
                                        xtype : 'datepicker',
                                        border : false,
                                        listeners : {
                                            scope : this,
                                            select : this.onSelectStartDate
                                        }
                                    }
                                },
                                {
                                    title : 'До',
                                    items : {
                                        xtype : 'datepicker',
                                        border : false,
                                        listeners : {
                                            scope : this,
                                            select : this.onSelectEndDate
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },
                listeners : {
                    scope  :this,
                    el : {
                        click : function(e) {
                            e.stopPropagation();
                        }
                    }
                }
            }
        ];
    },
    
    onTodaySelect : function() {
        var date = new Date();
        this.editorField.clearValueParams();
        
        this.editorField.setValueParam('$exact', Ext.util.Format.date(date, 'Y-m-d'));
        this.editorField.updateChanges();
        
        this.editorField.setRawValue(Ext.util.Format.date(date, 'd.m.Y'));        
    },
    
    onYesterdaySelect : function() {
        var date = Ext.Date.add(new Date(), Ext.Date.DAY, -1);
        this.editorField.clearValueParams();
        
        this.editorField.setValueParam('$exact', Ext.util.Format.date(date, 'Y-m-d'));
        this.editorField.updateChanges();
        
        this.editorField.setRawValue(Ext.util.Format.date(date, 'd.m.Y')); 
    },
    
    onCurrMonthSelect : function() {
        var date = new Date();
        this.onInitDateRange(Ext.Date.getFirstDateOfMonth(date), Ext.Date.getLastDateOfMonth(date));
    },
    
    onPrevMonthSelect : function() {
        var date = new Date(),
            prevDate = Ext.Date.add(date, Ext.Date.MONTH, -1);
        this.onInitDateRange(Ext.Date.getFirstDateOfMonth(prevDate), Ext.Date.getLastDateOfMonth(prevDate));
    },
    
    onSpecificDateSelect : function(picker, date) {
        this.hide();
        this.editorField.clearValueParams();
        
        this.editorField.setValueParam('$exact', Ext.util.Format.date(date, 'Y-m-d'));
        this.editorField.updateChanges();
        
        this.editorField.setRawValue(Ext.util.Format.date(date, 'd.m.Y'));
    },
    
    onSelectStartDate : function(picker, date) {
        var endDatePicker = picker.up().nextSibling('panel').down('datepicker'),
            endDate = endDatePicker.getValue();
        
        this.onInitDateRange(date, endDate);
    },
    
    onSelectEndDate : function(picker, date) {
        var startDatePicker = picker.up().previousSibling('panel').down('datepicker'),
            startDate = startDatePicker.getValue();
        
        this.onInitDateRange(startDate, date);   
    },
    
    onInitDateRange : function(startDate, endDate) {
        this.editorField.clearValueParams();
        this.editorField.setValueParam('$gte', Ext.util.Format.date(startDate, 'Y-m-d'));
        this.editorField.setValueParam('$lte', Ext.util.Format.date(endDate, 'Y-m-d'));
        
        this.editorField.updateChanges();
        
        if (startDate == endDate) {
            this.editorField.setRawValue(Ext.util.Format.date(date, 'd.m.Y'));    
        } else {
            value = Ext.util.Format.date(startDate, 'd.m.y') 
                    + " - " 
                    + Ext.util.Format.date(endDate, 'd.m.y');
            this.editorField.setRawValue(value);
        }   
    }
    
});