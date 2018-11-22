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

  send_transaction = false;

  tx = {
    name: '',
    to_address: '',
    from: '',
    value: 0,
    gas_limit: 200000,
    gas_price: 1000000000
  }

  constructor(){
    let self = this;
    
    this.App.cable = ActionCable.createConsumer("wss://me-walleth.herokuapp.com/cable");
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
        this.perform('generateTransaction', self.tx);
      }
    });
  }

  ngOnInit(){

  }

  sendTransaction(){
    console.log('Sending Transaction with data', this.tx);
    this.App.MyChannel.generateTransaction();
  }

  handleSelectionChange(){
    console.log('Selected Wallet', this.selectedItem);
    this.tx.from = this.selectedItem.wallet.name;
  }

  getEthValue(wei){
    return wei / Math.pow(10, 18); 
  }

  getWeiValue(eth){
    return eth * Math.pow(10, 18); 
  }

  setAmount(){
    console.log(this.tx.value);
    this.tx.value = +this.tx.value;
  }

}
