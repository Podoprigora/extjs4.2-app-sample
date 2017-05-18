Ext.define('App.ux.image.Viewer', {
    extend: 'Ext.panel.Panel',
    xtype : 'ImageViewer',
    
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    
    cls : 'image-viewer',

    config: {
        images : [],
        attributes : [],
        imageIndex : 1,
        
        isMoving: false,
        imageWidth: null,
        imageHeight: null,
        originalImageWidth: null,
        originalImageHeight: null,
        clickX: null,
        clickY: null,
        lastMarginX: null,
        lastMarginY: null,
        rotation: 0
    },

    initComponent: function () {
        
        this.buildViewer();
        this.buildActionsBbar();
        this.buildAttributesBbar();

        this.callParent();
        
        this.on('resize', this.stretchOptimally, this);
        this.on('imagechange', this.onImageChange, this);
    },

    initEvents: function () {
        var me = this;

        me.mon(me.getImageContainer().getEl(), {
            mouseup: me.mouseup,
            mousedown: me.mousedown,
            mousemove: me.mousemove,
            scope: me
        });
        
        /*me.mon(Ext.fly('lk-image-geo'), {
            click : function(e, target){
                console.log(target.text);    
            },
            scope : this
        });*/

        me.callParent();
    },
    
    buildViewer : function(){
        var me = this;
        
        this.items = [{
            xtype: 'container',
            itemId: 'imagecontainer',
            cls : 'image-container',
            flex: 1,
            items: {
                xtype: 'image',
                mode: 'element',
                src: '',
                listeners: {
                    afterrender: function (image) {
                        image.el.on({
                            load : function(event, imageEl) {
                                imageEl.style.width = "";
                                imageEl.style.height = "";
                                
                                var imageWidth = Ext.fly(imageEl).getWidth(),
                                    imageHeight = Ext.fly(imageEl).getHeight();
                                    
                                me.setRotation(0);
                                me.rotateImage();
    
                                me.setOriginalImageWidth(imageWidth);
                                me.setOriginalImageHeight(imageHeight);
                                
                                me.setImageWidth(imageWidth);
                                me.setImageHeight(imageHeight);
                                
                                me.stretchOptimally();
                                me.el.unmask();
                            }
                        });
                    }
                }
            }
        }];
    },
    
    buildActionsBbar : function(){
        this.dockedItems = Ext.Array.push(this.dockedItems, {
            xtype : 'toolbar',
            dock : 'bottom',
            items : [
                {
                    xtype : 'tbfill'    
                },
                {
                    iconCls : 'icon-navigate-prev',
                    toolatip : 'Предыдущее изображение',
                    itemId : 'btnPrev',
                    listeners: { click: this.prev, scope: this }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    iconCls : 'icon-navigate-next',
                    tooltip : 'Следующее  изображение ',
                    itemId : 'btnNext',
                    listeners: { click: this.next, scope: this }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    iconCls : 'icon-zoom-in',
                    tooltip : 'Увеличить',
                    ui : 'plain',
                    listeners: { click: this.zoomIn, scope: this }
                },
                {
                    iconCls : 'icon-zoom-out',
                    tooltip : 'Уменьшить',
                    ui : 'plain',
                    listeners: { click: this.zoomOut, scope: this }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    iconCls : 'icon-rotate-left',
                    tooltip : 'Повернуть против часовой стрелке',
                    ui : 'plain',
                    listeners: { click: this.rotateAntiClockwise, scope: this }
                },
                {
                    iconCls : 'icon-rotate-right',
                    tooltip : 'Повернуть по часовой стрелке',
                    ui : 'plain',
                    listeners: { click: this.rotateClockwise, scope: this }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    iconCls : 'icon-fullscreen-exit',
                    tooltip : 'По размеру окна',
                    ui : 'plain',
                    listeners: { click: this.stretchOptimally, scope: this }
                },
                {
                    xtype : 'tbfill'    
                }     
            ]
        });
    },
    
    buildAttributesBbar : function() {
        this.dockedItems = Ext.Array.push(this.dockedItems, {
            xtype : 'container',
            hidden : true,
            itemId : 'attributescontainer',
            cls : 'image-attributes',
            dock : 'bottom',
            layout : 'fit',
            height : 30,
            items : [
                {
                    xtype : 'panel',
                    tpl : ['<div class="wrapper">{value}</div>']
                }
            ]
        });
    },
    
    stretchHorizontally: function () {
        var me = this,
            imageContainerWidth = me.getImageContainer().getWidth();

        me.setImageSize({
            width: imageContainerWidth - 0,
            height: me.getOriginalImageHeight() * (imageContainerWidth - 0) / me.getOriginalImageWidth()
        });

        me.centerImage();
    },

    stretchVertically: function () {
        var me = this,
            imageContainerHeight = me.getImageContainer().getHeight();

        me.setImageSize({
            width: me.getOriginalImageWidth() * (imageContainerHeight - 0) / me.getOriginalImageHeight(),
            height: imageContainerHeight - 0
        });

        me.centerImage();
    },

    stretchOptimally: function () {
        var me = this,
            imageContainer = me.getImageContainer(),
            adjustedImageSize = me.getAdjustedImageSize();

        if (adjustedImageSize.width * imageContainer.getHeight() / adjustedImageSize.height > imageContainer.getWidth()) {
            me.stretchHorizontally();
        } else {
            me.stretchVertically();
        }
    },

    centerImage: function () {
        var me = this,
            imageContainer = me.getImageContainer(),
            adjustedImageSize = me.getAdjustedImageSize();

        me.setMargins({
            top: (imageContainer.getHeight() - adjustedImageSize.height - 0) / 2,
            left: (imageContainer.getWidth() - adjustedImageSize.width - 0) / 2
        });
    },

    mousedown: function (event) {
        var me = this,
            margins = me.getMargins();

        event.stopEvent();

        me.setClickX(event.getPageX());
        me.setClickY(event.getPageY());
        me.setLastMarginY(margins.top);
        me.setLastMarginX(margins.left);

        me.setIsMoving(true);
    },

    mousemove: function (event) {
        var me = this;

        if (me.getIsMoving()) {
            me.setMargins({
                top: me.getLastMarginY() - me.getClickY() + event.getPageY(),
                left: me.getLastMarginX() - me.getClickX() + event.getPageX()
            });
        }
    },

    mouseup: function () {
        var me = this;

        if (me.getIsMoving()) {
            me.setClickX(null);
            me.setClickY(null);
            me.setLastMarginX(null);
            me.setLastMarginY(null);
            me.setIsMoving(false);
        }
    },

    zoomOut: function (event) {
        var me = this,
            margins = me.getMargins(),
            adjustedImageSize = me.getAdjustedImageSize();

        me.setMargins({
            top: margins.top + adjustedImageSize.height * 0.05,
            left: margins.left + adjustedImageSize.width * 0.05
        });

        me.setImageSize({
            width: adjustedImageSize.width * 0.9,
            height: me.getOriginalImageHeight() * adjustedImageSize.width * 0.9 / me.getOriginalImageWidth()
        });
    },

    zoomIn: function (event) {
        var me = this,
            margins = me.getMargins(),
            adjustedImageSize = me.getAdjustedImageSize();

        me.setMargins({
            top: margins.top - adjustedImageSize.height * 0.05,
            left: margins.left - adjustedImageSize.width * 0.05
        });

        me.setImageSize({
            width: adjustedImageSize.width * 1.1,
            height: me.getOriginalImageHeight() * adjustedImageSize.width * 1.1 / me.getOriginalImageWidth()
        });
    },

    rotateClockwise: function () {
        var me = this,
            rotation = me.getRotation();

        rotation += 90;

        if (rotation > 360) {
            rotation -= 360;
        }

        me.setRotation(rotation);
        me.rotateImage();
    },

    rotateAntiClockwise: function () {
        var me = this,
            rotation = me.getRotation();

        rotation -= 90;

        if (rotation < 0) {
            rotation += 360;
        }

        me.setRotation(rotation);
        me.rotateImage();
    },

    rotateImage: function () {
        var me = this,
            tmpOriginalWidth,
            transformStyle = 'rotate(' + me.getRotation() + 'deg)';

        tmpOriginalWidth = me.getOriginalImageWidth();
        me.setOriginalImageWidth(me.getOriginalImageHeight());
        me.setOriginalImageHeight(tmpOriginalWidth);

        me.getImage().getEl().applyStyles({
            'transform': transformStyle,
            '-o-transform': transformStyle,
            '-ms-transform': transformStyle,
            '-moz-transform': transformStyle,
            '-webkit-transform': transformStyle
        });

        me.setMargins(me.getMargins());
        me.stretchOptimally();
    },

    setMargins: function (margins) {
        var me = this,
            rotation = me.getRotation(),
            adjustedImageSize = me.getAdjustedImageSize(),
            imageContainer = me.getImageContainer(),
            imageContainerWidth = imageContainer.getWidth(),
            imageContainerHeight = imageContainer.getHeight();

        if (adjustedImageSize.width > imageContainerWidth - 0) {
            if (margins.left > 0) {
                margins.left = 0;
            } else if (margins.left < imageContainerWidth - adjustedImageSize.width - 0) {
                margins.left = imageContainerWidth - adjustedImageSize.width - 0;
            }
        } else {
            if (margins.left < 0) {
                margins.left = 0;
            } else if (margins.left > imageContainerWidth - adjustedImageSize.width - 0) {
                margins.left = imageContainerWidth - adjustedImageSize.width - 0;
            }
        }

        if (adjustedImageSize.height > imageContainerHeight - 0) {
            if (margins.top > 0) {
                margins.top = 0;
            } else if (margins.top < imageContainerHeight - adjustedImageSize.height - 0) {
                margins.top = imageContainerHeight - adjustedImageSize.height - 0;
            }
        } else {
            if (margins.top < 0) {
                margins.top = 0;
            } else if (margins.top > imageContainerHeight - adjustedImageSize.height - 0) {
                margins.top = imageContainerHeight - adjustedImageSize.height - 0;
            }
        }

        if (rotation === 90 || rotation === 270) {
            var marginAdjustment = (me.getImageHeight() - me.getImageWidth()) / 2;
            margins.top = margins.top - marginAdjustment;
            margins.left = margins.left + marginAdjustment;
        }

        me.getImage().getEl().setStyle('margin-left', margins.left + 'px');
        me.getImage().getEl().setStyle('margin-top', margins.top + 'px');
    },

    getMargins: function () {
        var me = this,
            rotation = me.getRotation(),
            imageEl = me.getImage().getEl();

        var margins = {
            top: parseInt(imageEl.getStyle('margin-top'), 0),
            left: parseInt(imageEl.getStyle('margin-left'), 0)
        };

        if (rotation === 90 || rotation === 270) {
            var marginAdjustment = (me.getImageHeight() - me.getImageWidth()) / 2;
            margins.top = margins.top + marginAdjustment;
            margins.left = margins.left - marginAdjustment;
        }

        return margins;
    },

    getAdjustedImageSize: function () {
        var me = this,
            rotation = me.getRotation();

        if (rotation === 90 || rotation === 270) {
            return {
                width: me.getImageHeight(),
                height: me.getImageWidth()
            };
        } else {
            return {
                width: me.getImageWidth(),
                height: me.getImageHeight()
            };
        }
    },

    setImageSize: function (size) {
        var me = this,
            rotation = me.getRotation();

        if (rotation === 90 || rotation === 270) {
            me.setImageWidth(size.height);
            me.setImageHeight(size.width);
        } else {
            me.setImageWidth(size.width);
            me.setImageHeight(size.height);
        }
    },

    applyImageWidth: function (width) {
        var me = this;
        me.getImage().setWidth(width);
        return width;
    },

    applyImageHeight: function (height) {
        var me = this;
        me.getImage().setHeight(height);
        return height;
    },

    getImage: function () {
        return this.query('image')[0];
    },

    getImageContainer: function () {
        return this.query('#imagecontainer')[0];
    },
    
    getAttributesContainer : function(){
        return this.query('#attributescontainer')[0];
    },
    
    applyAttributes : function(attributes){
        var container = this.getAttributesContainer();
        container.setVisible(Ext.isEmpty(attributes) == false);
        return attributes;  
    },
    
    applyImages : function(images){
        this.getImage().setSrc('');
        return images;
    },

    setImageSrc: function(img) {
        this.getImage().setSrc(img);
        if (this.el) {
            this.el.mask('Загрузка ...');   
        }
    },
    
    setImageIndex : function(index){
        if (Ext.isEmpty(this.images) == false && this.images[index]) {
            this.imageIndex = index;
            this.setImageSrc(this.images[index]);

            this.fireEvent('imagechange');    
        }
    },
    
    next: function() {
        if(Ext.isEmpty(this.images) == false && this.images[(this.imageIndex+1)]) {
            this.imageIndex++;
            this.setImageSrc(this.images[this.imageIndex]);
            
            this.fireEvent('imagechange');
        }
    },

    prev: function() {
        if(Ext.isEmpty(this.images) == false && this.images[(this.imageIndex-1)]) {
            this.imageIndex--;
            this.setImageSrc(this.images[this.imageIndex]);
            
            this.fireEvent('imagechange');
        }
    },
    
    onImageChange : function(){
        
        var attributesContainer = this.getAttributesContainer();
        
        if (Ext.isEmpty(this.attributes) == false && this.attributes.length && this.attributes[this.imageIndex]) {
            attributesContainer.setVisible(true);
            attributesContainer.down('panel').update({value : this.attributes[this.imageIndex]});
        } else {
            attributesContainer.setVisible(false);           
        }

        this.down('#btnPrev').setDisabled(this.imageIndex <= 0);
        this.down('#btnNext').setDisabled((this.images.length-1) <= this.imageIndex);  
    }
});