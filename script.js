"use strict";

// Data - one object for each bank account
// Pretending like the data is coming from a Web API instead of hardcoding it lol
const account1 = {
	owner: "Gabby Diaz",
	transactions: [200.75, 450, -400, 3000.5, -650, -130, 70, 1300],
	interestRate: 1.2, // %
	pin: 1111
};

const account2 = {
	owner: "Dre Govender",
	transactions: [5000.25, 3400, -150, -790.75, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222
};

const account3 = {
	owner: "Darek Doroszko",
	transactions: [200, -200, 340.15, -300, -20, 50, 400.75, -460],
	interestRate: 0.7,
	pin: 3333
};

const account4 = {
	owner: "Sarah Lynn Correia",
	transactions: [430.89, 1000, 700.5, 50, 90],
	interestRate: 1,
	pin: 4444
};

const accounts = [account1, account2, account3, account4];

//********************  HTML Elements ********************
const lblWelcome = document.querySelector(".welcome");
const lblDate = document.querySelector(".date");
const lblBalance = document.querySelector(".balance_value");
const lblSumIn = document.querySelector(".summary_value--in");
const lblSumOut = document.querySelector(".summary_value--out");
const lblSumInterest = document.querySelector(".summary_value--interest");
const lblTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerTransactions = document.querySelector(".transactions");

const btnLogin = document.querySelector(".login_btn");
const btnTransfer = document.querySelector(".form_btn--transfer");
const btnLoan = document.querySelector(".form_btn--loan");
const btnClose = document.querySelector(".form_btn--close");
const btnSort = document.querySelector(".btn--sort");

const iconSort = document.querySelector(".sort-icon");

const inputLoginUsername = document.querySelector(".login_input--user");
const inputLoginPin = document.querySelector(".login_input--pin");
const inputTransferTo = document.querySelector(".form_input--to");
const inputTransferAmount = document.querySelector(".form_input--amount");
const inputLoanAmount = document.querySelector(".form_input--loan-amount");
const inputCloseUsername = document.querySelector(".form_input--user");
const inputClosePin = document.querySelector(".form_input--pin");

//***********************  Functions ************************
// display the UI
const displayTransactions = function (account, sort = false) {
	containerTransactions.innerHTML = "";

	// create a copy of the array to apply mutations
	const transactions = sort
		? account.transactions.slice().sort((a, b) => a - b)
		: account.transactions;

	transactions.forEach(function (tran, i) {
		const transactionType = tran > 0 ? "deposit" : "withdrawal";
		const html = `
          <div class="transaction_row">
            <div class="transaction_type transaction_type--${transactionType}">
              ${i + 1} ${transactionType.toUpperCase()}
            </div>
            <div class="transaction_value">
              ${tran > 0 ? "$" : "-$"}${Math.abs(tran).toLocaleString("en-US", {
			maximumFractionDigits: 2
		})}
              </div>
        </div>
    `;

		containerTransactions.insertAdjacentHTML("afterbegin", html);
	});
};

// overall account balance
const displayBalance = function (account) {
	account.balance = account.transactions.reduce((sum, tran) => sum + tran, 0);
	/// display HTML
	lblBalance.textContent = `${
		account.balance > 0 ? "$" : "-$"
	}${account.balance.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
};

// deposit, withdrawal summary
const displayAccountSummary = function (account) {
	// income summary
	const income = account.transactions
		.filter((tran) => tran > 0)
		.reduce((sum, tran) => sum + tran, 0);
	lblSumIn.textContent = `${
		income > 0 ? "$" : "-$"
	}${income.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

	// out summary (total withdrawals)
	const out = account.transactions
		.filter((tran) => tran < 0)
		.reduce((sum, tran) => sum + Math.abs(tran), 0);
	lblSumOut.textContent = `$${out.toLocaleString("en-US", {
		maximumFractionDigits: 2
	})}`;

	// business rule: for every deposit, bank charges an interest rate of the deposited amount (if the rate is > 1) lol
	const interest = account.transactions
		.filter((tran) => tran > 0)
		.map((deposit) => deposit * (account.interestRate / 100))
		// remove the rates that are < 1
		.filter((rate, i, arr) => rate >= 1)
		.reduce((sum, interest) => sum + interest, 0);
	lblSumInterest.textContent = `$${interest.toLocaleString("en-US", {
		maximumFractionDigits: 2
	})}`;
};

const updateUI = function (account) {
	// display new transaction
	displayTransactions(currentAccount);
	// display new balance
	displayBalance(currentAccount);
	//display transactions summary
	displayAccountSummary(currentAccount);
};

// compute usernames
const createUsernames = function (accounts) {
	// mutate the original accounts array - > use forEach()
	// we want to produce a side effect and not return anything
	accounts.forEach(function (acc) {
		// create a new property in the account obj that will hold the username
		acc.username = acc.owner
			.toLowerCase()
			.split(" ")
			.map((name) => name[0])
			.join("");
	});
};
createUsernames(accounts);

const clearLoginInputFields = function () {
	inputLoginUsername.value = inputLoginPin.value = "";
	inputLoginPin.blur();
};

const clearTransferInputFields = function () {
	inputTransferAmount.value = inputTransferTo.value = "";
	inputTransferTo.blur();
};

const clearCloseInputFields = function () {
	inputCloseUsername.value = inputClosePin.value = "";
	inputClosePin.blur();
};

//******************** Event handlers *******************
let currentAccount;
//***** Login implementation
btnLogin.addEventListener("click", function (e) {
	e.preventDefault();

	// find the account
	currentAccount = accounts.find(
		(acc) => acc.username === inputLoginUsername.value
	);

	// check the pin
	if (currentAccount?.pin === Number(inputLoginPin.value)) {
		// clear fields
		clearLoginInputFields();
		// display welcome msg and UI
		lblWelcome.textContent = `Welcome Back ${
			currentAccount.owner.split(" ")[0]
		}!`;
		containerApp.style.opacity = 100;
		// display transactions
		displayTransactions(currentAccount);
		// display balance
		displayBalance(currentAccount);
		// display summary
		displayAccountSummary(currentAccount);
	} else {
		// ADD VALIDATION
	}
});

//***** Transfer implementation
btnTransfer.addEventListener("click", function (e) {
	e.preventDefault();
	const transferAmount = inputTransferAmount.value.toLocaleString();
	const recipientAccount = accounts.find(
		(acc) => acc.username === inputTransferTo.value
	);
	// clear fields
	clearTransferInputFields();
	// validation
	if (
		transferAmount > 0 &&
		recipientAccount &&
		currentAccount.balance >= transferAmount &&
		recipientAccount?.username !== currentAccount.username
	) {
		// add transacations for user and recipient
		currentAccount.transactions.push(Number(-transferAmount));
		recipientAccount.transactions.push(Number(transferAmount));
		// display new transaction
		updateUI(currentAccount);
	} else {
		// ADD VALIDATION ERROR MSGS
	}
});

//***** Loan request implementation
// business rule: bank will only grant a loan if theres at least one deposit with 10% of the requested amount
btnLoan.addEventListener("click", function (e) {
	e.preventDefault();
	const requestAmount = Number(inputLoanAmount.value);

	if (
		requestAmount > 0 &&
		currentAccount.transactions.some((tran) => tran >= requestAmount * 0.1)
	) {
		// grant the loan
		currentAccount.transactions.push(requestAmount);
		// update the UI
		updateUI(currentAccount);
	} else {
		// ADD VALIDATION MSGS
	}

	// clear the input field
	inputLoanAmount.value = "";
});

//***** Close account implementation
btnClose.addEventListener("click", function (e) {
	e.preventDefault();
	const username = inputCloseUsername.value;
	const userPin = Number(inputClosePin.value);

	// check credentials
	if (username === currentAccount.username && userPin === currentAccount.pin) {
		// find account index
		const accountIndex = accounts.findIndex(
			(acc) => acc.username === currentAccount.username
		);
		// delete account
		accounts.splice(accountIndex, 1);
		console.log(accounts);
		// reset welcome msg
		lblWelcome.textContent = `Log in to get started`;
		// hide UI
		containerApp.style.opacity = 0;
	} else {
		// ADD VALIDATION ERROR MSGS
	}

	clearCloseInputFields();
});

//***** Sort transacations
// sorting state
let sortedTransactions = false;
btnSort.addEventListener("click", function (e) {
	e.preventDefault();
	displayTransactions(currentAccount, !sortedTransactions);
	sortedTransactions = !sortedTransactions;
	sortedTransactions === false
		? (iconSort.innerHTML = `&downarrow;`)
		: (iconSort.innerHTML = `&uparrow;`);
});

/***
 * TO DO
 * 1) Add proper error validation msgs
 * 2) Implement timer
 * 3) AODA
 */
