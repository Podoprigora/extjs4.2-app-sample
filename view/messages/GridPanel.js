Ext.define("App.view.messages.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.MessagesGridPanel",
    
    hideHeaders : true,
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.messages.MessagesStore');
        this.columns = this.buildColumns();
        this.features = this.buildFeatures();
        this.tbar = this.buildTbar();
         this.dockedItems = [
            this.buildFiltersPanel()
        ];
        
        this.callParent(arguments);
        
        this.addEvents('deletebtnclick', 'createbtnclick', 'setfilter');
        
        this.on('selectionchange', this.onToggleDisabledBtns, this);
    },
    
    buildColumns : function() {
        return [
            {
                xtype : 'templatecolumn',
                width : 25,
                align : 'center',
                tpl : [
                    '<tpl if="unread_count &gt; 0">' +
                        '<div class="col-icon icon-comments-hot-light">&nbsp;</div>' +
                    '<tpl else>' +
                        '<div class="col-icon icon-comments-light">&nbsp;</div>' +
                    '</tpl>'
                ]
            },
            {
                dataIndex : 'user',
                minWidth : 140,
                flex : 1,
                renderer : function(v, metaData, record){
                    v = this.userRenderer(v, metaData, record);
                    return this.unreadRenderer(v, metaData, record);
                }
            },
            {
                dataIndex : 'created',
                width : 150,
                align : 'center',
                renderer : function(v, metaData, record){
                    v = Ext.util.Format.date(v, 'd.m.Y H:i');
                    return this.unreadRenderer(v, metaData, record);
                }
            }
        ];
    },
    
    buildFeatures : function(){
        return [
            {
                ftype : 'rowbody',
                getAdditionalData : function(data, rowIndex, record, orig) {
                    
                    var colspan = this.view.headerCt.getColumnCount();
                    
                    return {
                        rowBody : record.get('message'),
                        rowBodyCls : 'x-grid-rowbody-message',
                        rowBodyColspan : colspan
                    };
                }
            },
            {
                ftype: 'rowwrap'
            }
        ];
    },
    
    buildTbar : function() {
        return [
            {
                text : 'Новое сообщение',
                iconCls : 'icon-create',
                scope : this,
                handler : function(){
                    this.fireEvent('createbtnclick', this);
                }
            },
            {
                itemId : 'btnDelete',
                tooltip : 'Удалить',
                iconCls : 'icon-delete',
                disabled : true,
                scope : this,
                handler : function() {
                    this.fireEvent('deletebtnclick', this);
                }
            },
            {
                text : 'Фильтры',
                iconCls : 'icon-filter',
                enableToggle : true,
                scope : this,
                handler : function(btn) {
                    var filterPanel = this.down('#frmFilters');
                    filterPanel.setVisible(btn.pressed);
                }
            },
            '->',
            { 
                tooltip : 'Обновить',
                iconCls : 'icon-refresh',
                scope : this,
                handler : this.onRefresh
            },
            {
                xtype : 'tbspacer'
            },
            { 
                xtype : 'component',
                itemId : 'Totals',
                cls : 'x-component-grid-text-item',
                tpl : 'Всего: <b>{count}</b>'
            }, 
            {
                xtype : 'tbspacer'
            }
        ];
    },
    
    buildFiltersPanel : function() {
        
        var me = this;
        
        return {
            xtype : 'form',
            itemId : 'frmFilters',
            hidden : true,
            width : 220,
            dock : 'left',
            bodyCls : 'x-container-body',
            autoScroll : true,
            defaults : {
                anchor : '100%'
            },
            items : [
                {
                    xtype : 'uxFilterField',
                    name : 'date',
                    menuCls : 'App.ux.grid.header_filters.DateMenu',
                    fieldLabel : 'Дата',
                    labelAlign : 'top',
                    emptyText : 'Выберите дату',
                    margin : '5 10 5 10',
                    listeners : {
                        scope : this,
                        setfilter : function(field, value) {
                            this.fireEvent('setfilter', this, {property : 'created', value : value});       
                        }
                    }
                },
                {
                    xtype : 'uxFilterTree',
                    itemId : 'typesFilter',
                    title : 'Тип',
                    store : Ext.create('App.store.messages.TypesLocalStore'),
                    autoHeight : true,
                    margin : 5,
                    border : false,
                    listeners : {
                        scope : this,
                        checkchange : function(node, checked){
                            var form = this.down('frmFilters'),
                                filter = this.down('#typesFilter'),
                                ids = App.ux.util.Format.convertRecordsToIdsArray(filter.getChecked());
                            if (ids.length) {
                                this.fireEvent('setfilter', this, {property : 'type', value : ids});
                            } else {
                                this.fireEvent('setfilter', this, {property : 'type', value : null});
                            }
                        }
                    }
                },
                {
                    xtype : 'RecipientsListField',
                    fieldLabel : 'Пользователь',
                    emptyText : 'Выберите пользователя',
                    labelAlign : 'top',
                    margin : '5 10 5 10',
                    listeners : {
                        scope : this,
                        select : function(field, record) {
                            field.setValue(record.get('fio'));
                            this.fireEvent('setfilter', this, {property : 'recipient_id', value : record.get('id')}); 
                        },
                        clearfield : function() {
                            this.fireEvent('setfilter', this, {property : 'recipient_id', value : null});          
                        }
                    }
                },
                {
                    xtype : 'uxFilterField',
                    fieldLabel : 'Сообщение',
                    emptyText : 'Введите текст сообщения',
                    labelAlign : 'top',
                    editable : true,
                    multiSelect : true,
                    enableReset : true,
                    margin : '0 10 5 10',
                    listeners : {
                        scope : this,
                        search : function(value) {
                            this.fireEvent('setfilter', this, {property : 'message', value : ((value) ? {'$like' : value} : null)});    
                        }
                    }
                }
            ]
        };
    },
    
    unreadRenderer : function(v, metaData, record) {
        if (record.get('unread_count') > 0) {
            metaData.tdCls = 'x-cell-bold';
        }
        return v;
    },
    
    userRenderer : function(v, metaData, record) {
        if (record.get('unread_count') > 0) {
            return Ext.String.format("{0} <em>({1})</em>", Ext.String.ellipsis(v, 40), record.get('unread_count'));
        }
        return v;
    },
    
    getFileExistsColumnClass : function(v, metaData, record) {
        if (record.get('has_files') > 0) {
            return 'icon-clip'; 
        }
        return; 
    },
    
    getStatusColumnClass : function(v, metaData, record) {
        if (record.get('is_read') == 1) {
            return 'icon-mail-open'; 
        }
        return 'icon-mail'; 
    },
    
    onToggleDisabledBtns : function(){
        var selected = this.getSelectionModel().getSelection(),
            isDeny = true;
            
        Ext.Array.forEach(selected, function(item){
            if (item.get('sender_id') == App.Identity.getRecord().get('id')) {
                isDeny = false;
                return false;
            }
        });
        
        this.down('#btnDelete').setDisabled(isDeny);
    }
    
});