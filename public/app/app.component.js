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
                    this.wallets = [];
                    this.selectedWallet = "";
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
                                self.wallets = data.data;
                            }
                        },
                        createWallet: function (data) {
                            console.log('Creating New Wallet...');
                            this.perform('createWallet', { name: self.walletName });
                        },
                        getWallets: function () {
                            this.perform('getWallets');
                        }
                    });
                }
                AppComponent.prototype.ngOnInit = function () {
                };
                AppComponent.prototype.handleSelectionChange = function () {
                    console.log(this.selectedWallet);
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'app',
                        templateUrl: '/app/app.component.html'
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