import {Component} from '@angular/core'

declare let ActionCable:any

@Component({
  selector: 'app',
  templateUrl: '/app/app.component.html',
  styles: [`
    .balance{
        font-size: 30px;
        font-weight: bold;
    }

    .red{
        color: red;
        font-weight: bold;
    }

    .green{
        color:green;
        font-weight: bold;
    }
  `]
})

export class AppComponent{
  App: any = {};

  collection: any[] = [];
  selectedItem: any = "";

  walletName :string;

  txData = {
    name: 'MeWallet',
    to_address: '0x88615D21ecB10FEA1eC83a716e605008BD8D1e74',
    value: this.getWeiValue(0.5)
  }

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
      },
      generateTransaction: function(){
        this.perform('generateTransaction', self.txData);
      }
    });
  }

  ngOnInit(){

  }

  handleSelectionChange(){
    console.log(this.selectedItem);
  }

  getEthValue(wei){
    return wei / Math.pow(10, 18); 
  }

  getWeiValue(eth){
    return eth * Math.pow(10, 18); 
  }

}
