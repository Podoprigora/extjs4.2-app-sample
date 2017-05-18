Ext.define('App.controller.main.HelpArticlesController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'main.directories.HelpArticleModel'    
    ],
    
    stores : [
        'main.directories.HelpArticlesStore'    
    ],
    
    views : [
        'main.directories.help_articles.EditorFormPanel',
        'main.directories.help_articles.GridPanel'
    ],
    
    init : function(){
        this.control({
            'MainDirectoryHelpArticleEditorFormPanel' : {
                savebtnclick : this.onSave,
                cancelbtnclick : this.onRemoveEditorForm,
                uploadfile : this.onUploadFile
            },
            'MainDirectoryHelpArticlesGridPanel' : {
                createbtnclick : this.onCreate,
                editbtnclick : this.onEdit,
                itemdblclick : function(view){
                    this.onEdit(view.ownerCt);
                },
                changevisibilitybtnclick : this.onChangeVisibility,
                changedashboardvisibilitybtnclick : this.onChangeDashboardVisibility,
                deletebtnclick: Ext.bind(App.ux.controller.BaseMethods.onDelete, this),
                showgroupbtnclick : this.onCreateGroupTab
            }
        });
    },
    
    onCreateGroupTab : function(grid){
        var tabPanel = grid.up('uxTabPanel');
        tabPanel.addTab('MainDirectoryHelpGroupsGridPanel', 'Помощь :: Группы', 'icon-app-table');
    },
    
    onCreate : function(grid){
        var tabPanel = grid.up('uxTabPanel'),
            form = tabPanel.down('#newHelpArticleForm');
            
        if (Ext.isEmpty(form)) {
            form = tabPanel.add({
                xtype : 'MainDirectoryHelpArticleEditorFormPanel',
                itemId : 'newHelpArticleForm',
                title : 'Помощь :: Новая статья',
                iconCls : 'icon-create-gray',
                closable : true
            });    
        }
        tabPanel.setActiveTab(form);
        form.getForm().findField('group_id').focus(false, 200);
    },
    
    onEdit : function(grid) {
        var tabPanel = grid.up('uxTabPanel'),
            selModel = grid.getSelectionModel(),
            selRecord = selModel.getSelection()[0],
            form = tabPanel.down(Ext.String.format('panel[newsId={0}]', selRecord.get('id')));
        
        if (Ext.isEmpty(form)) {
            form = tabPanel.add({
                xtype : 'MainDirectoryHelpArticleEditorFormPanel',
                title : "Помощь :: " + Ext.String.ellipsis(selRecord.get('title'), 40),
                iconCls : 'icon-edit',
                closable : true,
                newsId : selRecord.get('id')
            });    
        }
        
        tabPanel.setActiveTab(form);
        form.el.mask('Загрузка ...');
        
        this.getModel('main.directories.HelpArticleModel').load(selRecord.get('id'), {
            success : function(record){
                form.el.unmask();
                form.getForm().loadRecord(record);
                form.getForm().findField('is_archive').setValue(record.get('is_active') ? false : true);
            },
            failure : function(){
                tabPanel.remove(form);
            }
        });
        
    },
    
    onSave : function(form, mode){
        var basicForm = form.getForm(),
            record = Ext.create('App.model.main.directories.HelpArticleModel'),
            me = this;
        
        if (basicForm.isValid()) {
            
            record.set(basicForm.getValues());
            
            var isArchive = basicForm.findField('is_archive').getValue();
            record.set('is_active', isArchive ? 0 : 1);
            
            form.el.mask('Сохранение ...');
            
            record.save({
                success : function(){
                    var tabPanel = form.up('uxTabPanel'),
                        grid = tabPanel.down('MainDirectoryHelpArticlesGridPanel');
                    
                    tabPanel.remove(form);
                    
                    if (Ext.isEmpty(grid) == false) {
                        grid.onRefresh();
                        
                        if (Ext.isEmpty(mode)) {
                            me.onCreate(grid);       
                        }
                    }
                },
                callback : function(){
                    form.el.unmask();
                }
            });
        }
    },
    
    onRemoveEditorForm : function(form){
         form.up('uxTabPanel').remove(form);
    },
    
    onChangeVisibility : function(grid, isActive) {
        var selModel = grid.getSelectionModel(),
            me = this;
            
        if (selModel.hasSelection()) {
            var selRecords = selModel.getSelection();   
        } else {
            App.ux.Msg.alert('Не выбраны записи!');
            return false;
        }
        
        var confirmMsg = (isActive) ? "Вы действительно хотите восстановить из архива?" : "Вы действительно хотите переместить в архив?";
        App.ux.Msg.confirm(confirmMsg, function(btn){
            if (btn == 'yes') {
                grid.el.mask('Пожалуйста подождите ...');
                
                var data = App.ux.util.Format.convertRecordsToIdsArray(selRecords);
                
                Ext.Ajax.request({
                    url : Settings.urls.getUrl('main.directories.help_articles.change_visibility'),
                    params : {
                        records : Ext.encode(data), 
                        is_visible : isActive
                    },
                    success : function(response) {
                        if ((response = App.ux.util.Response.isValidStatus(response))) {
                            grid.onRefresh();   
                        }
                    },
                    callback : function() {
                        grid.el.unmask();      
                    }
                });    
                
            }
        });    
    },
    
    onChangeDashboardVisibility : function(grid, isVisible){
        var selModel = grid.getSelectionModel(),
            me = this;
            
        if (selModel.hasSelection()) {
            var selRecords = selModel.getSelection();   
        } else {
            App.ux.Msg.alert('Не выбраны записи!');
            return false;
        }
        
        var confirmMsg = (isVisible) ? "Вы действительно хотите добавить на рабочий стол выбранные статьи?" : "Вы действительно хотите удалить с рабочего стола выбранные статьи?";
        App.ux.Msg.confirm(confirmMsg, function(btn){
            if (btn == 'yes') {
                grid.el.mask('Пожалуйста подождите ...');
                
                var data = App.ux.util.Format.convertRecordsToIdsArray(selRecords);
                
                Ext.Ajax.request({
                    url : Settings.urls.getUrl('main.directories.help_articles.change_dashboard_visibility'),
                    params : {
                        records : Ext.encode(data), 
                        is_visible : isVisible
                    },
                    success : function(response) {
                        if ((response = App.ux.util.Response.isValidStatus(response))) {
                            grid.onRefresh();   
                        }
                    },
                    callback : function() {
                        grid.el.unmask();      
                    }
                });    
                
            }
        });
    },
    
    onUploadFile : function(form, fileField){
        var waitingSec = 0,
            taskRunQty = 0;
        
        Ext.util.TaskManager.start({
            run : function(){
                waitingSec = Ext.Number.randomInt(taskRunQty*10, taskRunQty*10+9);
                fileField.previewInput.dom.value = Ext.String.format("Загрузка изображения ({0}%) ...", waitingSec);
                taskRunQty ++;
            },
            interval : 2500,
            duration : 22500
        });

        form.getForm().submit({
            url : Settings.urls.getUrl('main.directories.help_articles.upload_image'),
            success : function(form, action){
                Ext.util.TaskManager.stopAll();
                if (App.ux.util.Response.isValidStatus(action.response)) {
                    var response = Ext.decode(action.response.responseText);
                    fileField.previewInput.dom.value = window.location.origin + response.path;    
                } else {
                    fileField.previewInput.dom.value = "Ошибка загрузки!";
                }
            },
            failure : function(){
                Ext.util.TaskManager.stopAll();
                fileField.previewInput.dom.value = "Ошибка загрузки!";   
            }
        });
    }

});