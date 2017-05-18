Ext.define('App.controller.operations.TransitController', {
    extend : 'Ext.app.Controller',
    
    models: [
        "operations.IncomingTransitModel"
    ],
    stores: [
        "operations.IncomingTransitsStore"
    ],
    views: [
        "operations.reports.TransitsGridPanel", 
        "operations.profile.IssueTransitContentPanel", 
        "operations.profile.AcceptingTransitContentPanel"
    ],
    
    init: function () {
        this.control({
            OperationIssueTransitProfileContentPanel: {
                savebtnclick: Ext.bind(this.getController("operations.IssueController").onSaveBtnClick, this),
                cancelbtnclick: Ext.bind(this.getController("OperationsController").onCancelBtnClick, this),
                deletebtnclick: Ext.bind(this.getController("OperationsController").onDeleteBtnClick, this),
                changeslogsbtnclick: Ext.bind(this.getController("OperationsController").onChangesLogsBtnClick, this)
            },
            OperationAcceptingTransitProfileContentPanel: {
                cancelbtnclick: Ext.bind(this.getController("OperationsController").onCancelBtnClick, this),
                acceptbtnclick: this.onAcceptIncomingTransitBtnClick
            },
            OperationIncomingTransitsGridPanel: {
                groupclick: this.onIncomingTransitGroupClick
            }
        })
    },
    
    onIncomingTransitGroupClick: function (a, d, h, g) {
        if (g.target.nodeName == "A" || g.target.nodeName == "EM") {
            var b = a.ownerCt.getStore();
            var c = b.getGroups(h);
            if (Ext.isEmpty(c.children) == false) {
                this.onCreateAcceptingTransitTab(a.ownerCt, c.children[0])
            }
        }
    },
    
    onCreateAcceptingTransitTab: function (a, d) {
        var g = d,
            e = a.up("tabpanel"),
            j = false,
            h = this;
        e.items.each(function (o, n) {
            if (o.operationId == g.get("operation_id")) {
                j = true;
                e.setActiveTab(o);
                return
            }
        });
        if (!j) {
            var k = Ext.String.format("№ {0}", g.get("code")),
                m = "Принять из транзита",
                l = "icon-truck-accept",
                c = "OperationAcceptingTransitProfileContentPanel";
            var b = e.add({
                xtype: c,
                closable: true,
                iconCls: l,
                title: k,
                tooltip: m,
                operationId: g.get("operation_id")
            });
            e.setActiveTab(b);
            this.getController("OperationsController").loadRecord(b);
        }
    },
    onAcceptIncomingTransitBtnClick: function (a) {
        var b = function (n) {
            var c = a.down("form"),
                l = a.down("#materialsGrid"),
                g = a.down("#filesGrid"),
                m = a.up("OperationsContentPanel"),
                j = m.down("tabpanel"),
                k = n;
            if (c.getForm().isValid()) {
                var h = new Object();
                h = c.getForm().getFieldValues();
                h.materials = l.getStore().getRawData();
                h.files = g.getStore().getRawData();
                var e = h.date,
                    d = h.time;
                e.setHours(d.getHours(), d.getMinutes());
                h.date = Ext.util.Format.date(e, "Y-m-d H:i:s");
                a.el.mask("Пожалуйста подождите ...");
                Ext.Ajax.request({
                    url: Settings.urls.getUrl("operations.transit.accept"),
                    params: {
                        records: Ext.encode(h)
                    },
                    success: function (p, o) {
                        a.el.unmask();
                        if (App.ux.util.Response.isValidStatus(p)) {
                            j.remove(a);
                            var q = m.down("OperationIncomingTransitsGridPanel");
                            if (Ext.isEmpty(q) == false) {
                                j.setActiveTab(q);
                                q.onRefresh()
                            }
                            m.down("OperationsReportGridPanel").onRefresh();
                            if (Ext.isEmpty(m.down("OperationsRemainsReportGridPanel")) == false) {
                                m.down("OperationsRemainsReportGridPanel").onRefresh()
                            }
                        }
                    },
                    failure: function () {
                        a.el.unmask()
                    }
                })
            }
        };
        App.ux.Msg.confirm("Вы подтверждаете прием материала в указанном количестве на склад?", function (c) {
            if (c == "yes") {
                b(this)
            }
        }, this)
    }
    
});