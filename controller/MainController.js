Ext.define('App.controller.MainController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'main.CatalogModel',
        'main.DashboardModel'
    ],
    
    stores : [
        'main.CatalogLocalStore',
        'main.RecentNewsLocalStore',
        'main.HelpArticlesLocalStore'
    ],
    
    views : [
        'main.catalog.GridPanel',
        'main.catalog.PreviewWindow',
        
        'main.slider.ItemContainer',
        'main.slider.CardPanel',
    
        'main.news.GridPanel',
        'main.news.PreviewPanel',
        'main.news.PreviewWindow',
        'main.news.ContentPanel',
        
        'main.help.GridPanel',
        'main.help.PreviewPanel',
        'main.help.PreviewWindow',
        'main.help.ContentPanel',
        
        'main.RecentNewsGridPanel',
        'main.FixedHelpArticlesGridPanel',
        'main.DashboardContentPanel',
        'main.ContentPanel'
    ],
    
    init : function() {
        this.control({
            'MainContentPanel' : {
                panelready : this.onInitContentPanel
            },
            'MainDashboardContentPanel' : {
                panelready : this.onLoadDashboard
            },
            'MainNewsContentPanel' : {
                panelready : this.onLoadNews
            },
            'MainNewsGridPanel' : {
                selectionchange : this.onViewNews
            },
            'MainRecentNewsGridPanel' : {
                itemclick : this.onShowNewsPreviewWindow
            },
            'MainHelpContentPanel' : {
                panelready : this.onLoadHelpArticles
            },
            'MainHelpGridPanel' : {
                selectionchange : this.onViewHelpArticle
            },
            'MainFixedHelpArticlesGridPanel' : {
                itemclick : this.onShowHelpPreviewWindow
            },
            'MainCatalogGridPanel' : {
                itemclick : this.onShowCatalogPreviewWindow
            }
        });
    },
    
    onInitContentPanel : function(panel){
        panel.down('uxCardPanel').onSwitchPanel('MainDashboardContentPanel');
    },
    
    onLoadDashboard : function(panel){
        panel.el.mask('Загрузка ...');    
        this.getModel('main.DashboardModel').load(null, {
            success : function(record) {
                panel.el.unmask(); 
                
                var newsGridPanel = panel.down('MainRecentNewsGridPanel');
                if (record.get('news').count > 0) {
                    newsGridPanel.getStore().add(record.get('news').records);
                } else {
                    newsGridPanel.hide();   
                }

                var slider = panel.down('MainSliderPanel');
                if (record.get('slider').count > 0) {
                    slider.addItems(record.get('slider').records); 
                } else {
                    slider.hide();    
                }
                   
                var catalogGridPanel = panel.down('MainCatalogGridPanel');
                if (record.get('catalog').count > 0) {
                    catalogGridPanel.getStore().add(record.get('catalog').records);
                } else {
                    catalogGridPanel.hide();    
                }
                
                var helpArticlesGridPanel = panel.down('MainFixedHelpArticlesGridPanel');
                if (record.get('help_articles').count > 0) {
                    helpArticlesGridPanel.getStore().add(record.get('help_articles').records);    
                } else {
                    helpArticlesGridPanel.hide();    
                }
                
                panel.isReady = true;
                   
            }
        });
    },
    
    onShowNewsPreviewWindow : function(grid, record){
        var win = App.ux.window.Manager.create('MainNewsPreviewWindow');
        win.show();
        
        var view = win.down('#viewPanel');
        
        view.el.mask('Загрузка ...');
        App.model.main.directories.NewsModel.load(record.get('id'), {
            success : function(record){
                view.update(record.getData());
            },
            callback : function(){
                view.el.unmask();
            }
        });
    },
    
    onLoadNews : function(panel) {
        panel.down('#list').onRefresh();
        panel.isReady = true;
    },
    
    onViewNews : function(selModel, selected, opts){
        var list = selModel.view.ownerCt,
            view = list.nextSibling('#view');
        
        if (selected.length) {
            view.el.mask('Загрузка ...');
            App.model.main.directories.NewsModel.load(selected[0].get('id'), {
                success : function(record){
                    view.update(record.getData());
                },
                callback : function(){
                    view.el.unmask();
                }
            });
        } else {
            view.update(null);    
        }
    },
    
    onLoadHelpArticles : function(panel) {
        panel.down('#list').onRefresh();
        panel.isReady = true;
    },
    
    onViewHelpArticle : function(selModel, selected, opts){
        var list = selModel.view.ownerCt,
            view = list.nextSibling('#view');
        
        if (selected.length) {
            view.el.mask('Загрузка ...');
            App.model.main.directories.HelpArticleModel.load(selected[0].get('id'), {
                success : function(record){
                    view.update(record.getData());
                },
                callback : function(){
                    view.el.unmask();
                }
            });
        } else {
            view.update(null);    
        }
    },
    
    onShowHelpPreviewWindow : function(grid, record){
        var win = App.ux.window.Manager.create('MainHelpPreviewWindow');
        win.show();
        
        var view = win.down('#viewPanel');
        
        view.el.mask('Загрузка ...');
        App.model.main.directories.HelpArticleModel.load(record.get('id'), {
            success : function(record){
                view.update(record.getData());
            },
            callback : function(){
                view.el.unmask();
            }
        });
    },
    
    onShowCatalogPreviewWindow : function(grid, record){
        var win = App.ux.window.Manager.create('MainCatalogPreviewWindow');
        win.show();
        
        var view = win.down('#viewPanel');
        
        view.el.mask('Загрузка ...');
        App.model.catalog.MaterialModel.load(record.get('id'), {
            success : function(record){
                view.down('#headerPanel').update(record.getData());
                view.down('#descriptionPanel').update({description : record.get('description')});
                view.down('#imagesPanel').getStore().loadRecords(record.getImages().getRange());
                
                record.getFiles().filter('type', 'file');
                view.down('#filesGrid').getStore().loadRecords(record.getFiles().getRange());
                
                record.getFiles().clearFilter();
                record.getFiles().filter('type', 'video');
                view.down('#videosGrid').getStore().loadRecords(record.getFiles().getRange());   
            },
            callback : function(){
                view.el.unmask();
            }
        });
    }
    
});