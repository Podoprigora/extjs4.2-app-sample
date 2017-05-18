
Ext.define('App.ux.grid.header_filters.PriceMenu', {
    extend: 'Ext.menu.Menu',

    iconsCls : {
        gt : 'ux-rangemenu-gt',
        lt : 'ux-rangemenu-lt',
        eq : 'ux-rangemenu-eq'
    },

    
    fieldLabels: {
        gt: 'Больше',
        lt: 'Меньше',
        eq: 'Равно',
        curr : 'Валюта'
    },
    

    menuItemCfgs : {
        selectOnFocus: false,
        width: 145
    },

    menuItems : ['eq', '-', 'gt', 'lt', '-', 'curr'],
    
    initComponent : function (config) {
        var me = this;
        
        this.fields = this.buildFields();
        this.items = this.buildItems();
        
        me.callParent(arguments);
        
        me.addEvents(
            'update'
        );
    },
    
    buildFields : function() {
        return {
            gt : {
                field : 'Ext.form.field.Number'    
            },
            lt : {
                field : 'Ext.form.field.Number'     
            },
            eq : {
                field : 'Ext.form.field.Number'     
            },
            curr: { 
                field: 'App.ux.form.field.Combo',
                store : Ext.create('App.store.settings.CurrencyStore'),
                enableReset : true,
                editable : false,
                displayField : 'name',
                valueField : 'name'
            }
        }
    },
    
    buildItems : function() {
        var me = this, 
            items = [],
            fields, fieldCfg, i, len, item, cfg, Cls;
        
        fields = me.fields = me.fields || {};
        fieldCfg = me.fieldCfg = me.fieldCfg || {};
        
        for (i = 0, len = me.menuItems.length; i < len; i++) {
            item = me.menuItems[i];
            if (item !== '-') {
                // defaults
                cfg = {
                    itemId: 'range-' + item,
                    enableKeyEvents: true,
                    hideLabel: false,
                    fieldLabel: me.iconTpl.apply({
                        cls: me.iconsCls[item] || 'no-icon',
                        text: me.fieldLabels[item] || '',
                        src: Ext.BLANK_IMAGE_URL
                    }),
                    labelSeparator: '',
                    labelWidth: 29,
                    margin : '5 5 5 -5',
                    emptyText : me.fieldLabels[item],
                    labelStyle: 'position: relative;',
                    listeners: {
                        scope: this,
                        change : this.onInputChange,
                        keyup: me.onInputKeyUp,
                        el: {
                            click: function(e) {
                                e.stopPropagation();
                            }
                        }
                    },
                    activate: Ext.emptyFn,
                    deactivate: Ext.emptyFn
                };
                Ext.apply(
                    cfg,
                    // custom configs
                    Ext.applyIf(fields[item] || {}, fieldCfg[item]),
                    // configurable defaults
                    me.menuItemCfgs
                );
                Cls = cfg.field || me.fieldCls;

                item = this.fields[item] = Ext.create(Cls, cfg);
                items.push(item);
            } else {
                items.push({xtype : 'menuseparator'});
            }
        }
        return items;
    },
    
    afterRender : function() {
        this.callParent(arguments);
        this.on('show', this.onShowMenu, this);
    },
    
    onShowMenu : function(menu) {
        menu.down('field').focus(false, 200);
    },

    /**  
     * @private
     * Handler method called when there is a keyup event on an input
     * item of this menu.
     */
    onInputKeyUp: function(field, e) {
        if (e.getKey() === e.TAB ) {
            nextField = field.nextSibling('field');
            if (nextField) {
                nextField.focus(200, true);     
            } else {
                this.down('field').focus(200, true);
            }  
        } else if (e.getKey() === e.RETURN && field.isValid()) {
            e.stopEvent();
            this.hide();
        }
    },

    /**
     * @private
     * Handler method called when the user changes the value of one of the input
     * items in this menu.
     */
    onInputChange: function(field, val) {
        var me = this,
            fields = me.fields,
            eq = fields.eq,
            gt = fields.gt,
            lt = fields.lt,
            curr = fields.curr,
            filterStr = "",
            editorField = field.up('menu').editorField;
        
        editorField.clearValueParams();
        
        if (field == eq 
            || (field == curr && Ext.isEmpty(eq.getValue()) == false)) {
            
            if (gt) {
                gt.setRawValue(null);
            }
            if (lt) {
                lt.setRawValue(null);
            }
            filterStr = ((curr) ? App.ux.util.Format.formatPrice(eq.getValue(), curr.getValue()) : eq.getValue());
            
            editorField.setValueParam('$exact', eq.getValue());
            
        } else if(field == gt 
            || field == lt 
            || (field == curr && (Ext.isEmpty(gt.getValue()) == false) || (Ext.isEmpty(lt.getValue()) == false))) {
                
            eq.setRawValue(null);
            
            if (gt.getValue() && lt.getValue()) {
                filterStr = ((curr) ? App.ux.util.Format.formatPrice(gt.getValue(), curr.getValue()) : gt.getValue()) 
                            + " - " 
                            + ((curr) ? App.ux.util.Format.formatPrice(lt.getValue(), curr.getValue()) : lt.getValue());
                editorField.setValueParam('$gte', gt.getValue());
                editorField.setValueParam('$lte', lt.getValue());
            } else if(lt.getValue()) {
                filterStr = "< " + ((curr) ? App.ux.util.Format.formatPrice(lt.getValue(), curr.getValue()) : lt.getValue());
                editorField.setValueParam('$lte', lt.getValue());
            } else if(gt.getValue()) {
                filterStr = "> " + ((curr) ? App.ux.util.Format.formatPrice(gt.getValue(), curr.getValue()) : gt.getValue());
                editorField.setValueParam('$gte', gt.getValue());
            }

        } else if(field == curr) {
            
            filterStr =  App.ux.util.Format.formatPrice(null, curr.getValue());     
        } 
        
        if (curr && Ext.isEmpty(curr.getValue()) == false) {
            editorField.setValueParam('currency', curr.getValue());    
        }
        
        editorField.updateChanges();
        editorField.setRawValue(filterStr);    
    }
}, function() {
    this.prototype.iconTpl = Ext.create('Ext.XTemplate',
        '<img src="{src}" alt="{text}" class="' + Ext.baseCSSPrefix + 'menu-item-icon ux-rangemenu-icon {cls}" />'
    );
});

