Ext.define('App.store.plan.ScriptRulesLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.plan.ScriptRuleModel',
    
    autoLoad : false,
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});