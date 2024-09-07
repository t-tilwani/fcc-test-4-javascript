const cashInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");

const drawerChange = document.querySelector(".drawer-change");

const changeDueContainer = document.getElementById("change-due");//visibility

const drawerChangeSpan = document.querySelectorAll(".change-span")
const statusText = document.getElementById("status");
const totalSpan = document.getElementById("total");

let price = 1.87;



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

const updateChangeGiven = (changeGivenArray) => {
  changeGivenArray.forEach((el) => {
    changeDueContainer.innerHTML += `<p class="drawer-change">${el[0]}:<span>$${el[1]}</span></p>`
  })
}

const changeInDrawerTotal = () => {
  let total = 0;
  cid.forEach((el) => total += parseFloat(el[1]))
  return parseFloat(total.toFixed(2))
}


const statusCheck = () => {

  if(cashInput.value < price) {
    alert("Customer does not have enough money to purchase the item")
    return false
  }else{
      const ChangeDueAmount = changeDue();
      const status = ChangeDueAmount > changeInDrawerTotal() ? "INSUFFICIENT_FUNDS" : ChangeDueAmount === 0 ? "CLOSED" : "OPEN";
      changeDueContainer.innerHTML += `<h3 id="status">Status: ${status}</h3>`

      const changeDueMessages = {
        INSUFFICIENT_FUNDS: "",
        CLOSED: "No change due - customer paid with exact cash",
        OPEN: ""
      };

      (status === "CLOSED" || status === "OPEN") && (changeDueContainer.innerHTML += changeDueMessages[status]);

      return status === "OPEN";
  }
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
    changeDueContainer.innerHTML = "";
    changeDueContainer.innerHTML += `
    <h3 id="status">Status: INSUFFICIENT_FUNDS</h3>
    <p>Insufficient funds in drawer</p>`;
    return false;
  }else{
    updateCid(tempCidCountArray.reverse())
    updateDrawerChangeSpan()
    updateChangeGiven(changeGiven)
  }
    console.log(changeD)
    console.log(tempCidCountArray)
    console.log(changeGiven)
}

const cleaner = () => {
  changeDueContainer.innerHTML = ""
}
const checker = () => {
  cleaner()
  statusCheck() === true && changeCalc();
}


purchaseBtn.addEventListener("click", () => checker())



