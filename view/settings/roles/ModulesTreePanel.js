Ext.define("App.view.settings.roles.ModulesTreePanel", {
    extend : "App.ux.tree.TreeGridPanel",
    alias : "widget.RoleModulesTreeGridPanel",
    
    title : 'Выберите роль',
    cls : 'x-treegrid-with-icon x-no-dirty',
    rootVisible : true,
    
    config : {
        accessARStore : null,
        accessStore : null
    },
    
    initComponent : function(){
        this.store = Ext.create('App.store.settings.roles.ModulesTreeStore');
        this.accessARStore = this.buildAccessARStore();
        this.accessStore = this.buildAccessStore();
        this.columns = this.buildColumns();
        this.plugins = this.buildPlugins();
        this.tbar = this.buildTbar();
        
        this.callParent(arguments);
        
        this.addEvents('savebtnclick');
        
        this.getView().on('refresh', this.onViewRefresh, this);
        this.getStore().on('load', this.onLoadRecords, this);
    },
    
    buildPlugins : function() {
        return [
            {
                ptype : 'cellediting',
                pluginId : 'cellEditing',
                clicksToEdit : 1
            }
        ];
    },
    
    buildColumns : function() {
        return [
            {
                header : 'Наименование',
                xtype : 'treecolumn',
                dataIndex : 'title',
                width : 250
            },
            {
                header : 'Доступ',
                dataIndex : 'access',
                tdCls : 'x-cell-editing',
                width : 150,
                getEditor : Ext.bind(this.getAccessEditor, this),
                renderer : this.accessColumnRenerer
            },
            {
                header : 'Открыть при загрузке',
                dataIndex : 'active_menu',
                xtype  : 'checkcolumn',
                width : 100,
                align : 'center',
                renderer : this.activeModuleRenderer,
                listeners : {
                    scope : this,
                    beforecheckchange : this.onBeforeActiveModuleCheckChange,
                    checkchange : function(){
                        this.getView().refresh();
                    }
                }
            },
            {
                flex : 1
            }
        ];
    },
    
    getAccessEditor : function(node, tree) {
        var moduleName = node.get('name'),
            store = null,
            me = this;
        
        if (moduleName == 'bids' || moduleName == 'operations' || moduleName == 'setting_users') {
            store = this.getAccessARStore();
        } else {
            store = this.buildAccessRADStore();
        }
            
        return Ext.create('Ext.grid.CellEditor', {
            field : Ext.create('App.ux.form.field.Combo', {
                store : store,
                valueField : 'id',
                displayField : 'title',
                editable : false,
                listeners : {
                    scope : this,
                    select : function(field, records){
                        node.cascadeBy(function(item){
                            item.set('access', records[0].get('id')); 
                        });
                        me.getView().refresh();
                    }
                }
            })
        });
    },
    
    buildAccessARStore : function(){
        return Ext.create('Ext.data.Store', {
            fields : ['id', 'title'],
            data : [
                {
                    id : 'read',
                    title : 'Только чтение'
                },
                {
                    id : 'their',
                    title : 'Только свои'
                },
                {
                    id : 'allow',
                    title : 'Полный доступ'
                },
                {
                    id : 'deny',
                    title : 'Нет доступа'
                }
            ]
        });
    },
    
    buildAccessRADStore : function(){
        return Ext.create('Ext.data.Store', {
            fields : ['id', 'title'],
            data : [
                {
                    id : 'read',
                    title : 'Только чтение'
                },
                {
                    id : 'allow',
                    title : 'Полный доступ'
                },
                {
                    id : 'deny',
                    title : 'Нет доступа'
                }
            ]
        });
    },
    
    buildAccessStore : function(){
        return Ext.create('Ext.data.Store', {
            fields : ['id', 'title'],
            data : [
                {
                    id : 'allow',
                    title : 'Полный доступ'
                },
                {
                    id : 'deny',
                    title : 'Нет доступа'
                }
            ]
        });
    },
    
    activeModuleRenderer : function(value, meta, node){
        var cssPrefix = Ext.baseCSSPrefix,
            cls = [cssPrefix + 'grid-checkcolumn'];
        
        if (node.isRoot() 
            || (Ext.isEmpty(node.get('access')) && node.isLeaf()) 
            || (node.get('access') == 'deny' && node.isLeaf())
            || node.get('name').indexOf("maps_") >= 0
            || node.get('name').indexOf("setting_") >= 0) {
                
            return '';
        }
            
        if (this.disabled) {
            meta.tdCls += ' ' + this.disabledCls;
        }
        if (value) {
            cls.push(cssPrefix + 'grid-checkcolumn-checked');
        }
        return '<img class="' + cls.join(' ') + '" src="' + Ext.BLANK_IMAGE_URL + '"/>';
    },
    
    accessColumnRenerer : function(v, metaData, node) {
        if (node.isLeaf()) {
            var access = node.get('access') ? node.get('access') : 'deny';
            if (access == 'deny') {
                metaData.tdCls += " x-cell-red";
            }
            return this.getAccessARStore().getById(access).get('title');
        }   
    },
    
    buildTbar : function() {
        return [
            {
                text : 'Применить изменения',
                itemId : 'btnAccept',
                iconCls : 'icon-accept',
                disabled : true,
                scope : this,
                handler : function() {
                    this.fireEvent('savebtnclick', this);
                }
            }
        ];
    },
    
    onBeforeActiveModuleCheckChange : function(column, rowIndex, checked){
        this.getStore().getRootNode().cascadeBy(function(node){
            node.set('active_menu', 0);
        });
        
        return true;
    },
    
    onViewRefresh : function(view) {
        this.down('#btnAccept').setDisabled(view.getStore().getModifiedRecords().length == 0);   
    },
    
    onLoadRecords : function(store) {
        var rootNode = store.getRootNode();
        if (! rootNode.isExpanded()) {
            rootNode.expand();
        }
    }
});