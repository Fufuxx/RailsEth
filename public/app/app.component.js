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
                    var self = this;
                    this.App.cable = ActionCable.createConsumer("ws://localhost:3000/cable");
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
                    console.log('Sending Transaction with data', this.tx);
                    this.App.MyChannel.generateTransaction();
                };
                AppComponent.prototype.handleSelectionChange = function () {
                    console.log('Selected Wallet', this.selectedItem);
                    this.tx.from = this.selectedItem.wallet.name;
                };
                AppComponent.prototype.getEthValue = function (wei) {
                    return wei / Math.pow(10, 18);
                };
                AppComponent.prototype.getWeiValue = function (eth) {
                    return eth * Math.pow(10, 18);
                };
                AppComponent.prototype.setAmount = function () {
                    console.log(this.tx.value);
                    this.tx.value = +this.tx.value;
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