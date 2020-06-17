const arweave = Arweave.init({host:"arweave.net",port:443,logging:!0,protocol:"https"});
var wallet = '';

function saveScore(files) {

 var upfile = new FileReader()
   upfile.onload = function (ev) {
       try {
           wallet = JSON.parse(ev.target.result)
         console.log(wallet);
         let fg = JSON.parse(sessionStorage.getItem("highscores"));
         console.log(fg[0]);
         if (fg[0] === void 0) {
           Swal.fire({
           icon: 'error',
           title: 'Oops...',
           text: 'Please play game first !',
           })
         }else {
            ArweaveCheckAddress(wallet, fg[0].toString());
         }
       } catch (err) {
       Swal.fire({
       icon: 'error',
       title: 'Oops...',
       text: 'Please upload only JSON Keyfile',
       })
       }
   }
   upfile.readAsText(files[0])

}

async function ArweaveCheckAddress(jwk, d) {
 var arweaveaddress = "";
 arweave.wallets.jwkToAddress(jwk).then((address) => {
   arweaveaddress = address;
   ArweaveCheckBalance(arweaveaddress, jwk, d);
 });

}

async function ArweaveCheckBalance(es,jwk, d) {
arweave.wallets.getBalance(es).then((balance) => {
let winston = balance;
ArweaveCheckFee(winston,es, jwk, d);
});
}

async function ArweaveCheckFee(as, bs, jwk, d) {
 let fee = await fetch('https://arweave.net/price/20/'+bs);
 fee = await fee.text();
 fee = arweave.ar.winstonToAr(fee);
 let bal = arweave.ar.winstonToAr(as);

 if (bal < fee) {
     Swal.fire({
    icon: 'error',
    title: 'Less balance',
    text: 'Please deposit AR to your Address!',
    })
 }else {
     ArweaveSendTransaction(jwk, d);
 }

}


async function ArweaveSendTransaction(wallet, data) {
try {
 let transaction =  await arweave.createTransaction({
          data: data
      }, wallet)
    transaction.addTag('Content-Type', 'text/html');
    transaction.addTag('Applications-Name', 'blocktris');
    transaction.addTag('Scores', data);
   await arweave.transactions.sign(transaction,wallet);
   const response = await arweave.transactions.post(transaction);
   if (response.status === 200) {
           Swal.fire({
          icon: 'success',
          title: 'Yeah...',
          text: 'Your score has been saved. Need time to show your score! '+transaction.id,
          })
   }
} catch (e) {
   Swal.fire({
  icon: 'error',
  title: 'Oops...',
  text: 'Failed to connect to Network',
  })
}
}

window.onload = async function ArweaveRetrievingData(){
const transaction = await arweave.arql({
     op: "and",
     expr1: {
       op: "equals",
       expr1: "Applications-Name",
       expr2: "blocktris"
     },
     expr2: {
         op:"equals",
         expr1:"Applications-Name",
         expr2:"blocktris"
     }
})

ArweaveProcessData(transaction);
}

async function ArweaveProcessData(tx) {

 let jsondata = [];
 var Arcount = tx.length;
 tx.forEach(async function (e){
     arweave.transactions.getData(e, {decode: true, string: true}).then(data => {
         let datajson = '{"id":"'+e+'", "score":"'+data+'"}';
         let hyp = JSON.parse(datajson);
         jsondata.push(hyp);
         Arcount -= 1;
         if (Arcount === 0) {
             jsondata.sort(function (a, b) {
             return b.score - a.score;
           });
           ArweaveShowData(jsondata);
         }
     });
 });
}

function ArweaveShowData(e) {
let b = e.slice(0,10);
var num = b.length;
var showing = '';
b.forEach((item, i) => {
   num -= 1;
   showing += '<a href="Https://viewblock.io/arweave/tx/'+item.id+'" style="color:#945d41;">'+item.score+'</a><br />';
   if (num === 0) {
       document.getElementById("ledbox2").innerHTML = showing;
   }

});

}
