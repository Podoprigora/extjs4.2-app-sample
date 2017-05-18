Ext.define('App.store.plan.ScriptRuleActionsLocalStore', {
    extend : 'Ext.data.Store',
    
    fields : ['name', 'value'],
    
    data : [
        {name : 'Выход-12В №001 (V001)', value : 'V001'},
        {name : 'Выход-12В №002 (V002)', value : 'V002'},
        {name : 'Реле-220В №001 (A001)', value : 'A001'},
        {name : 'Реле-220В №002 (A002)', value : 'A002'},
        {name : 'Реле-220В №003 (A003)', value : 'A003'}
    ]
});