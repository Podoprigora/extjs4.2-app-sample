/**
 * A Picker field that contains a tree panel on its popup, enabling selection of tree nodes.
 */
Ext.define('App.ux.picker.Tree', {
    extend: 'Ext.form.field.Picker',
    alias: 'widget.uxTreePicker',
    
    uses: [
        'Ext.tree.Panel'
    ],

    triggerCls: Ext.baseCSSPrefix + 'form-arrow-trigger',
    
    trigger2Cls: 'x-form-clear-trigger',
    hideTrigger2 : true,

    config: {
        /**
         * @cfg {Ext.data.TreeStore} store
         * A tree store that the tree picker will be bound to
         */
        store: null,

        /**
         * @cfg {String} displayField
         * The field inside the model that will be used as the node's text.
         * Defaults to the default value of {@link Ext.tree.Panel}'s `displayField` configuration.
         */
        displayField: null,

        /**
         * @cfg {Array} columns
         * An optional array of columns for multi-column trees
         */
        columns: null,

        /**
         * @cfg {Boolean} selectOnTab
         * Whether the Tab key should select the currently highlighted item. Defaults to `true`.
         */
        selectOnTab: true,

        /**
         * @cfg {Number} maxPickerHeight
         * The maximum height of the tree dropdown. Defaults to 300.
         */
        maxPickerHeight: 300,

        /**
         * @cfg {Number} minPickerHeight
         * The minimum height of the tree dropdown. Defaults to 100.
         */
        minPickerHeight: 100,
        
        minPickerWidth : null,
        
        selectOnlyLeaf : true
    },
    queryParam : 'query',
    enableKeyEvents : true,
    editable: false,
    selectOnFocus : true,

    initComponent: function() {
        var me = this;
        me.callParent(arguments);

        me.addEvents(
            /**
             * @event select
             * Fires when a tree node is selected
             * @param {Ext.ux.TreePicker} picker        This tree picker
             * @param {Ext.data.Model} record           The selected record
             */
            'select',
            'clean'
        );

        me.mon(me.store, {
            scope: me,
            load: me.onLoad,
            update: me.onUpdate
        });
    },
    
    afterRender : function() {
        this.callParent(arguments);
        this.updateTriggers();
    },
    
    initEvents : function() {
        var me = this;
        
        me.callParent(arguments);
        
        me.mon(me, 'focus', function(){
            me.expand();
        }, me, {buffer : 200});
    },
    
    onTriggerClick: function(e) {        
        var me = this;

        if (!me.readOnly && !me.disabled) {
            if (me.isExpanded) {
                me.collapse();
                me.isExpanded = null;
            } else {
                me.expand();
            }
        }
    },
    
    onTrigger2Click : function() {        
        var me = this;
        
        if (me.isExpanded) {
            me.collapse();
        }
        me.setRawValue('');
        me.reset();
        me.updateTriggers();
        me.fireEvent('clean', this);
    },

    /**
     * Creates and returns the tree panel to be used as this field's picker.
     */
    createPicker: function() {
        var me = this,
            picker = new Ext.tree.Panel({
                shrinkWrapDock: 3,
                store: me.store,
                floating: true,
                displayField: me.displayField,
                columns: me.columns,
                minHeight: me.minPickerHeight,
                maxHeight: me.maxPickerHeight,
                minWidth : me.minPickerWidth,
                manageHeight: false,
                shadow: false,
                rootVisible : false,
                useArrows : true,
                shadow : 'sides',
                shadowOffset : 10,
                frame : true,
                border : false,
                resizable : true,
                resizeHandles : 'se',
                listeners: {
                    scope: me,
                    itemclick: me.onItemClick,
                    beforeselect : me.onBeforeNodeSelect
                    
                },
                viewConfig: {
                    listeners: {
                        scope: me,
                        render: me.onViewRender
                    }
                },
                bbar : [
                    {  
                        tooltip : 'Обновить',
                        iconCls : 'icon-refresh',
                        scope : this,
                        handler : function() {
                            me.store.load();
                        }
                    }
                ]
            }),
            view = picker.getView();

        if (Ext.isIE9 && Ext.isStrict) {
            // In IE9 strict mode, the tree view grows by the height of the horizontal scroll bar when the items are highlighted or unhighlighted.
            // Also when items are collapsed or expanded the height of the view is off. Forcing a repaint fixes the problem.
            view.on({
                scope: me,
                highlightitem: me.repaintPickerView,
                unhighlightitem: me.repaintPickerView,
                afteritemexpand: me.repaintPickerView,
                afteritemcollapse: me.repaintPickerView
            });
        }
        return picker;
    },
    
    onViewRender: function(view){
        view.getEl().on('keydown', this.onPickerKeypress, this);
    },

    /**
     * repaints the tree view
     */
    repaintPickerView: function() {
        var style = this.picker.getView().getEl().dom.style;

        // can't use Element.repaint because it contains a setTimeout, which results in a flicker effect
        style.display = style.display;
    },

    /**
     * Aligns the picker to the input element
     */
    alignPicker: function() {
        var me = this,
            picker;

        if (me.isExpanded) {
            picker = me.getPicker();
            if (me.matchFieldWidth) {
                // Auto the height (it will be constrained by max height)
                picker.setWidth(me.bodyEl.getWidth());
            }
            if (picker.isFloating()) {
                me.doAlign();
            }
        }
    },

    /**
     * Handles a click even on a tree node
     * @private
     * @param {Ext.tree.View} view
     * @param {Ext.data.Model} record
     * @param {HTMLElement} node
     * @param {Number} rowIndex
     * @param {Ext.EventObject} e
     */
    onItemClick: function(view, record, node, rowIndex, e) {
        this.selectItem(record);
    },

    /**
     * Handles a keypress event on the picker element
     * @private
     * @param {Ext.EventObject} e
     * @param {HTMLElement} el
     */
    onPickerKeypress: function(e, el) {
        var key = e.getKey();

        if(key === e.ENTER || (key === e.TAB && this.selectOnTab)) {
            this.selectItem(this.picker.getSelectionModel().getSelection()[0]);
        }
    },

    /**
     * Changes the selection to a given record and closes the picker
     * @private
     * @param {Ext.data.Model} record
     */
    selectItem: function(record) {
        var me = this;

        if (me.selectOnlyLeaf == true && record.firstChild) {
            me.markInvalid('Невозможно выбрать корневой элемент!');
            return me;
        }
        
        me.setValue(record.getId());
        me.picker.hide();
        me.focus(false, 200);
        me.clearInvalid();
        me.fireEvent('select', me, record)
        me.updateTriggers();
    },

    /**
     * Runs when the picker is expanded.  Selects the appropriate tree node based on the value of the input element,
     * and focuses the picker so that keyboard navigation will work.
     * @private
     */
    onExpand: function() {
        var me = this,
            picker = me.picker,
            store = picker.store,
            rootNode = store.getRootNode(),
            value = me.value,
            node;
        
        if (! rootNode.isExpanded()) {
            rootNode.expand()
        }
        
        if (value) {
            node = store.getNodeById(value);
        }
        
        if (!node) {
            node = store.getRootNode();
        }
        
        picker.selectPath(node.getPath());

        Ext.defer(function() {
            picker.getView().focus();
        }, 200);
    },

    /**
     * Sets the specified value into the field
     * @param {Mixed} value
     * @return {Ext.ux.TreePicker} this
     */
    setValue: function(value) {
        var me = this,
            record;
        
        me.value = value;

        if (me.store.loading) {
        // Called while the Store is loading. Ensure it is processed by the onLoad method.
            return me;
        }
         
        // try to find a record in the store that matches the value
        record = value ? me.store.getNodeById(value) : me.store.getRootNode();
        if (value === undefined) {
            record = me.store.getRootNode();
            me.value = record.getId();
        } else {
            record = me.store.getNodeById(value);
        }

        // set the raw value to the record's display field if a record was found
        me.setRawValue(record ? record.get(me.displayField) : '');
        
        if (me.store.getRootNode().isExpanded() == false && value !== undefined) {
            me.store.getRootNode().expand();
            return me;
        }
        
        return me;
    },
    
    getSubmitValue: function(){
        return this.value;    
    },

    /**
     * Returns the current data value of the field (the idProperty of the record)
     * @return {Number}
     */
    getValue: function() {
        return this.value;
    },

    /**
     * Handles the store's load event.
     * @private
     */
    onLoad: function() {
        var value = this.value;
        if (value) {
            this.setValue(value);
        }
    },
    
    onUpdate: function(store, rec, type, modifiedFieldNames){
        var display = this.displayField;
        
        if (type === 'edit' && modifiedFieldNames && Ext.Array.contains(modifiedFieldNames, display) && this.value === rec.getId()) {
            this.setRawValue(rec.get(display));
        }
    },
    
    onBeforeNodeSelect : function(tree, record) {
        return true;
    },
    
    updateTriggers : function() {
        var me = this;
        if (me.value || ! this.hideTrigger2) {
            me.triggerCell.item(1).setDisplayed(true);
        } else {
            me.triggerCell.item(1).setDisplayed(false);    
        } 
        me.updateLayout();
    }

});

