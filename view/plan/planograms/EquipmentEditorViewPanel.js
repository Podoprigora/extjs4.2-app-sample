Ext.define("App.view.plan.planograms.EquipmentEditorViewPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.PlanogramEquipmentEditorViewPanel",
    
    config: {
        view: null,
        store: null,
        equipmentRecord : null,
        showAd : false
    },
    
    autoScroll: true,
    trackOver: true,
    overItemCls: "x-column-over",
    selectedItemCls: "x-column-selected",
    
    initComponent: function () {
        this.store = Ext.create("App.store.plan.PlanogramGoodsLocalStore");
        this.equipmentRecord = Ext.create('App.model.plan.PlanogramEquipmentModel');
        this.tbar = this.buildTbar();
        
        this.callParent(arguments);
        
        this.addEvents("additembtnclick", "deleteitembtnclick", "addgoodsbtnclick", "deletebtnclick", "copybtnclick");
        
        this.on('show', this.showAdTitle, this, {single : true});
    },
    
    afterRender: function (a) {
        this.callParent(arguments);
        
        this.mon(this.getStore(), "datachanged", this.onStoreDataChanged, this);
    },
    
    buildTbar: function () {
        return [
            {
                text: "Добавить товары",
                itemId: "btnAdd",
                iconCls: "icon-create",
                //disabled: true,
                scope: this,
                handler: function () {
                    this.fireEvent("addgoodsbtnclick", this);
                }
            },
            ' ',
            {
                text : 'Создать копию',
                iconCls : 'icon-doc-copy',
                scope : this,
                handler : function() {
                    this.fireEvent('copybtnclick', this);
                }
            },
            {
                text : 'Удалить',
                iconCls : 'icon-delete',
                scope : this,
                handler : function() {
                    this.fireEvent('deletebtnclick', this);
                }
            }
        ];
    },
    
    buildTpl: function () {
        return [
            '<div class="x-ad-wrap">ВСТАВКА</div>',
            '<tpl for=".">', 
                '<tpl if="xindex === 1">', 
                    ' <div class="x-row"> ', 
                "</tpl>", 
                '<div class="x-column <tpl if=\"pusher == -1\">x-column-ad</tpl>">', 
                '<div class="x-column-wrap-fixed">', 
                    '<tpl if="pusher != -1">',
                        '<div class="label-top" data-qtip="PUSH #{[this.indexRenderer(values.pusher)]}">#{[this.indexRenderer(values.pusher)]}</div>', 
                        '<tpl if="goods_id === 0">', 
                            '<a href="javaScript:void(0);" class="x-btn-create" data-qtip="Добавить товар">&nbsp;</a>', 
                        '<tpl else>', 
                            '<a class="x-btn-action icon-delete" data-qtip="Удалить">&nbsp;</a>', 
                            '<img src="{goods_image}" data-qtip="{goods_name}">', 
                        "</tpl>",
                    '</tpl>',
                "</div>", 
                "</div>", 
                '<tpl if="xindex % this.columnsLength === 0">', 
                    " </div> ", 
                "</tpl>", 
                '<tpl if="xindex % this.columnsLength === 0 && xindex <= xcount">', 
                    ' <div class="x-row"> ', 
                "</tpl>", 
                "</tpl>", 
                '<div class="x-clear"></div>'
        ];
    },
    
    buildView: function (columnsLength) {
        var tpl = this.buildTpl();
        tpl.push({
            columnsLength: columnsLength,
            indexRenderer : function(pusher) {
                return (parseInt(pusher) < 10) ? ("0" + pusher) : pusher;
            }
        });
        return Ext.create("Ext.view.View", {
            itemId: "dataView",
            store: this.getStore(),
            tpl: tpl,
            prepareData: this.onViewPrepareData,
            trackOver: this.trackOver,
            overItemCls: this.overItemCls,
            selectedItemCls: this.selectedItemCls,
            itemSelector: ".x-column",
            cls: "x-block-items-view",
            listeners: {
                scope: this,
                itemclick: this.onViewItemClick
            }
        }, this);
    },
    
    reconfigure: function (records, columnsLength, startIndex) {
        
        if (this.getView()) {
            this.getView().destroy();
        }
        
        this.getStore().loadRecords(records);
        this.view = this.buildView(columnsLength);
        this.add(this.view);
        this.getView().refresh();
        
        this.showAdTitle();
    },
    
    showAdTitle : function() {
        
        if (this.isVisible() == false || this.showAd) {
            return false;
        }
        
        Ext.defer(function(){
            var adRecord = this.getStore().findRecord('pusher', -1),
                startIndex = this.getEquipmentRecord().get('equipment').start_index;
                
            if (Ext.isEmpty(adRecord) == false) {
                
                var adIndex = adRecord.get('index'),
                    node = Ext.get(this.getView().getNode(adIndex));
                
                if (node) {
                    var nodePos = node.getXY(),
                        adWrapTarget = Ext.query('.x-ad-wrap', this.getEl().dom),
                        adWrapEl = Ext.get(adWrapTarget);
                        
                    adWrapEl.setVisible(true);
                    
                    var xPos = (startIndex == 0) ? nodePos[0] : nodePos[0]-80,
                        yPos = nodePos[1];
                    adWrapEl.position("absolute", 99, xPos, yPos);
                    
                    this.showAd = true;    
                }
            }
        }, 200, this);   
    },
    
    selectCell: function (index, startIndex) {
        if (parseInt(index) >= 0) {
            index = (startIndex == 0) ? index : --index;
            
            var node = Ext.get(this.getView().getNode(index)),
                selModel = this.getView().getSelectionModel();
            selModel.select(index);
            
            if (Ext.isEmpty(node) == false) {
                this.getTargetEl().scrollTo("left", node.dom.offsetLeft - 5);
                this.getTargetEl().scrollTo("top", node.dom.offsetParent.offsetTop);
                return selModel.getSelection()[0];
            } else {
                return false;
            }
        }
        return false;
    },
    
    onViewPrepareData: function (data) {
        Ext.apply(data, {
            shortName: Ext.util.Format.ellipsis(data.goods_name, 14)
        });
        return data;
    },
    
    onViewItemClick: function (view, record, item, index, e) {
        if (e.target.className == "x-btn-action icon-delete") {
            this.fireEvent("deleteitembtnclick", this, record, index);
        } else {
            if (e.target.className == "x-btn-create") {
                this.fireEvent("additembtnclick", this, record, index);
            }
        }
    },
    
    onStoreDataChanged: function (store) {
        this.down("#btnAdd").setDisabled(store.getCount() == 0);
    }
});