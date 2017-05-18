Ext.define("App.view.plan.goods.ViewPanel", {
	extend : "Ext.panel.Panel",
	alias : "widget.PlanGoodsViewPanel",

	config : {
		view : null,
		store : null
	},

	layout : "fit",
	autoScroll : true,

	initComponent : function() {
		this.store = Ext.create("App.store.plan.GoodsStore");
		this.view = this.buildView();
		this.items = this.getView();
		this.tbar = this.buildTbar();
		this.cls = this.cls + " x-view-images view-selectable";

		this.callParent(arguments);

		this.addEvents("createbtnclick", "deletebtnclick", "changevisibilitybtnclick");

		this.relayEvents(this.getView(), ["selectionchange", "itemclick"]);

		this.getView().on("refresh", this.onUpdateTotalQtyLabel, this);
		this.getView().on("selectionchange", this.onToggleBtns, this);
	},

	buildView : function() {
		return Ext.create("Ext.view.View", {
			store : this.store,
			tpl : [
					'<tpl for=".">',
					'<div class="thumb-wrap" id="{id}" style="width:80px; height:180px;">',
					   '<div class="thumb">',
					   '<a class="action-btn icon-edit" title="Редактировать">&nbsp;</a>',
					   '<img src="{image_path}">',
					'  <div class="label" title="{name}">{name}</div>',
					"</div>", "</div>", "</tpl>", '<div class="x-clear"></div>'],
			prepareData : function(data) {
				Ext.apply(data, {
					shortName : Ext.util.Format.ellipsis(data.name, 20)
				});
				return data;
			},
			multiSelect : true,
			trackOver : true,
			overItemCls : "x-item-over",
			itemSelector : "div.thumb-wrap",
			emptyText : '<p class="x-view-empty">Нет данных</p>'
		}, this);
	},

	buildTbar : function() {
		return [
            {
                text : "Добавить товар",
                iconCls : "icon-create",
                scope : this,
                handler : function() {
                    this.fireEvent("createbtnclick", this);
                }
            },
            {
                text : 'Действия',
                itemId : 'btnActions',
                disabled : true,
                iconCls : 'icon-menu',
                menu : [
                    {
                        text : 'Переместить в архив',
                        itemId : 'btnHide',
                        scope : this,
                        handler : function() {
                            this.fireEvent('changevisibilitybtnclick', this, 0);
                        }
                    },
                    {
                        text : 'Восстановить из архива',
                        itemId : 'btnShow',
                        disabled : true,
                        scope : this,
                        handler : function() {
                            this.fireEvent('changevisibilitybtnclick', this, 1);
                        }
                    },
                    '-',
                    {
                        text : "Удалить",
                        iconCls : "icon-delete",
                        scope : this,
                        handler : function() {
                            this.fireEvent("deletebtnclick", this);
                        }
                    }
                ]
            },
            {
                xtype : "uxFilterField",
                fieldLabel : "Поиск",
                labelAlign : "right",
                labelWidth : 60,
                width : 250,
                emptyText : "Введите наименование",
                editable : true,
                listeners : {
                    scope : this,
                    search : this.onChangeFilter
                }
            },
            {
                xtype : "tbspacer"
            },
            {
                xtype : 'buttongroup',
                defaults : {
                    enableToogle : true,
                    toggleGroup : 'planGoodsFilter',
                    listeners : {
                        scope : this,
                        click : function(btn) {
                            if (btn.pressed == false) {
                                btn.toggle(true);
                            } else {
                                this.onSetVisibleFilter(btn.filterValue);   
                            }
                        }
                    }
                },
                items : [
                    {
                        text : 'Активные',
                        filterValue : 1,
                        pressed : true
                    },
                    {
                        text : 'Архив',
                        filterValue : 0,
                        margin : '0 0 0 -2'
                    }
                ]
            },
            "->", 
            {
                tooltip : "Обновить",
                iconCls : "icon-refresh",
                scope : this,
                handler : this.onRefresh
            }, 
            {
                xtype : "tbspacer"
            }, 
            {
                xtype : "component",
                itemId : "Totals",
                cls : "x-component-grid-text-item",
                tpl : "Всего: <b>{count}</b>"
            }, 
            {
                xtype : "tbspacer"
            }
        ];
	},

	onRefresh : function() {
		this.getView().getSelectionModel().deselectAll();
		this.getStore().load()
	},

	onUpdateTotalQtyLabel : function() {
		var tLabel = this.down("#Totals");
		if (Ext.isEmpty(tLabel) == false) {
			var count = this.getStore().getTotalCount();
			tLabel.update({
				count : (count ? count : this.getStore().getCount())
			});
		}
	},

	onToggleBtns : function() {
		var selCount = this.getView().getSelectionModel().getCount();
		this.down("#btnActions").setDisabled(selCount < 1);
	},
    
    onSetVisibleFilter : function(value) {
        this.down('#btnShow').setDisabled(value == 1);
        this.down('#btnHide').setDisabled(value == 0);
        this.getStore().addFilter("is_active", value); 
    },

	onChangeFilter : function(value) {
		this.getStore().addFilter("name", (value) ? {
			"$like" : value
		} : null);
	}

});