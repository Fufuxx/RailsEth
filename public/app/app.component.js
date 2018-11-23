System.register(["@angular/core"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, AppComponent;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            }
        ],
        execute: function () {
            AppComponent = /** @class */ (function () {
                function AppComponent() {
                    this.App = {};
                    this.collection = [];
                    this.selectedItem = "";
                    this.send_transaction = false;
                    this.tx = {
                        name: '',
                        to_address: '',
                        from: '',
                        value: 0,
                        gas_limit: 200000,
                        gas_price: 1000000000
                    };
                    this.wallets_toggle = false;
                    this.pending_tx = false;
                    this.tx_hash = '';
                    var self = this;
                    console.log('Config -> ', config);
                    //this.App.cable = ActionCable.createConsumer("wss://me-walleth.herokuapp.com/cable");
                    this.App.cable = ActionCable.createConsumer(config.cable);
                    this.App.MyChannel = this.App.cable.subscriptions.create({ channel: "MyChannel", context: {} }, {
                        // ActionCable callbacks
                        connected: function () {
                            console.log("connected");
                            this.getWallets();
                        },
                        disconnected: function () {
                            console.log("disconnected");
                        },
                        rejected: function () {
                            console.log("rejected");
                        },
                        received: function (data) {
                            console.log('Data Received from backend', data);
                            if (data.method === 'getWallets') {
                                self.collection = data.data;
                            }
                            if (data.method == 'broadcast') {
                                self.tx_hash = data.data;
                            }
                        },
                        createWallet: function (data) {
                            console.log('Creating New Wallet...');
                            this.perform('createWallet', { name: self.walletName });
                        },
                        getWallets: function () {
                            this.perform('getWallets');
                        },
                        generateTransaction: function () {
                            this.perform('generateTransaction', self.tx);
                        }
                    });
                }
                AppComponent.prototype.ngOnInit = function () {
                };
                AppComponent.prototype.sendTransaction = function () {
                    this.App.MyChannel.generateTransaction();
                    this.selectedItem.balance = this.selectedItem.balance - this.tx.value;
                    // this.selectedItem.transactions.push({
                    //   from: this.tx.from,
                    //   to: this.tx.to_address,
                    //   value: this.tx.value,
                    //   credit: null
                    // });
                    this.pending_tx = true;
                    this.send_transaction = false;
                };
                AppComponent.prototype.handleSelectionChange = function () {
                    this.tx.from = this.selectedItem.wallet.name;
                };
                AppComponent.prototype.getEthValue = function (wei) {
                    return wei / Math.pow(10, 18);
                };
                AppComponent.prototype.getWeiValue = function (eth) {
                    return eth * Math.pow(10, 18);
                };
                AppComponent.prototype.setAmount = function () {
                    this.tx.value = +this.tx.value;
                };
                //In case of
                AppComponent.prototype.getUnselectedWallets = function () {
                    var _this = this;
                    return this.collection.filter(function (e) { return e.wallet.address != _this.selectedItem.wallet.address; });
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'app',
                        templateUrl: '/app/app.component.html',
                        styles: ["\n    .balance{\n        font-size: 30px;\n        font-weight: bold;\n    }\n\n    .red{\n        color: red;\n        font-weight: bold;\n    }\n\n    .green{\n        color:green;\n        font-weight: bold;\n    }\n  "]
                    }),
                    __metadata("design:paramtypes", [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    };
});
//# sourceMappingURL=app.component.js.map