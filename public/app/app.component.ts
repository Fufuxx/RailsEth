import {Component} from '@angular/core'

declare let ActionCable:any

@Component({
  selector: 'app',
  templateUrl: '/app/app.component.html'
})

export class AppComponent{
  App: any = {};

  collection: any[] = [];
  selectedItem: any = "";

  walletName :string;

  constructor(){
    let self = this;
    this.App.cable = ActionCable.createConsumer("ws://localhost:3000/cable");
    this.App.MyChannel = this.App.cable.subscriptions.create({channel: "MyChannel", context: {} }, {
      // ActionCable callbacks
      connected: function() {
        console.log("connected");
        this.getWallets();
      },
      disconnected: function() {
        console.log("disconnected");
      },
      rejected: function() {
        console.log("rejected");
      },
      received: function(data) {
        console.log('Data Received from backend', data);
        if(data.method === 'getWallets'){
          self.collection = data.data;
        }
      },
      createWallet: function(data){
        console.log('Creating New Wallet...');
        this.perform('createWallet', { name: self.walletName });
      },
      getWallets: function(){
        this.perform('getWallets');
      }
    });
  }

  ngOnInit(){

  }

  handleSelectionChange(){
    console.log(this.selectedItem);
  }

}
