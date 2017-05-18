Ext.define('App.model.plan.ScriptRuleModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    idgen : 'sequential',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'trigger', type : 'string'},
        {name : 'trigger_value', type : 'int'},
        {name : 'trigger_delay', type : 'int'},
        {name : 'action', type : 'string'},
        {name : 'action_value', type : 'int'},
        {name : 'action_duration', type : 'int'}
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});