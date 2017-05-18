Ext.define('App.controller.main.SlidersController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'main.directories.SliderModel'
    ],
    
    stores : [
        'main.directories.SlidersStore'
    ],
    
    views : [
        'main.directories.sliders.EditorFormPanel',
        'main.directories.sliders.GridPanel'    
    ],
    
    init : function() {
        this.control({
            'MainDirectorySliderEditorFormPanel' : {
                savebtnclick : this.onSave,
                selectimage : this.onUploadImage,
                cancelbtnclick : this.onRemoveEditorForm
            },
            'MainDirectorySlidersGridPanel' : {
                createbtnclick : this.onCreate,
                editbtnclick : this.onEdit,
                itemdblclick : function(view){
                    this.onEdit(view.ownerCt);
                },
                changevisibilitybtnclick : this.onChangeVisibility,
                deletebtnclick: Ext.bind(App.ux.controller.BaseMethods.onDelete, this)
            }
        });
    },
    
    onCreate : function(grid){
        var tabPanel = grid.up('uxTabPanel'),
            form = tabPanel.down('#newSliderForm');
            
        if (Ext.isEmpty(form)) {
            form = tabPanel.add({
                xtype : 'MainDirectorySliderEditorFormPanel',
                itemId : 'newSliderForm',
                title : 'Добавить слайдер',
                iconCls : 'icon-create-gray',
                closable : true
            });    
        }
        tabPanel.setActiveTab(form);
    },
    
    onEdit : function(grid) {
        var tabPanel = grid.up('uxTabPanel'),
            selModel = grid.getSelectionModel(),
            selRecord = selModel.getSelection()[0],
            form = tabPanel.down(Ext.String.format('panel[sliderId={0}]', selRecord.get('id')));
        
        if (Ext.isEmpty(form)) {
            form = tabPanel.add({
                xtype : 'MainDirectorySliderEditorFormPanel',
                title : Ext.String.ellipsis(selRecord.get('name'), 40),
                iconCls : 'icon-edit',
                closable : true,
                sliderId : selRecord.get('id')
            });    
        }
        
        tabPanel.setActiveTab(form);
        form.el.mask('Загрузка ...');
        
        this.getModel('main.directories.SliderModel').load(selRecord.get('id'), {
            success : function(record){
                //Fix rendered issue (FF)
                Ext.defer(function(){
                    form.down('#imagePreview').update({
                        image_path : record.get('image_path'),
                        text : record.get('text')
                    });
                    form.el.unmask();
                }, 1000);
                
                form.getForm().loadRecord(record);
                form.getForm().findField('is_archive').setValue(record.get('is_active') ? false : true);
            },
            failure : function(){
                tabPanel.remove(form);
            }
        });
    },
    
    onSave : function(form, mode){
        var model = Ext.create('App.model.main.directories.SliderModel'),
            me = this;
        
        if (form.getForm().isValid()) {
            model.set(form.getForm().getFieldValues());
            
            var isArchive = form.getForm().findField('is_archive').getValue();
            model.set('is_active', isArchive ? 0 : 1);
            
            var modelErrors = model.validate();
            if (modelErrors.getCount() > 0) {
                App.ux.Msg.alert(modelErrors.first().message);
                return false;
            }
            
            form.el.mask('Сохранение ...');
            
            model.save({
                success : function() {
                    var tabPanel = form.up('uxTabPanel'),
                        grid = tabPanel.down('MainDirectorySlidersGridPanel');
                    
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
    
    onUploadImage : function(form, field, value) {
        var uploadForm = form.down('#uploadForm');

        form.el.mask('Загрузка изображения ...');
        
        uploadForm.getForm().submit({
            url : Settings.urls.getUrl('main.directories.sliders.upload_image'),
            success : function(uploadForm, action) {
                form.el.unmask();
                if (App.ux.util.Response.isValidStatus(action.response)) {
                    var response = Ext.decode(action.response.responseText),
                        imagePath = response.path;
                    form.down('#imagePreview').update({image_path : imagePath});
                    form.getForm().findField('image_path').setValue(imagePath);
                }
            },  
            failure : function() {
                form.el.unmask();
            }
        });
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
                    url : Settings.urls.getUrl('main.directories.sliders.change_visibility'),
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
    
    onRemoveEditorForm : function(form){
         form.up('uxTabPanel').remove(form);
    }
    
});