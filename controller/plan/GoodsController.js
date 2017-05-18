
Ext.define('App.controller.plan.GoodsController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'plan.GoodsModel' 
    ],
    
    stores : [
        'plan.GoodsStore'
    ],
    
    views : [
        'plan.goods.ListField',
        'plan.goods.EditorWindow',
        'plan.goods.ViewPanel'    
    ],
    
    init : function() {        
        this.control({
            'PlanGoodsViewPanel' : {
                //afterrender : this.onLoadRecords,
                createbtnclick : this.onShowEditorWindow,
                deletebtnclick : this.onDeleteSelectedItems,
                itemclick : this.onItemClick,
                changevisibilitybtnclick : this.onChangeVisibilitySelectedItems
            },
            'PlanGoodsEditorWindow' : {
                selectfile : this.onUploadFile,
                savebtnclick : this.onSubmitForm
            }
        });
    },
    
    onLoadRecords : function(panel) {
        panel.getStore().load();
    },
    
    onShowEditorWindow : function(panel) {
        var win = App.ux.window.Manager.create('PlanGoodsEditorWindow');
        win.show();
        win.setMasterGrid(panel);
        return win;
    },
    
    onUploadFile : function(win, field, value) {
        var uploadForm = win.down('#uploadForm');

        win.down('form').el.mask('Загрузка файла ...');
        
        uploadForm.getForm().submit({
            url : Settings.urls.getUrl('plan.goods.upload_image'),
            success : function(form, action) {
                win.down('form').el.unmask();
                if (App.ux.util.Response.isValidStatus(action.response)) {
                    var response = Ext.decode(action.response.responseText),
                        filePath = response.file_path;
                    uploadForm.down('#previewPanel').update({path : filePath});
                    win.down('form').getForm().findField('image').setValue(filePath.substring(filePath.lastIndexOf("/")+1));
                }
            },  
            failure : function() {
                win.down('form').el.unmask();
            }
        });
    },
    
    onSubmitForm : function(win, action) {
        var form = win.down('form'),
            basicForm = form.getForm(),
            model = (basicForm.getRecord() || Ext.create('App.model.plan.GoodsModel'));

        if (basicForm.isValid()) {
            model.set(basicForm.getFieldValues());
            if (model.get('image').length < 1) {
                App.ux.Msg.alert("Выберите изображение!");
                return;
            }
            
            form.el.mask('Сохранение ...');
            model.save({
                success : function(record, operation) {
                    if (Ext.isEmpty(action) == false && action == 'close') {
                        win.hide();   
                    } else {
                        win.setTitle('Добавить товар');
                        win.onResetForm();
                        basicForm.findField('name').focus(false, 50);
                    }
                    win.getMasterGrid().getStore().load();
                },
                failure : function(record, operation) {
                    basicForm.markInvalid(operation.request.scope.reader.jsonData['errors']); 
                },
                callback : function() {
                    form.el.unmask();
                }
            });
        }
    },
    
    onItemClick : function(view, record, item, index, e) {
        if(e.target.nodeName == 'A') {
            var win = this.onShowEditorWindow(view.up('panel'));
            win.down('form').loadRecord(record);
            win.down('#previewPanel').update({path : record.get('image_path')});
            win.setTitle('Изменить товар');
        }
    },
    
    onDeleteSelectedItems : function(panel) {
        var selModel = panel.getView().getSelectionModel(),
            me = this;
            
        if (selModel.hasSelection()) {
            var selRecords = selModel.getSelection();   
        } else {
            App.ux.Msg.alert('Выберите строку для удаления!');
            return false;
        } 
        
        App.ux.Msg.confirm("Вы действительно хотите выполнить удаление?", function(btn){
            if (btn == 'yes') {
                panel.el.mask('Удаление ...');
                
                var data = App.ux.util.Format.convertRecordsToIdsArray(selRecords);
                
                Ext.Ajax.request({
                    url : selRecords[0].getProxy().api.destroy,
                    params : {records : Ext.encode(data)},
                    success : function(response) {
                        if ((response = App.ux.util.Response.isValidStatus(response))) {
                            panel.onRefresh();   
                        }
                    },
                    callback : function() {
                        panel.el.unmask();      
                    }
                });
            } 
        });
    },
    
    onChangeVisibilitySelectedItems : function(panel, isVisible) {
        
        var selModel = panel.getView().getSelectionModel(),
            me = this;
            
        if (selModel.hasSelection()) {
            var selRecords = selModel.getSelection();   
        } else {
            App.ux.Msg.alert('Не выбраны записи!');
            return false;
        }
        
        var confirmMsg = (isVisible) ? "Вы действительно хотите восстановить из архива?" : "Вы действительно хотите переместить в архив?";
        App.ux.Msg.confirm(confirmMsg, function(btn){
            if (btn == 'yes') {
                panel.el.mask('Пожалуйста подождите ...');
                
                var data = App.ux.util.Format.convertRecordsToIdsArray(selRecords);
                
                Ext.Ajax.request({
                    url : Settings.urls.getUrl('plan.goods.change_visibility'),
                    params : {records : Ext.encode(data), is_visible : isVisible},
                    success : function(response) {
                        if ((response = App.ux.util.Response.isValidStatus(response))) {
                            panel.onRefresh();   
                        }
                    },
                    callback : function() {
                        panel.el.unmask();      
                    }
                });    
                
            }
        });
    }

});