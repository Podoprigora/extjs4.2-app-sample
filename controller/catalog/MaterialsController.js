Ext.define('App.controller.catalog.MaterialsController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'catalog.MaterialFileModel',
        'catalog.MaterialImageModel',
        'catalog.MaterialCodeModel',
        'catalog.MaterialModel'
    ],
    
    stores : [
        'catalog.MaterialFilesLocalStore',
        'catalog.MaterialCodesStore',
        'catalog.MaterialCodesLocalStore',
        'catalog.MaterialImagesLocalStore',
        'catalog.MaterialsStore'
    ],
    
    views : [
        'catalog.materials.VideoPlayerWindow',
    
        'catalog.materials.FilesGridPanel',
        'catalog.materials.VideosGridPanel',
        'catalog.materials.ViewPanel',    
    
        'catalog.materials.FileEditorWindow',
        'catalog.materials.FilesEditorGridPanel',
        'catalog.materials.VideosEditorGridPanel',
    
        'catalog.materials.ListField',
        'catalog.materials.CodesEditorGridPanel',
        'catalog.materials.ImagesEditorPanel',
        'catalog.materials.EditorFormPanel',
        'catalog.materials.GridPanel',
        'catalog.materials.CodesGridPanel',
        'catalog.materials.FiltersFormPanel',
        'catalog.materials.ContentPanel'
    ],
    
    init : function() {
        
        this.control({
            'CatalogContentPanel' : {
                panelready : this.onInitContentPanel
            },
            'CatalogMaterialCodesEditorGridPanel' : {
                selectcodefromdirectory : this.onSelectMaterialCodeFromDirectory
            },
            'CatalogMaterialEditorFormPanel' : {
                savebtnclick : this.onSave,
                cancelbtnclick : this.onCloseEditorMaterialTab
            },
            'CatalogMaterialsGridPanel' : {
                createbtnclick : this.onCreateNewMaterialTab,
                editbtnclick : this.onCreateEditorMaterialTab,
                itemdblclick : function(view, record, item, index, e) {
                    this.onCreateEditorMaterialTab(view.ownerCt);   
                },
                deletebtnclick : Ext.bind(App.ux.controller.BaseMethods.onDelete, this),
                showgroupbtnclick : this.onCreateGroupEditorTab,
                selectionchange : this.onMaterialItemSelectionChange,
                filterbtnclick : this.onToggleFiltersPanel
            },
            'CatalogMaterialsFilterFormPanel' : {
                setfilter : this.onSetFilters
            },
            'CatalogMaterialFilesEditorGridPanel' : {
                addbtnclick : Ext.bind(this.onShowFileEditorWindow, this, ['file'], 1),
                downloadbtnclick : this.onDownloadMaterialFile
            },
            'CatalogMaterialFilesGridPanel' : {
                downloadbtnclick : this.onDownloadMaterialFile,
                itemdblclick : this.onDownloadMaterialFile
            },
            'CatalogMaterialVideosEditorGridPanel' : {
                addbtnclick : Ext.bind(this.onShowFileEditorWindow, this, ['video'], 1),
                downloadbtnclick : this.onDownloadMaterialFile,
                playbtnclick : this.onShowVideoPlayerWindow
            },
            'CatalogMaterialVideosGridPanel' : {
                downloadbtnclick : this.onDownloadMaterialFile,
                itemdblclick : this.onShowVideoPlayerWindow,
                playbtnclick : this.onShowVideoPlayerWindow
            },
            'CatalogMaterialFileEditorWindow' : {
                uploadbtnclick : this.onUploadMaterialFile
            }
        });
        
    },
    
    onInitContentPanel : function(panel) {
        var grid = panel.down('CatalogMaterialsGridPanel');
        grid.getStore().load();
    },
    
    onSetFilters : function(form, filter) {
        var grid = form.up().down('#materialsGrid');
        grid.getStore().addFilter(filter.property, filter.value);
    },
    
    onToggleFiltersPanel : function(grid, btn) {
        var form = grid.up('#contentPanel').down('#filtersForm');
        form.setVisible(btn.pressed);
    },
    
    onCreateGroupEditorTab : function(grid) {
        var tabPanel = grid.up('tabpanel');
        tabPanel.addTab('CatalogGroupsEditorTreePanel', 'Редактор категорий', 'icon-tree');
    },
    
    onMaterialItemSelectionChange : function(selModel, records) {
        var selRecord = records[0],
            grid = selModel.view.ownerCt,
            previewPanel = grid.up().down('#previewPanel');
        
        previewPanel.setDisabled((records.length != 1));
        
        function updatePanelData(panel, record){
            panel.down('#headerPanel').update(record.getData());
            panel.down('#descriptionPanel').update({description : record.get('description')});
            panel.down('#imagesPanel').getStore().loadRecords(record.getImages().getRange());
            
            record.getFiles().filter('type', 'file');
            panel.down('#filesGrid').getStore().loadRecords(record.getFiles().getRange());
            
            record.getFiles().clearFilter();
            record.getFiles().filter('type', 'video');
            panel.down('#videosGrid').getStore().loadRecords(record.getFiles().getRange());
            
            panel.down('#codesGrid').getStore().loadRecords(record.getCodes().getRange());
        };
        
        if (records.length == 1) {
            previewPanel.el.mask('Загрузка ...');
            this.getModel('catalog.MaterialModel').load(selRecord.get('id'), {
                success : function(record){
                    record.set('group_name', selRecord.get('group_name'));
                    updatePanelData(previewPanel, record);    
                },
                callback : function(){
                    previewPanel.el.unmask();
                }
            });
        } else {
            updatePanelData(previewPanel, Ext.create('App.model.catalog.MaterialModel'));    
        }

    },
    
    onCreateNewMaterialTab : function(grid) {
        var tabPanel = grid.up('tabpanel'),
            form = tabPanel.down('#newMaterialForm');
        
        if (Ext.isEmpty(form)) {
            tabPanel.animateAdd({
                xtype : 'CatalogMaterialEditorFormPanel',
                title : 'Новая карточка',
                itemId : 'newMaterialForm',
                iconCls : 'icon-create-gray'    
            }, function(form){
                form.getForm().findField('name').focus(false, 200);    
            });
        } else {
            tabPanel.setActiveTab(form);    
        }
        
        return form;
    },
    
    onCreateEditorMaterialTab : function(grid) {
        var tabPanel = grid.up('tabpanel'),
            record = grid.getSelectionModel().getSelection()[0],
            form = tabPanel.down(Ext.String.format("panel[materialId={0}]", record.get('id'))),
            me = this;
        
        if (Ext.isEmpty(form) == false) {
            tabPanel.setActiveTab(form);
            return false;
        }
        
        tabPanel.animateAdd({
            xtype : 'CatalogMaterialEditorFormPanel',
            materialId : record.get('id'),
            title : Ext.util.Format.ellipsis(record.get('name'), 25),
            tooltip : Ext.String.format("Редактирование: {0}", record.get('name')),
            iconCls : 'icon-edit'   
        }, function(form){
            form.el.mask('Загрузка ...');
            me.getModel('catalog.MaterialModel').load(record.get('id'), {
                success : function(record) {
                    form.el.unmask(); 
                    form.down('#codesGrid').getStore().loadRecords(record.getCodes().getRange());
                    form.down('#imagesPanel').getStore().loadRecords(record.getImages().getRange());

                    record.getFiles().filter('type', 'file');
                    form.down('#filesGrid').getStore().loadRecords(record.getFiles().getRange());
                    
                    record.getFiles().clearFilter();
                    record.getFiles().filter('type', 'video');
                    form.down('#videosGrid').getStore().loadRecords(record.getFiles().getRange());
                    
                    form.getForm().loadRecord(record);
                },
                failure : function() {
                    tabPanel.remove(form);
                }
            });   
        });
    },
    
    onCloseEditorMaterialTab : function(form) {
        var tabPanel = form.up('tabpanel');
        tabPanel.remove(form);
    },
    
    onSave : function(form, action) {
        var basicForm = form.getForm(),
            imagesPanel = form.down('#imagesPanel'),
            codesGrid = form.down('#codesGrid'),
            filesGrid = form.down('#filesGrid'),
            videosGrid = form.down('#videosGrid'),
            record = Ext.create('App.model.catalog.MaterialModel'),
            me = this;
        
        if (basicForm.isValid()) {

            if (codesGrid.getStore().getCount() == 0) {
                App.ux.Msg.alert('Необходимо добавить складские позиции!');
                return false;
            }
            
            record.set(basicForm.getFieldValues());
            record.setAssociationData('codes', codesGrid.getStore().getModifiedData());
            record.setAssociationData('images', imagesPanel.getStore().getModifiedData());
            record.setAssociationData('files', Ext.Array.merge(filesGrid.getStore().getModifiedData(), videosGrid.getStore().getModifiedData()));
            
            form.el.mask('Сохранение ...');
            
            record.save({
                success : function(record) {
                    var tabPanel = form.up('tabpanel'),
                        materialsGrid = tabPanel.down('CatalogMaterialsGridPanel');
                    
                    form.el.unmask(); 
                    tabPanel.remove(form);
                    materialsGrid.onRefresh();
                     
                    if (Ext.isEmpty(action)) {
                        form = me.onCreateNewMaterialTab(materialsGrid); 
                    }
                },
                failure : function() {
                    form.el.unmask();    
                }
            });
            
        }    
    }, 
    
    onSelectMaterialCodeFromDirectory : function(grid, field, record) {
        
        var kitField = grid.down('#kitField');
        
        if (grid.getStore().findRecord('code_id', record.get('id')) == null) {
            var model = Ext.create('App.model.catalog.MaterialCodeModel', {
                kit : kitField.getValue(),
                code_id : record.get('id'),
                code : record.get('code'),
                name : record.get('name')
            });
            model.setDirty();
            grid.getStore().add(model);
            
            grid.getView().refresh();
        }
    },
    
    onShowFileEditorWindow : function(grid, type){        
        var win = App.ux.window.Manager.create('CatalogMaterialFileEditorWindow');
        win.show();

        win.setTitle(((type == 'video') ? 'Добавить видео файл (*.mp4, *.flv)' : 'Добавить файл'));
        win.setMasterGrid(grid);
        win.down('form').getForm().findField('type').setValue(type);
    },
    
    onUploadMaterialFile : function(win){
        var form = win.down('form'),
            model = Ext.create('App.model.catalog.MaterialFileModel'),
            editorGrid = win.getMasterGrid();
        
        if (form.getForm().isValid()) {
            win.el.mask("Загрузка файла ...");
            
            form.getForm().submit({
                url : Settings.urls.getUrl('catalog.materials.upload_file'),
                success : function(basicForm, action){
                    
                    win.el.unmask();
                    
                    if (App.ux.util.Response.isValidStatus(action.response)) {
                        var response = Ext.decode(action.response.responseText);
                        model.set('file', response.file);
                        model.set('created', response.created);
                        model.set('type', basicForm.findField('type').getValue());
                        model.set('description', basicForm.findField('description').getValue());
                        
                        win.getMasterGrid().getStore().add(model);
                        win.hide();
                    }   
                },
                failure : function(basicForm, action){
                    win.el.unmask();
                }
            });
        }
    },
    
    onDownloadMaterialFile : function(grid, record){
        window.open(Settings.urls.getUrl('catalog.materials.download_file') + "?file=" + record.get('file'));
    },
    
    onShowVideoPlayerWindow : function(grid, record){
        var win = App.ux.window.Manager.create('CatalogMaterialVideoPlayerWindow');
        win.show();
        win.setTitle(record.get('description'));
        win.setVideoParams({
            id : record.get('id'), 
            src : window.location.origin + '/upload_files/catalog_materials/' + record.get('file'), 
            auto_play: true
        });
    }
    
});