Ext.define('App.ux.grid.BasicGrid', {
    extend : 'Ext.grid.Panel',
    alias : 'widget.uxBasicGrid',
    
    requires : [
        'App.ux.grid.features.Buffered',
        'App.ux.form.field.Search',
        'App.ux.form.field.SearchTrigger'
    ],
    
    config : {
        ctxMenu : null,
        extraParams : null
    },
    
    autoScroll : true,
    
    viewConfig : {
        autoScroll : true,
        emptyText : '<p>Нет записей</p>',
        stripeRows : false,
        loadMask : true,
        shadow : false,
        forceFit : true
    },
    
    selType: 'rowmodel',
    selModel : {
        mode : 'SINGLE',
        pruneRemoved : false
    },

    initComponent : function() {
        
        this.callParent(arguments);
        
        this.relayEvents(this.store, ['load', 'beforeload', 'prefetch', 'beforeprefetch', 'totalcountchange']);
        this.addEvents('checkchange', 'exportdata', 'beforeload');
        
        this.getView().on("refresh", this.onUpdateTodalLabel, this);
    },
    
    wraptextRenderer : function(v, meta) {
        if (Ext.isEmpty(v) == false) {
            meta.style = "white-space: normal;";
        }
        
        return v;
    },

    linkRenderer : function(v) {
        return (Ext.isEmpty(v) == false) ? '<a href="javaScript:void(0)">' + v + '</div>' : '';
    },
    
    propertyRenderer : function(v) {
        if (Ext.isString(v)) {
            v = v.replace("_", " ");
            return Ext.String.capitalize(v);
        }
        return v;
    },
    
    listRenderer : function(v) {
        list_arr = v.split(";");
        if (list_arr.length) {
            list_str = "";
            for(var i in list_arr) {
                list_str += "<div>" + list_arr[i] + "</div>"
            }
            return list_str;
        }
        return v;
    },
    
    qtipRenderer : function(v, metaData, record) {
        metaData.tdAttr = "data-qtip='" + v + "'";
        return v;    
    },
    
    markboldRenderer : function(v, meta, rec) {
        meta.tdCls = 'x-cell-bold';
        return v;   
    },
    
    onActionHandler : function(event, selectRow, view, rowIndex, colIndex, item, e, record, row) {
        if (e.target.className.indexOf("icon-") == -1 || e.getKey() == e.ENTER) {
            return false;
        }
        if (selectRow) {
            view.getSelectionModel().select(record);
        }
        this.fireEvent(event, view, rowIndex, colIndex, item, e, record); 
    },
    
    onSetQuickFilter : function(grid, btn, dataField) {
        
        btnsGroup = grid.down('#btnsQuickFilters');
        dataField = dataField || 'type';
        
        if (btn.filterVal == 'all' && ! btn.pressed) {
            btn.toggle(true);      
        } else if(btn.filterVal != 'all') {
            btnsGroup.down("#btnFilterAll").toggle(! btnsGroup.query('button[pressed=true]').length);
        } else {
            btnsGroup.items.each(function(item, index){
                if (index > 0 && item.isXType('button')) {
                    item.toggle(false);   
                }
            });   
        }
        
        pressedBtns = btnsGroup.query('button[pressed=true]');
        
        if (pressedBtns.length == 1 && pressedBtns[0].filterVal == 'all') {
            grid.store.removeFilter(dataField);
            grid.store.load();
            return;
        }
        
        filtersArr  = [];
        Ext.Array.forEach(pressedBtns, function(item){
            filtersArr.push(item.filterVal);
        });
        
        grid.store.addFilter(dataField, filtersArr);
    },
    
    onUpdateTodalLabel : function() {
        var lblTotals = this.down("#Totals");
        if (Ext.isEmpty(lblTotals) == false) {
            var count = this.getStore().getTotalCount() || this.getStore().getCount(); 
            lblTotals.update({count : count});   
        }
    },
    
    onRefresh : function() {
        this.getSelectionModel().deselectAll();
        this.getStore().data.clear();
        this.getStore().sorters.clear();
        this.getStore().loadPage(1);
    }
    
});