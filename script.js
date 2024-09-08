const cashInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");

const drawerChange = document.querySelector(".drawer-change");

const changeDueContainer = document.getElementById("change-due");//visibility

const drawerChangeSpan = document.querySelectorAll(".change-span")
const statusText = document.getElementById("status");
const totalSpan = document.getElementById("total");

let price = 1.75;

let isDrawerClosed = false

const changeDue = () => (Number(cashInput.value) - price.toFixed(2));

totalSpan.innerText = price;

  let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

/* let cid = [
  ["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]
]; */


 /* let cid = [
  ["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]
];   */

const currency =[
  ['PENNY', 0.01],
  ['NICKEL', 0.05],
  ['DIME', 0.1],
  ['QUARTER', 0.25],
  ['ONE', 1],
  ['FIVE', 5],
  ['TEN', 10],
  ['TWENTY', 20],
  ['ONE HUNDRED', 100]
] 

const currencyCalc = (amount) => Math.round(amount * 100) / 100;

const updateCid = (cidCountArray) => cid.forEach((el, index) => el[1] = parseFloat((cidCountArray[index][3] * currency[index][1]).toFixed(2)));

const updateDrawerChangeSpan = () => drawerChangeSpan.forEach((el, index) => el.innerText = `$${cid[index][1]}`)
updateDrawerChangeSpan()


const updateChangeGiven = (changeGivenArray) => {
  const changeDueVal = [];
  const changeTotal = []
  changeGivenArray.sort((a, b) => b[1] - a[1])
  changeGivenArray.forEach((el) => {
    //changeDueContainer.innerHTML += `<p class="drawer-change">${el[0]}:<span>$${el[1]}</span></p>`
    changeDueVal.push(`${el[0]}: $${el[1]}`)
    changeTotal.push(el[1]);
  })
  
  const status = changeInDrawerTotal() === changeTotal ? "CLOSED" : "OPEN";
  changeDueContainer.innerHTML = `<p class="drawer-change">Status: ${status} ${changeDueVal.join(" ")}</p>`;
  isDrawerClosed = status === "CLOSED";
}

const changeInDrawerTotal = () => {
  let total = 0;
  cid.forEach((el) => total += parseFloat(el[1]))
  return parseFloat(total.toFixed(2))
}


const statusCheck = () => {
  const cashInputNo = Number(cashInput.value);
  if(cashInputNo < price) {
    alert("Customer does not have enough money to purchase the item")
    return false
  }else{
      const changeDueAmount = changeDue();
      const status = changeDueAmount > changeInDrawerTotal() ? "INSUFFICIENT_FUNDS" : changeDueAmount === 0 ? "CLOSED" : "OPEN";
      status === "CLOSED" && (changeDueContainer.innerHTML += "No change due - customer paid with exact cash");
      
     status === "INSUFFICIENT_FUNDS"  && (changeDueContainer.innerHTML = `<p class="drawerChange">Status: INSUFFICIENT_FUNDS</p>`)

      //(status === "INSUFFICIENT_FUNDS" || status === "OPEN") && (changeDueContainer.innerHTML = `<h3 id="status">Status: ${status}</h3>`);

      return status === "OPEN";
  } 

   /* else if(cashInputNo === price){
    changeDueContainer.innerHTML += `
    <h3 id="status">Status: CLOSED</h3>
    <p class="drawer-change">No change due - customer paid with exact cash</p>`
  }else if(changeDueAmount > changeInDrawerTotal()){
    changeDueContainer.innerHTML += `<h3 id="status">Status: INSUFFICIENT_FUNDS</h3>`
  }else if(changeDueAmount !== 0){
    changeDueContainer.innerHTML += `<h3 id="status">Status: OPEN</h3>`
    return true
  }    */
};

const cidCount = () => {
  const cidCountArray = [];
  cid.forEach((el, index) => {
    cidCountArray.push([el[0], currency[index][1], el[1], parseFloat((el[1] / currency[index][1]).toFixed(2))])
  })
  return cidCountArray
}
let cidCountArray = cidCount().slice()

//calc
const changeCalc = () => {
  let changeD = changeDue();
  let tempCidCountArray = [...cidCountArray].reverse()
  // ["text", currency, available, count]
  let changeGiven = [];


  tempCidCountArray.forEach((el) => {
    let amountGiven = 0;
    while(changeD >= el[1] && el[3] > 0){
      changeD = currencyCalc(changeD - el[1]);
      el[2] = currencyCalc(el[2] - el[1]);
      el[3]--;
      amountGiven = currencyCalc(amountGiven + el[1]);
    }

    if(amountGiven > 0){
      changeGiven.push([el[0], amountGiven])
    }
  })
  
  if (parseFloat(changeD.toFixed(2)) > 0) {
    changeDueContainer.innerHTML = `
    <p class="drawerChange">Status: INSUFFICIENT_FUNDS</p>`;
    return false;
  }else{
    updateCid(tempCidCountArray.reverse())
    updateDrawerChangeSpan()
    updateChangeGiven(changeGiven)
  }
}

const cleaner = () => {
  changeDueContainer.innerHTML = ""
}
const checker = () => {
  if(isDrawerClosed) return
  cleaner()
  statusCheck() === true && changeCalc();
}


purchaseBtn.addEventListener("click", () => checker())
