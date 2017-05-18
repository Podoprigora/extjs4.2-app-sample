
Ext.define('App.ux.util.WorkspaceHistory', {
    singleton : true,
    alternateClassName : 'App.WorkspaceHistory',
    
    requires : [
        'Ext.util.History'
    ],
    
    mixins : {
        observable : 'Ext.util.Observable'
    },
    
    consructor : function() {

        this.mixins.observable.constructor.call(this);   
    },
    
    setModule : function(name) {
        name = String(name).replace('ContentPanel', '')
        Ext.History.add(name);   
    },
    
    setModuleItem : function(id) {
        token = Ext.History.getToken();
        hash = token.split('-');
        if (Ext.isEmpty(id) == false && Ext.isNumber(id)){
            token = Ext.String.format("{0}-{1}", hash[0], id);          
        } else {
            token = hash[0];   
        }
        Ext.History.add(token);
    }
 
});