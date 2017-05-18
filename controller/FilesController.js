Ext.define('App.controller.FilesController', {
    extend : 'Ext.app.Controller',
    
    models: [
        "files.FileModel",
        "files.ImageModel"
    ],
    stores: [
        "files.FilesLocalStore",
        "files.ImagesLocalStore"
    ],
    views: [
        "files.EditorGridPanel",
        "files.ImagesEditorPanel",
        "files.ImagesViewerWindow"
    ],
    
    init: function () {
        this.control({
            'FilesEditorGridPanel': {
                selectfile: this.onUploadFile,
                deleteitem: this.onDeleteFile,
                cellclick: this.onDownloadFile
            },
            'ImagesEditorPanel' : {
                selectfile : this.onUploadImage,
                viewitembtnclick : this.onPreviewImage,
                deleteitembtnclick : this.onDeleteFile
            }
        });
    },
    
    onUploadFile : function (grid, field, value) {
        var uploadUrl = grid.getUploadUrl(),
            form = grid.down("#uploadForm"),
            model = Ext.create("App.model.files.FileModel");
        
        if (Ext.isEmpty(uploadUrl)) {
            App.ux.Msg.alert('Не задан URL!');
            return false;
        }
        
        if (value) {
            var fileName = value.match(/[^\\]+$/gi)[0];
            
            if (grid.getStore().findRecord('client_name', fileName)) {
                App.ux.Msg.alert(Ext.String.format("Файл <b>{0}</b> уже загружен!", fileName));    
                return false;
            }
            
            grid.el.mask("Загрузка файла ...");
            form.getForm().submit({
                url: uploadUrl,
                success: function (form, action) {
                    grid.el.unmask();
                    if (App.ux.util.Response.isValidStatus(action.response)) {
                        var response = Ext.decode(action.response.responseText);
                        model.set("client_name", fileName);
                        model.set("server_name", response.server_name);
                        grid.getStore().add(model);
                    }
                },
                failure: function () {
                    grid.el.unmask()
                }
            });
        }
    },
    
    onDeleteFile : function (grid, record) {
        App.ux.Msg.confirm("Вы действительно хатите выполнить удаление?", function (btn) {
            if (btn == "yes") {
                record.set("removed", 1);
                grid.getStore().remove(record);
            }
        })
    },
    
    onDownloadFile : function (view, td, cellIndex, record, tr, rowIndex, e) {
        var url = view.ownerCt.getDownloadUrl();
        if (Ext.isEmpty(url)) {
            App.ux.Msg.alert('Не задан URL!');
            return false;
        }
        if (e.target.nodeName == "A") {
            window.open(url + "?file=" + record.get("server_name"));
        }
    },
    
    onPreviewImage : function (panel, record, index) {
        var url = panel.getPreviewUrl(),
            store = panel.getStore();
            
        if (Ext.isEmpty(url) == false) {
            
            if (Ext.isIE8m && Ext.isEmpty(record.get("image")) == false) {
                window.open(url + "?image=" + record.get("image"));   
            } else {
                var images = [],
                    attributes = [];
            
                store.each(function(item){
                    images.push(url + "?image=" + item.get("image"));
                });
                
                var win = App.ux.window.Manager.create('ImagesViewerWindow'),
                    viewer = win.getViewer(),
                    me = this;
                    
                win.setWidth(Ext.getBody().getWidth() >= 1000 ? 1000 : Ext.getBody().getWidth() - 20);
                win.setHeight(Ext.getBody().getHeight() >= 750 ? 750 : Ext.getBody().getHeight() - 20);
            
                viewer.setImages(images);

                win.getViewer().setAttributes(null);
                
                /*viewer.setAttributes([
                    'Петров Сергей | 30.06.2016 05:12:33 | Местоположение: <a href="javaScript:void(0)" class="lk-image-geo" data-qtip="Показать на карте">50.8282141;34.9631544</a>',
                    'Петров Сергей | 30.06.2016 05:14:10 | Местоположение: <a href="javaScript:void(0)" class="lk-image-geo" data-qtip="Показать на карте">55.79544640845877;37.93967784880916</a>'
                ]);*/

                /*win.show(null, function(){
                    if (Ext.isEmpty(win.isCreated)) {
                        viewer.el.on('click', function(e, target){
                            me.onShowLocationWindow(target.text);  
                        }, null, {delegate : 'a.lk-image-geo'}); 
                    }
                    win.isCreated = true;
                });*/
                
                viewer.setImageIndex(index);

                win.show();
            }
        }
    },
    
    onUploadImage : function(panel, field, value) {
        var uploadForm = panel.down('#uploadForm'),
            uploadUrl = panel.getUploadUrl();
        
        
        if (Ext.isEmpty(uploadUrl)) {
            App.ux.Msg.alert('Не задан URL!');
            return false;
        }
        
        panel.el.mask('Загрузка ...');

        uploadForm.getForm().submit({
            url : uploadUrl,
            success : function(form, action) {
                panel.el.unmask();
                if (App.ux.util.Response.isValidStatus(action.response)) {
                    var response = Ext.decode(action.response.responseText),
                        imagePath = response.image,
                        imageModel = Ext.create('App.model.files.ImageModel', {
                            image : response.image
                        });

                    imageModel.setDirty();
                    if (panel.getMultiple() == false) {
                        panel.getStore().removeAll();
                    }
                    panel.getStore().add(imageModel);
                }
            },  
            failure : function() {
                panel.el.unmask();
            }
        });
    },
    
    onShowLocationWindow : function(gps){
        var win = Ext.create('Ext.window.Window', {
            title : 'Местоположние',
            shadow : 'frame',
            shadowOffset : 25,
            modal : true,
            resizable : true,
            maximizable : true,
            layout : 'fit',
            width : 800,
            height : 600,
            items : [
                {
                    xtype : 'component',
                    autoEl : {
                        tag : 'iframe',
                        frameborder : '0',
                        src : Ext.String.format("{0}?objects={1}", Settings.urls.bids.get_locations, gps.replace(",",";")) 
                    }
                }
            ]
        });
        
        win.show();
    }
    
});