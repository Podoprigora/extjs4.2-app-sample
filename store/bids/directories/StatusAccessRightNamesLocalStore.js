Ext.define('App.store.bids.directories.StatusAccessRightNamesLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.bids.directories.StatusAccessRightNameModel',

    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    },
    
    data : [
        {
            name : 'edit_fields',
            title : 'Редактирование текстовых полей'
        },
        {
            name : 'edit_tasks',
            title : 'Редактирование списка задач'
        },
        {
            name : 'edit_materials',
            title : 'Редактирование списка материалов'
        },
        {
            name : 'edit_finances',
            title : 'Редактирование финансового блока'
        },
        {
            name : 'add_performance_report',
            title : 'Внесение отчета о выполнении'
        },
        {
            name : 'output_finance_report',
            title : 'Вывод в табель'
        },
        {
            name : 'allow_mobapi_request',
            title : 'Транслировать в мобильное приложение'
        }
    ]
    
});