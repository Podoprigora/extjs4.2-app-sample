Ext.define('App.view.plan.reports.GridFilterDateMenu', {
    extend : 'App.ux.grid.header_filters.DateMenu',
    
    initComponent : function() {
        
        this.items = this.buildItems();
        
        this.callParent(arguments);
        
        this.editorField.on('beforechange', this.onBeforeChange, this);
    },
    
    buildItems : function() {
        
        var items = this.callParent();
        items.push("-");
        items.push({
            text : 'Суммарно за период',
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
                                        select : this.onSelectStartSumDate
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
                                        select : this.onSelectEndSumDate
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
        });
        
        return items;
    },
    
    onSelectStartSumDate : function(picker, date) {
        var endDatePicker = picker.up().nextSibling('panel').down('datepicker'),
            endDate = endDatePicker.getValue();
        
        this.onInitSumDateRange(date, endDate);
    },
    
    onSelectEndSumDate : function(picker, date) {
        var startDatePicker = picker.up().previousSibling('panel').down('datepicker'),
            startDate = startDatePicker.getValue();
        
        this.onInitSumDateRange(startDate, date);   
    },
    
    onInitSumDateRange : function(startDate, endDate) {
        this.editorField.clearValueParams();
        this.editorField.setValueParam('$gte', Ext.util.Format.date(startDate, 'Y-m-d'));
        this.editorField.setValueParam('$lte', Ext.util.Format.date(endDate, 'Y-m-d'));
        this.editorField.setValueParam('mode', 'sum');
        this.editorField.setFieldLabel('Суммарно за период');
        this.editorField.updateChanges();
        
        if (startDate == endDate) {
            this.editorField.setRawValue(Ext.util.Format.date(date, 'd.m.Y'));    
        } else {
            value = Ext.util.Format.date(startDate, 'd.m.y') 
                    + " - " 
                    + Ext.util.Format.date(endDate, 'd.m.y');
            this.editorField.setRawValue(value);
        } 
    },
    
    onBeforeChange : function(field, value) {
        var valueParams = field.valueParams;
        if (Ext.isEmpty(valueParams) || Ext.isEmpty(valueParams.mode)) {
            field.setFieldLabel('Дата');
        }

        return true;
    }
    
});