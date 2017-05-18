Ext.define("App.view.settings.users.FiltersFormPanel", {
    extend : "Ext.form.Panel",
    alias : "widget.UsersFiltersFormPanel",
    
    width : 220,
    dock : 'left',
    bodyCls : 'x-container-body',
    autoScroll : true,
    border : false,
    defaults : {
        anchor : '100%'
    },
    
    initComponent : function(){
        
        this.items = this.buildItems();
        
        this.callParent(arguments);
        
        this.addEvents('setfilter');
    },
    
    buildItems : function() {
        return [
            {
                xtype : 'uxFilterTree',
                itemId : 'statusesFilter',
                title : 'Статус',
                store : Ext.create('App.store.settings.users.StatusesLocalTreeStore'),
                autoHeight : true,
                border : false,
                margin : '0 5 0 0',
                listeners : {
                    scope : this,
                    checkchange : function(node, checked){
                        var form = this,
                            filter = this.down('#statusesFilter'),
                            ids = App.ux.util.Format.convertRecordsToIdsArray(filter.getChecked());
                        if (ids.length) {
                            this.fireEvent('setfilter', this, {property : 'status', value : {'$in' : ids}});
                        } else {
                            this.fireEvent('setfilter', this, {property : 'status', value : null});
                        }
                    }
                }
            },
            {
                xtype : 'LocationsFilterPanel',
                margin : '5 5 5 0',
                listeners : {
                    scope : this,
                    setfilter : function(form, filters) {
                        this.fireEvent('setfilter', this, filters);
                    }
                }
            },
            {
                xtype : 'uxGroupingCombo',
                fieldLabel : 'Роль',
                store : Ext.create('App.store.settings.roles.RolesStore'),
                groupField : 'group_name',
                enableReset : true,
                labelAlign : 'top',
                margin : '5 10 5 5',
                emptyText : 'Выберите роль',
                multiSelect : true,
                listeners : {
                    scope : this,
                    change : function(field, value) {
                        if (value.length) {
                            this.fireEvent('setfilter', this, {property : 'role_id', value : {'$in' : value}});
                        } else {
                            this.fireEvent('setfilter', this, {property : 'role_id', value : null});
                        } 
                    }
                }
            },
            {
                xtype : 'uxFilterField',
                fieldLabel : 'ФИО',
                labelAlign : 'top',
                margin : '0 10 5 5',
                emptyText : 'Введите ФИО',
                editable : true,
                listeners : {
                    scope : this,
                    search : function(value) {
                        this.fireEvent('setfilter', this, {property : 'fio', value : ((value) ? {'$like' : value} : null)});       
                    }
                }
            },
            {
                xtype : 'uxFilterField',
                fieldLabel : 'Телефон',
                labelAlign : 'top',
                margin : '0 10 5 5',
                emptyText : 'Введите телефон',
                editable : true,
                listeners : {
                    scope : this,
                    search : function(value) {
                        this.fireEvent('setfilter', this, {property : 'phones', value : ((value) ? {'$like' : value} : null)});       
                    }
                }
            },
            {
                xtype : 'uxFilterField',
                fieldLabel : 'Email',
                labelAlign : 'top',
                margin : '0 10 5 5',
                editable : true,
                emptyText : 'Введите Email',
                listeners : {
                    scope : this,
                    search : function(value) {
                        this.fireEvent('setfilter', this, {property : 'email', value : ((value) ? {'$like' : value} : null)});       
                    }
                }
            },
            {
                xtype : 'uxFilterField',
                menuCls : 'App.ux.grid.header_filters.DateMenu',
                fieldLabel : 'Дата входа',
                labelAlign : 'top',
                emptyText : 'Выберите дату',
                margin : '5 10 5 5',
                listeners : {
                    scope : this,
                    setfilter : function(field, value) {
                        this.fireEvent('setfilter', this, {property : 'login_date', value : value});       
                    }
                }
            }
        ]
    }
});