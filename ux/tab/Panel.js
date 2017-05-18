Ext.define('App.ux.tab.Panel', {
    extend : 'Ext.tab.Panel',
    alias : 'widget.uxTabPanel',
    
    plain : true,
    minTabWidth : 80,
    activeTab : 0,
    autoDestroy : false,
    hidden : true,
    bodyCls : 'x-container-body',
    
    initComponent : function() {
        
        this.plugins =  [
            {
                ptype : 'tabreorderer'
            },
            {
                ptype : 'tabclosemenu'
            }
        ];
        
        this.defaults = {
            closable : true,
            listeners : {
                scope : this,
                removed : this.onAfterRemoveTab
            }
        };
        
        this.callParent(arguments);
    },
    
    animateAdd : function(tab, callback){
        var activeTab = this.getActiveTab(),
            newTab = this.add(tab),
            me = this;
            
        activeTab.getEl().fadeOut({
            opacity: 0.6, 
            duration: 150,
            callback: function() {
                activeTab.getEl().dom.style.opacity = 1;
                me.setActiveTab(newTab);
                if (Ext.isFunction(callback)) {
                    callback(newTab);    
                }  
            }
        }); 
            
        return newTab;
    },
    
    addTab : function(moduleXType, title, iconCls, closable, refresh) {
        var tab = this.down(moduleXType);
        
        this.setVisible(true);
        
        if (Ext.isEmpty(tab)) {
            tab = this.add({
                xtype : moduleXType,
                title : title,
                iconCls : iconCls,
                closable : closable
            });
        }
        this.setActiveTab(tab);
        
        if (Ext.isEmpty(refresh) == false && refresh == false) {
            return tab;   
        }
        
        if (Ext.isEmpty(tab.onRefresh) == false) {
            tab.onRefresh();
        } else if (tab.onInitPanel) {
            tab.onInitPanel();
        } else if (Ext.isEmpty(tab.store) == false) {
            tab.getStore().load();
        }
        
        return tab;
    },
    
    onAfterRemoveTab : function(panel) {
        this.setVisible(this.items.items.length >= 1);
    },
    
    setDisabledTabs : function(disabled) {
        this.setActiveTab(0);
        this.items.each(function(item, index){
            if (index > 0) {
                item.setDisabled(disabled);
            }
        }, this);
    }
});