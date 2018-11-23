import {Component} from '@angular/core'
import { CompilerConfig } from '../node_modules/@angular/compiler';

declare let ActionCable:any
declare let config: any;

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

  wallets_toggle = false;
  pending_tx = false;

  tx_hash = '';

  constructor(){
    let self = this; 
    console.log('Config -> ', config);
    
    //this.App.cable = ActionCable.createConsumer("wss://me-walleth.herokuapp.com/cable");
    this.App.cable = ActionCable.createConsumer(config.cable);
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
        if(data.method == 'broadcast'){
          self.tx_hash = data.data;
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
  }

  handleSelectionChange(){
    this.tx.from = this.selectedItem.wallet.name;
  }

  getEthValue(wei){
    return wei / Math.pow(10, 18); 
  }

  getWeiValue(eth){
    return eth * Math.pow(10, 18); 
  }

  setAmount(){
    this.tx.value = +this.tx.value;
  }

  //In case of
  getUnselectedWallets(){
    return this.collection.filter(e => e.wallet.address != this.selectedItem.wallet.address)
  }

}
